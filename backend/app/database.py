"""
Database connection and models for Supabase PostgreSQL
"""
from sqlalchemy import create_engine, Column, String, Integer, BigInteger, Boolean, DateTime, Date, ARRAY, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import os
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

# Get database URL from environment (optional - only if you want to use database)
DATABASE_URL = os.getenv("DATABASE_URL")

# Only create engine if DATABASE_URL is provided
engine = None
SessionLocal = None

if DATABASE_URL:
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("[Database] Connected to Supabase PostgreSQL")
    except Exception as e:
        logger.warning(f"[Database] Could not connect to database: {e}")
        logger.warning("[Database] App will run without database features")

Base = declarative_base()

# Models
class Download(Base):
    """Track CSV download history"""
    __tablename__ = "downloads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    date = Column(Date, nullable=False)
    segment = Column(String(20), nullable=False)
    filename = Column(String(255), nullable=False)
    file_size = Column(BigInteger)
    row_count = Column(Integer)
    user_id = Column(String(255))
    status = Column(String(20), default="completed")

class ProcessingHistory(Base):
    """Track CSV to Excel conversion history"""
    __tablename__ = "processing_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    original_filename = Column(String(255), nullable=False)
    output_filename = Column(String(255), nullable=False)
    original_rows = Column(Integer)
    filtered_rows = Column(Integer)
    columns_selected = Column(ARRAY(String))
    include_pe = Column(Boolean, default=True)
    include_ce = Column(Boolean, default=True)
    user_id = Column(String(255))
    processing_time_ms = Column(Integer)

class UserSettings(Base):
    """Store user preferences"""
    __tablename__ = "user_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), unique=True, nullable=False)
    default_segment = Column(String(20), default="NSE_FO")
    auto_download = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Dependency
def get_db():
    """Get database session"""
    if SessionLocal is None:
        logger.warning("[Database] No database connection available")
        return None
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions
def log_download(date, segment, filename, file_size=None, row_count=None, user_id=None):
    """Log a CSV download to database"""
    if SessionLocal is None:
        return
    
    try:
        db = SessionLocal()
        download = Download(
            date=date,
            segment=segment,
            filename=filename,
            file_size=file_size,
            row_count=row_count,
            user_id=user_id,
            status="completed"
        )
        db.add(download)
        db.commit()
        logger.info(f"[Database] Logged download: {filename}")
    except Exception as e:
        logger.error(f"[Database] Failed to log download: {e}")
    finally:
        db.close()

def log_processing(original_filename, output_filename, original_rows, filtered_rows, 
                   columns_selected, include_pe, include_ce, processing_time_ms, user_id=None):
    """Log a CSV to Excel conversion to database"""
    if SessionLocal is None:
        return
    
    try:
        db = SessionLocal()
        processing = ProcessingHistory(
            original_filename=original_filename,
            output_filename=output_filename,
            original_rows=original_rows,
            filtered_rows=filtered_rows,
            columns_selected=columns_selected,
            include_pe=include_pe,
            include_ce=include_ce,
            user_id=user_id,
            processing_time_ms=processing_time_ms
        )
        db.add(processing)
        db.commit()
        logger.info(f"[Database] Logged processing: {output_filename}")
    except Exception as e:
        logger.error(f"[Database] Failed to log processing: {e}")
    finally:
        db.close()

def get_user_settings(user_id):
    """Get user settings from database"""
    if SessionLocal is None:
        return None
    
    try:
        db = SessionLocal()
        settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
        return settings
    except Exception as e:
        logger.error(f"[Database] Failed to get user settings: {e}")
        return None
    finally:
        db.close()

def create_tables():
    """Create all tables in database"""
    if engine is None:
        logger.warning("[Database] Cannot create tables - no database connection")
        return
    
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("[Database] Tables created successfully")
    except Exception as e:
        logger.error(f"[Database] Failed to create tables: {e}")
