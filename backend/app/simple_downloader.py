"""
Simple downloader that runs Playwright in a subprocess to avoid event loop issues.
"""
import subprocess
import sys
import json
from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class SimplePlaywrightDownloader:
    """Downloads files using Playwright in a subprocess."""
    
    @staticmethod
    def download(segment: str, date: datetime) -> Optional[bytes]:
        """
        Download file using Playwright in a subprocess.
        
        Args:
            segment: Market segment
            date: Trading date
            
        Returns:
            CSV data as bytes, or None if not found
        """
        # Create a Python script to run in subprocess
        script = f'''
import asyncio
import sys
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, r"{sys.path[0]}")

from app.playwright_scraper import PlaywrightSamcoScraper

async def main():
    date = datetime.strptime("{date.strftime('%Y-%m-%d')}", "%Y-%m-%d")
    segment = "{segment}"
    
    try:
        async with PlaywrightSamcoScraper(headless=True) as scraper:
            data = await scraper.fetch_segment_data(segment, date)
            if data:
                # Write to stdout as base64
                import base64
                print("SUCCESS:" + base64.b64encode(data).decode())
            else:
                print("ERROR:No data returned")
    except Exception as e:
        print(f"ERROR:{{type(e).__name__}}: {{str(e)}}")

asyncio.run(main())
'''
        
        try:
            # Run the script in a subprocess
            result = subprocess.run(
                [sys.executable, "-c", script],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=sys.path[0]
            )
            
            output = result.stdout.strip()
            
            if output.startswith("SUCCESS:"):
                # Decode base64 data
                import base64
                data_b64 = output.replace("SUCCESS:", "")
                return base64.b64decode(data_b64)
            elif output.startswith("ERROR:"):
                error_msg = output.replace("ERROR:", "")
                logger.error(f"[SimpleDownloader] {error_msg}")
                from .exceptions import FileNotUploadedException
                raise FileNotUploadedException(error_msg)
            else:
                logger.error(f"[SimpleDownloader] Unexpected output: {output}")
                return None
                
        except subprocess.TimeoutExpired:
            logger.error("[SimpleDownloader] Download timeout")
            return None
        except Exception as e:
            logger.error(f"[SimpleDownloader] Error: {e}")
            raise
