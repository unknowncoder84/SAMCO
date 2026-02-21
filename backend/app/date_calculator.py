"""
Date calculation module for intelligent trading date determination.

This module handles segment-specific cutoff logic for NSE and MCX markets,
with automatic weekend and holiday handling.
"""
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from typing import List


class DateCalculator:
    """Intelligent date calculation for different market segments"""

    IST = ZoneInfo("Asia/Kolkata")
    NSE_CUTOFF_HOUR = 18  # 6:00 PM
    MCX_CUTOFF_HOUR = 1  # 1:00 AM

    # List of known market holidays (format: 'YYYY-MM-DD')
    # This should be updated annually with official NSE/MCX holiday calendar
    HOLIDAYS: List[str] = [
        # 2024 holidays
        "2024-01-26",  # Republic Day
        "2024-03-08",  # Maha Shivaratri
        "2024-03-25",  # Holi
        "2024-03-29",  # Good Friday
        "2024-04-11",  # Id-Ul-Fitr
        "2024-04-17",  # Ram Navami
        "2024-04-21",  # Mahavir Jayanti
        "2024-05-01",  # Maharashtra Day
        "2024-05-23",  # Buddha Purnima
        "2024-06-17",  # Bakri Id
        "2024-07-17",  # Muharram
        "2024-08-15",  # Independence Day
        "2024-08-26",  # Janmashtami
        "2024-10-02",  # Gandhi Jayanti
        "2024-10-12",  # Dussehra
        "2024-10-31",  # Diwali Laxmi Pujan
        "2024-11-01",  # Diwali Balipratipada
        "2024-11-15",  # Gurunanak Jayanti
        "2024-12-25",  # Christmas
        # 2025 holidays (add as needed)
        "2025-01-26",  # Republic Day
        "2025-03-14",  # Holi
        "2025-03-31",  # Id-Ul-Fitr
        "2025-04-10",  # Mahavir Jayanti
        "2025-04-14",  # Dr. Ambedkar Jayanti
        "2025-04-18",  # Good Friday
        "2025-05-01",  # Maharashtra Day
        "2025-06-06",  # Bakri Id
        "2025-08-15",  # Independence Day
        "2025-08-27",  # Janmashtami
        "2025-10-02",  # Gandhi Jayanti
        "2025-10-20",  # Diwali Laxmi Pujan
        "2025-10-21",  # Diwali Balipratipada
        "2025-11-05",  # Gurunanak Jayanti
        "2025-12-25",  # Christmas
    ]

    @classmethod
    def get_trading_date(cls, segment: str, current_time: datetime | None = None) -> datetime:
        """
        Calculate the appropriate trading date for a segment.

        Logic:
        - NSE (Cash/FO): Before 6 PM → previous day, After 6 PM → current day
        - MCX: Before 1 AM → previous day, After 1 AM → current day
        - Skip weekends and holidays

        Args:
            segment: Market segment ('NSE_CASH', 'NSE_FO', or 'MCX')
            current_time: Optional datetime for testing; uses current IST time if None

        Returns:
            datetime: The appropriate trading date

        Raises:
            ValueError: If segment is not recognized
        """
        if current_time is None:
            now = datetime.now(cls.IST)
        else:
            # Ensure the provided time has IST timezone
            if current_time.tzinfo is None:
                now = current_time.replace(tzinfo=cls.IST)
            else:
                now = current_time.astimezone(cls.IST)

        # Determine cutoff hour based on segment
        if segment in ["NSE_CASH", "NSE_FO"]:
            cutoff_hour = cls.NSE_CUTOFF_HOUR
        elif segment == "MCX":
            cutoff_hour = cls.MCX_CUTOFF_HOUR
        else:
            raise ValueError(f"Unknown segment: {segment}")

        # Determine base date based on cutoff time
        if now.hour < cutoff_hour:
            target_date = now - timedelta(days=1)
        else:
            target_date = now

        # Skip weekends and holidays to find the most recent trading day
        return cls._get_previous_trading_day(target_date)

    @classmethod
    def _get_previous_trading_day(cls, date: datetime) -> datetime:
        """
        Find the most recent trading day (skip weekends and holidays).

        Args:
            date: Starting date to check

        Returns:
            datetime: The most recent trading day
        """
        # Keep going back until we find a trading day
        while date.weekday() >= 5 or date.strftime("%Y-%m-%d") in cls.HOLIDAYS:
            date -= timedelta(days=1)
        return date

    @classmethod
    def format_for_url(cls, date: datetime) -> str:
        """
        Format date for Samco URL (DD-MMM-YYYY).

        Args:
            date: Date to format

        Returns:
            str: Formatted date string (e.g., '15-Jan-2024')
        """
        return date.strftime("%d-%b-%Y")
