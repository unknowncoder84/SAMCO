"""Synchronous wrapper for Playwright scraper to work with Windows + uvicorn."""

import asyncio
import logging
from datetime import datetime
from typing import Optional
from concurrent.futures import ThreadPoolExecutor
import nest_asyncio

from .playwright_scraper import PlaywrightSamcoScraper
from .exceptions import HolidayException, FileNotUploadedException, BrowserAutomationException

# Allow nested event loops
nest_asyncio.apply()

logger = logging.getLogger(__name__)


class SyncPlaywrightSamcoScraper:
    """Synchronous wrapper for PlaywrightSamcoScraper that works on Windows."""
    
    def __init__(self, headless: bool = True, timeout: int = 30000):
        """Initialize the sync scraper."""
        self.headless = headless
        self.timeout = timeout
        self.executor = ThreadPoolExecutor(max_workers=1)
    
    def _run_in_thread(self, coro):
        """Run async coroutine in a separate thread with its own event loop."""
        def run():
            # Create new event loop for this thread
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                return loop.run_until_complete(coro)
            finally:
                loop.close()
        
        future = self.executor.submit(run)
        return future.result()
    
    async def fetch_segment_data(
        self, 
        segment: str, 
        date: datetime
    ) -> Optional[bytes]:
        """
        Download CSV file for a specific segment and date.
        
        This runs the Playwright scraper in a separate thread to avoid
        Windows event loop issues with uvicorn.
        
        Args:
            segment: Market segment ('NSE_CASH', 'NSE_FO', 'BSE', or 'MCX')
            date: Trading date to fetch data for
            
        Returns:
            CSV data as bytes, or None if not found
            
        Raises:
            HolidayException: If date is a weekend or public holiday
            FileNotUploadedException: If file hasn't been uploaded yet
            BrowserAutomationException: If browser automation fails
        """
        async def _fetch():
            async with PlaywrightSamcoScraper(
                headless=self.headless,
                timeout=self.timeout
            ) as scraper:
                return await scraper.fetch_segment_data(segment, date)
        
        # Run in separate thread with its own event loop
        return self._run_in_thread(_fetch())
    
    async def __aenter__(self):
        """Async context manager entry."""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        self.executor.shutdown(wait=True)
