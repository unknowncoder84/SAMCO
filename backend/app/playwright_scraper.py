"""Playwright-based browser automation scraper for Samco bhavcopy downloads."""

import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional
from playwright.async_api import async_playwright, Browser, BrowserContext, Page, Download
from .exceptions import HolidayException, FileNotUploadedException, BrowserAutomationException
from .holiday_checker import HolidayChecker


logger = logging.getLogger(__name__)


class PlaywrightSamcoScraper:
    """Browser automation scraper for Samco bhavcopy downloads."""
    
    # Segment mapping from frontend names to Samco identifiers
    SEGMENT_MAPPING = {
        "NSE_CASH": {
            "display_name": "NSE Cash",
            "samco_identifier": "NSE",
            "file_pattern": "NSE"
        },
        "NSE_FO": {
            "display_name": "NSE F&O",
            "samco_identifier": "NSEFO",
            "file_pattern": "NSEFO"
        },
        "BSE": {
            "display_name": "BSE",
            "samco_identifier": "BSE",
            "file_pattern": "BSE"
        },
        "MCX": {
            "display_name": "MCX",
            "samco_identifier": "MCX",
            "file_pattern": "MCX"
        }
    }
    
    def __init__(self, headless: bool = True, timeout: int = 30000):
        """
        Initialize the Playwright scraper.
        
        Args:
            headless: Run browser in headless mode (default: True)
            timeout: Timeout for browser operations in milliseconds (default: 30000)
        """
        self.headless = headless
        self.timeout = timeout
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
    
    async def __aenter__(self):
        """Async context manager entry."""
        self.playwright = await async_playwright().start()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()
    
    async def close(self):
        """Clean up browser resources."""
        if self.context:
            await self.context.close()
            self.context = None
        if self.browser:
            await self.browser.close()
            self.browser = None
        if self.playwright:
            await self.playwright.stop()
            self.playwright = None
    
    async def fetch_segment_data(
        self, 
        segment: str, 
        date: datetime
    ) -> Optional[bytes]:
        """
        Download CSV file for a specific segment and date.
        
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
        # Check for holidays BEFORE launching browser
        if HolidayChecker.is_holiday(date):
            raise HolidayException(HolidayChecker.get_holiday_message(date))
        
        browser = None
        context = None
        page = None
        
        try:
            # Launch browser
            try:
                browser = await self.playwright.chromium.launch(headless=self.headless)
                context = await browser.new_context(accept_downloads=True)
                page = await context.new_page()
                logger.info(f"Browser launched successfully for {segment} on {date.strftime('%Y-%m-%d')}")
            except Exception as e:
                raise BrowserAutomationException(f"Failed to launch browser: {str(e)}")
            
            # Navigate and download
            csv_data = await self._navigate_and_download(page, date, segment)
            return csv_data
            
        finally:
            # Always clean up resources
            if page:
                await page.close()
            if context:
                await context.close()
            if browser:
                await browser.close()
    
    async def _navigate_and_download(
        self, 
        page: Page, 
        date: datetime, 
        segment: str
    ) -> bytes:
        """
        Navigate to Samco and download file directly.
        
        The Samco page has a FORM with date inputs that submits via AJAX.
        We need to set the dates and trigger the form submission.
        
        Args:
            page: Playwright page object
            date: Date to fetch data for
            segment: Segment to download
            
        Returns:
            Downloaded file bytes
        """
        try:
            logger.info(f"[1/6] Navigating to Samco for {segment} on {date.strftime('%Y-%m-%d')}")
            await page.goto("https://www.samco.in/bhavcopy-nse-bse-mcx", timeout=self.timeout)
            
            # Wait for page to fully load
            await page.wait_for_load_state("domcontentloaded")
            await asyncio.sleep(3)
            logger.info("✓ Page loaded")
            
            # Set the date range
            logger.info(f"[2/6] Setting calendar to {date.strftime('%Y-%m-%d')}")
            
            try:
                date_str = date.strftime("%Y-%m-%d")
                
                # Set start_date
                await page.fill('input[name="start_date"]', date_str)
                await asyncio.sleep(0.5)
                
                # Set end_date  
                await page.fill('input[name="end_date"]', date_str)
                await asyncio.sleep(0.5)
                
                logger.info(f"✓ Set date range: {date_str} to {date_str}")
                
            except Exception as e:
                logger.error(f"Failed to set dates: {e}")
                raise BrowserAutomationException(f"Could not set calendar dates: {str(e)}")
            
            # Submit the form to load files for the selected date
            logger.info("[3/6] Submitting form and getting file list...")
            
            try:
                # Submit form and parse the response to get download links
                file_links = await page.evaluate("""async () => {
                    const form = document.querySelector('form[name="bhav_copy"]');
                    if (!form) return [];
                    
                    const formData = new FormData(form);
                    
                    try {
                        const response = await fetch(form.action, {
                            method: 'POST',
                            body: formData
                        });
                        
                        const html = await response.text();
                        
                        // Parse the HTML to extract download links
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const links = doc.querySelectorAll('a[href*="datacopy"]');
                        
                        const fileList = [];
                        links.forEach(link => {
                            fileList.push({
                                filename: link.textContent.trim(),
                                url: link.href
                            });
                        });
                        
                        return fileList;
                    } catch (error) {
                        return [];
                    }
                }""")
                
                if file_links and len(file_links) > 0:
                    logger.info(f"✓ Got {len(file_links)} files from form response")
                    
                    # Store the file links for later use
                    page._file_links_from_form = file_links
                else:
                    logger.warning("Form submission returned no files")
                    page._file_links_from_form = []
                
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.warning(f"Form submission issue: {e}")
                page._file_links_from_form = []
                await asyncio.sleep(1)
            
            logger.info("[4/6] Ready to download")
            
        except BrowserAutomationException:
            raise
        except Exception as e:
            raise BrowserAutomationException(f"Failed to navigate to Samco: {str(e)}")
        
        # Look for the download link
        try:
            # Format: YYYYMMDD_SEGMENT.csv
            date_format = date.strftime("%Y%m%d")
            segment_name = self.SEGMENT_MAPPING[segment]["samco_identifier"]
            expected_filename = f"{date_format}_{segment_name}.csv"
            
            logger.info(f"[5/6] Searching for file: {expected_filename}")
            
            # First, check if we have file links from the form response
            file_links_from_form = getattr(page, '_file_links_from_form', [])
            
            if file_links_from_form:
                logger.info(f"Using {len(file_links_from_form)} files from form response")
                
                # Search in form response files
                for file_info in file_links_from_form:
                    if file_info['filename'].lower() == expected_filename.lower():
                        logger.info(f"✓ Found {expected_filename} in form response")
                        
                        # Download directly using the URL
                        download_url = file_info['url']
                        logger.info(f"[6/6] Downloading from: {download_url}")
                        
                        # Create a temporary link and click it to trigger download
                        async with page.expect_download(timeout=self.timeout) as download_info:
                            await page.evaluate(f"""() => {{
                                const a = document.createElement('a');
                                a.href = '{download_url}';
                                a.download = '{expected_filename}';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }}""")
                        
                        download = await download_info.value
                        file_path = await download.path()
                        
                        with open(file_path, 'rb') as f:
                            csv_data = f.read()
                        
                        if len(csv_data) == 0:
                            raise FileNotUploadedException(
                                f"Downloaded file is empty for {date.strftime('%d-%b-%Y')}"
                            )
                        
                        logger.info(f"✓ SUCCESS: Downloaded {len(csv_data):,} bytes for {segment}")
                        return csv_data
                
                # File not found in form response
                available_files = [f['filename'] for f in file_links_from_form]
                raise FileNotUploadedException(
                    f"File {expected_filename} not available. Files for {date.strftime('%d-%b-%Y')}: {', '.join(available_files)}"
                )
            
            # Fallback: search in page DOM (shouldn't reach here if form worked)
            logger.warning("No files from form response, searching page DOM...")
            
            await asyncio.sleep(1)
            
            all_links = await page.query_selector_all("a[href*='datacopy'], a[href*='.csv']")
            available_files = []
            download_link = None
            
            for link in all_links:
                try:
                    text = await link.inner_text()
                    if text and ".csv" in text.lower():
                        filename = text.strip()
                        available_files.append(filename)
                        
                        if filename.lower() == expected_filename.lower():
                            download_link = link
                            logger.info(f"✓ Found target file in DOM: {expected_filename}")
                            break
                except:
                    continue
            
            if not download_link:
                if available_files:
                    raise FileNotUploadedException(
                        f"File {expected_filename} not available. Files shown: {', '.join(available_files[:10])}"
                    )
                else:
                    raise FileNotUploadedException(
                        f"No files available for {date.strftime('%d-%b-%Y')}"
                    )
            
            # Download the file
            logger.info(f"[6/6] Downloading {expected_filename}...")
            
            async with page.expect_download(timeout=self.timeout) as download_info:
                await download_link.click()
            
            download = await download_info.value
            file_path = await download.path()
            
            with open(file_path, 'rb') as f:
                csv_data = f.read()
            
            if len(csv_data) == 0:
                raise FileNotUploadedException(
                    f"Downloaded file is empty for {date.strftime('%d-%b-%Y')}"
                )
            
            logger.info(f"✓ SUCCESS: Downloaded {len(csv_data):,} bytes for {segment}")
            return csv_data
            
        except FileNotUploadedException:
            raise
        except Exception as e:
            if "Timeout" in str(e) or "timeout" in str(e):
                raise FileNotUploadedException(
                    f"Download timeout - file for {date.strftime('%d-%b-%Y')} may not be available yet"
                )
            logger.error(f"Download error: {type(e).__name__}: {e}")
            raise BrowserAutomationException(f"Download failed: {str(e)}")
