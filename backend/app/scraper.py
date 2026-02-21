"""
Web scraper module for fetching bhavcopy data from Samco.

This module fetches data from Samco's bhavcopy hosting service which provides
current day data for NSE, BSE, and MCX exchanges. Samco hosts the files themselves
and provides reliable access to current trading day data.
"""
import asyncio
import base64
from datetime import datetime
from typing import Optional

import httpx


class BhavcopyScraper:
    """Web scraper for Samco bhavcopy data with retry logic"""

    MAX_RETRIES = 3
    RETRY_DELAY = 2  # seconds (base delay for exponential backoff)
    TIMEOUT = 30.0  # seconds

    def __init__(self):
        """Initialize the scraper with an async HTTP client"""
        # Add headers to mimic a browser request
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Referer": "https://www.samco.in/bhavcopy-nse-bse-mcx",
            "Upgrade-Insecure-Requests": "1",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
        }
        self.client = httpx.AsyncClient(
            timeout=self.TIMEOUT,
            headers=headers,
            follow_redirects=True
        )
        self._session_initialized = False

    async def _initialize_session(self):
        """
        Initialize session by visiting the main bhavcopy page.
        This ensures cookies and session data are set before downloading.
        """
        if self._session_initialized:
            return
        
        try:
            # Visit the main bhavcopy page to establish session
            await self.client.get("https://www.samco.in/bhavcopy-nse-bse-mcx")
            self._session_initialized = True
        except Exception:
            # If this fails, continue anyway - the download might still work
            pass

    async def fetch_segment_data(
        self, segment: str, date: datetime
    ) -> Optional[bytes]:
        """
        Fetch CSV data for a specific segment and date with retry logic.

        Implements exponential backoff: waits 2s, 4s, 8s between retries.

        Args:
            segment: Market segment ('NSE_CASH', 'NSE_FO', 'BSE', or 'MCX')
            date: Trading date to fetch data for

        Returns:
            CSV data as bytes, or None if not found after all retries

        Raises:
            Exception: If all retry attempts fail
        """
        # Initialize session before first download
        await self._initialize_session()
        
        for attempt in range(self.MAX_RETRIES):
            try:
                # Build segment-specific URL
                url = self._build_samco_url(segment, date)

                # Fetch data
                response = await self.client.get(url)
                
                # Check status code
                if response.status_code == 404:
                    # File not found - return None
                    return None
                
                response.raise_for_status()

                # Return whatever content we got, even if empty
                return response.content

            except httpx.HTTPStatusError as e:
                # HTTP error (404, 500, etc.)
                if e.response.status_code == 404:
                    # File not found - return None on last attempt
                    if attempt >= self.MAX_RETRIES - 1:
                        return None
                else:
                    # Other HTTP error - retry
                    if attempt >= self.MAX_RETRIES - 1:
                        date_str = date.strftime("%d-%b-%Y")
                        raise Exception(
                            f"HTTP error {e.response.status_code} fetching {segment} "
                            f"data for {date_str}"
                        )
                
                # Calculate exponential backoff delay
                delay = self.RETRY_DELAY * (2**attempt)
                await asyncio.sleep(delay)

            except Exception as e:
                # If this was the last attempt, raise the exception
                if attempt >= self.MAX_RETRIES - 1:
                    date_str = date.strftime("%d-%b-%Y")
                    raise Exception(
                        f"Failed to fetch {segment} data for {date_str} "
                        f"after {self.MAX_RETRIES} attempts: {str(e)}"
                    )
                
                # Calculate exponential backoff delay: 2^attempt * base_delay
                delay = self.RETRY_DELAY * (2**attempt)
                await asyncio.sleep(delay)

        # This should never be reached, but just in case
        return None

    def _build_samco_url(self, segment: str, date: datetime) -> str:
        """
        Build the Samco download URL for a specific segment and date.

        Samco hosts bhavcopy files at:
        https://www.samco.in/bse_nse_mcx/datacopy/BASE64_ENCODED_PATH

        Where the path is:
        /var/www/html/samco/public_html/Downloads/bhavcopy_data/YYYY-MM-DD/YYYYMMDD_SEGMENT.csv

        Args:
            segment: Market segment ('NSE_CASH', 'NSE_FO', 'BSE', or 'MCX')
            date: Trading date

        Returns:
            str: Complete URL for downloading the data

        Raises:
            ValueError: If segment is not recognized
        """
        # Format date for folder and filename
        date_folder = date.strftime("%Y-%m-%d")  # 2026-02-06
        date_file = date.strftime("%Y%m%d")  # 20260206
        
        # Map segment to Samco filename
        segment_map = {
            "NSE_CASH": "NSE",
            "NSE_FO": "NSEFO",
            "BSE": "BSE",
            "MCX": "MCX",
        }
        
        if segment not in segment_map:
            raise ValueError(f"Unknown segment: {segment}")
        
        samco_segment = segment_map[segment]
        filename = f"{date_file}_{samco_segment}.csv"
        
        # Construct the full server path
        full_path = f"/var/www/html/samco/public_html/Downloads/bhavcopy_data/{date_folder}/{filename}"
        
        # Base64 encode the path
        encoded_path = base64.b64encode(full_path.encode()).decode()
        
        # Build the final URL
        url = f"https://www.samco.in/bse_nse_mcx/datacopy/{encoded_path}"
        
        return url

    async def close(self):
        """Close the HTTP client and release resources"""
        await self.client.aclose()

    async def __aenter__(self):
        """Async context manager entry"""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit - ensures client is closed"""
        await self.close()

