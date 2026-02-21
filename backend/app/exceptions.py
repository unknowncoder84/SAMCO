"""Custom exceptions for the Samco scraper."""


class HolidayException(Exception):
    """Raised when selected date is a holiday (weekend or public holiday)."""
    pass


class FileNotUploadedException(Exception):
    """Raised when file hasn't been uploaded to Samco yet."""
    pass


class BrowserAutomationException(Exception):
    """Raised when browser automation fails."""
    pass
