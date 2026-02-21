"""Holiday checker for validating trading days."""

from datetime import datetime
from typing import List


class HolidayChecker:
    """Validates trading days and identifies holidays."""
    
    # Holiday calendar for Indian stock markets (2024-2026)
    # This list should be updated annually
    HOLIDAYS: List[str] = [
        # 2024 Holidays
        "2024-01-26",  # Republic Day
        "2024-03-08",  # Maha Shivaratri
        "2024-03-25",  # Holi
        "2024-03-29",  # Good Friday
        "2024-04-11",  # Id-Ul-Fitr
        "2024-04-17",  # Ram Navami
        "2024-04-21",  # Mahavir Jayanti
        "2024-05-01",  # Maharashtra Day
        "2024-05-23",  # Buddha Pournima
        "2024-06-17",  # Bakri Id
        "2024-07-17",  # Muharram
        "2024-08-15",  # Independence Day
        "2024-08-26",  # Janmashtami
        "2024-09-16",  # Milad-Un-Nabi
        "2024-10-02",  # Mahatma Gandhi Jayanti
        "2024-10-12",  # Dussehra
        "2024-10-31",  # Diwali Laxmi Pujan
        "2024-11-01",  # Diwali Balipratipada
        "2024-11-15",  # Gurunanak Jayanti
        "2024-12-25",  # Christmas
        
        # 2025 Holidays
        "2025-01-26",  # Republic Day
        "2025-02-26",  # Maha Shivaratri
        "2025-03-14",  # Holi
        "2025-03-31",  # Id-Ul-Fitr
        "2025-04-10",  # Mahavir Jayanti
        "2025-04-14",  # Dr. Ambedkar Jayanti
        "2025-04-18",  # Good Friday
        "2025-05-01",  # Maharashtra Day
        "2025-05-12",  # Buddha Pournima
        "2025-06-07",  # Bakri Id
        "2025-08-15",  # Independence Day
        "2025-08-16",  # Parsi New Year
        "2025-08-27",  # Janmashtami
        "2025-09-05",  # Ganesh Chaturthi
        "2025-10-02",  # Mahatma Gandhi Jayanti
        "2025-10-02",  # Dussehra
        "2025-10-20",  # Diwali Laxmi Pujan
        "2025-10-21",  # Diwali Balipratipada
        "2025-11-05",  # Gurunanak Jayanti
        "2025-12-25",  # Christmas
        
        # 2026 Holidays
        "2026-01-26",  # Republic Day
        "2026-02-16",  # Maha Shivaratri
        "2026-03-03",  # Holi
        "2026-03-20",  # Id-Ul-Fitr
        "2026-03-30",  # Ram Navami
        "2026-04-02",  # Mahavir Jayanti
        "2026-04-03",  # Good Friday
        "2026-04-14",  # Dr. Ambedkar Jayanti
        "2026-05-01",  # Maharashtra Day
        "2026-05-01",  # Buddha Pournima
        "2026-05-27",  # Bakri Id
        "2026-08-15",  # Independence Day
        "2026-08-16",  # Janmashtami
        "2026-08-25",  # Ganesh Chaturthi
        "2026-09-24",  # Milad-Un-Nabi
        "2026-10-02",  # Mahatma Gandhi Jayanti
        "2026-10-21",  # Dussehra
        "2026-11-08",  # Diwali Laxmi Pujan
        "2026-11-09",  # Diwali Balipratipada
        "2026-11-25",  # Gurunanak Jayanti
        "2026-12-25",  # Christmas
    ]
    
    @classmethod
    def is_holiday(cls, date: datetime) -> bool:
        """
        Check if a date is a holiday (weekend or public holiday).
        
        Args:
            date: Date to check
            
        Returns:
            True if holiday, False if trading day
        """
        return cls.is_weekend(date) or cls.is_public_holiday(date)
    
    @classmethod
    def is_weekend(cls, date: datetime) -> bool:
        """
        Check if a date is a weekend (Saturday or Sunday).
        
        Args:
            date: Date to check
            
        Returns:
            True if weekend (Saturday=5, Sunday=6), False otherwise
        """
        return date.weekday() in [5, 6]  # Saturday=5, Sunday=6
    
    @classmethod
    def is_public_holiday(cls, date: datetime) -> bool:
        """
        Check if a date is a public holiday.
        
        Args:
            date: Date to check
            
        Returns:
            True if public holiday, False otherwise
        """
        date_str = date.strftime("%Y-%m-%d")
        return date_str in cls.HOLIDAYS
    
    @classmethod
    def get_holiday_message(cls, date: datetime) -> str:
        """
        Get appropriate error message for a holiday.
        
        Args:
            date: Holiday date
            
        Returns:
            User-friendly error message
        """
        return "Selected day is holiday"
