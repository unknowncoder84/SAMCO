"""
Data processing module with dynamic column detection.

This module handles CSV processing without hard-coded column names,
using regex patterns to identify date/time columns and symbol columns.
"""
import re
from typing import List, Optional
import pandas as pd
from io import BytesIO


class DataProcessor:
    """Dynamic data processing with regex-based column detection"""

    # Regex patterns for column detection
    DATE_PATTERNS = [r".*DATE.*", r".*DT.*", r".*TIME.*", r".*EXPIRY.*", r".*EXPIR.*"]
    SYMBOL_PATTERNS = ["SYMBOL", "SCRIP", "INSTRUMENT"]

    @classmethod
    def process_csv(
        cls, csv_data: bytes, symbols: Optional[List[str]] = None, filter_year: Optional[int] = None
    ) -> pd.DataFrame:
        """
        Process CSV data with dynamic column detection.

        Steps:
        1. Load CSV into DataFrame
        2. Filter by year if provided (BEFORE formatting dates)
        3. Detect and format date columns
        4. Filter by symbols if provided
        5. Sort by date (most recent first)
        6. Return processed DataFrame

        Args:
            csv_data: Raw CSV data as bytes
            symbols: Optional list of symbols to filter by
            filter_year: Optional year to filter data (e.g., 2026)

        Returns:
            Processed DataFrame
        """
        # Load CSV - ensure numeric columns are read correctly
        df = pd.read_csv(BytesIO(csv_data), low_memory=False)
        
        # Filter by year FIRST (before any date formatting)
        if filter_year:
            df = cls._filter_by_year(df, filter_year)
        
        # Convert numeric columns properly
        for col in df.columns:
            # Skip date/time columns
            if any(re.match(pattern, col, re.IGNORECASE) for pattern in cls.DATE_PATTERNS):
                continue
            
            # Try to convert to numeric if possible
            try:
                df[col] = pd.to_numeric(df[col], errors='ignore')
            except:
                pass

        # Process date columns (format them)
        df = cls._format_date_columns(df)

        # Filter by symbols if provided
        if symbols:
            df = cls._filter_by_symbols(df, symbols)

        # Sort by date (most recent first)
        df = cls._sort_by_date(df)

        return df

    @classmethod
    def _filter_by_year(cls, df: pd.DataFrame, year: int) -> pd.DataFrame:
        """
        Filter DataFrame to only include rows from the specified year.
        
        Checks all date columns and filters rows where ANY date column
        matches the specified year.
        
        Args:
            df: Input DataFrame
            year: Year to filter by (e.g., 2026)
        
        Returns:
            Filtered DataFrame containing only rows from the specified year
        """
        if len(df) == 0:
            return df
        
        # Find all date columns
        date_columns = []
        for col in df.columns:
            if any(re.match(pattern, col, re.IGNORECASE) for pattern in cls.DATE_PATTERNS):
                date_columns.append(col)
        
        if not date_columns:
            # No date columns found, return as-is
            return df
        
        # Create a mask for rows matching the year
        year_mask = pd.Series([False] * len(df))
        
        for col in date_columns:
            try:
                # Convert to datetime
                dates = pd.to_datetime(df[col], errors='coerce')
                # Check if year matches
                col_mask = dates.dt.year == year
                # Combine with OR logic (any date column matches)
                year_mask = year_mask | col_mask
            except Exception:
                # If conversion fails, skip this column
                continue
        
        # Filter DataFrame
        return df[year_mask].copy()

    @classmethod
    def _format_date_columns(cls, df: pd.DataFrame) -> pd.DataFrame:
        """
        Detect date columns using regex and format them.

        Converts datetime columns to string format: DD-MMM-YYYY
        Removes time components (HH:MM:SS)

        Args:
            df: Input DataFrame

        Returns:
            DataFrame with formatted date columns
        """
        for col in df.columns:
            # Check if column name matches date patterns
            if any(
                re.match(pattern, col, re.IGNORECASE) for pattern in cls.DATE_PATTERNS
            ):
                try:
                    # Only convert if it's actually a datetime-like column
                    # Check if the column contains date-like strings
                    sample = str(df[col].iloc[0]) if len(df) > 0 else ""
                    if '-' in sample or '/' in sample:
                        # Convert to datetime then to string format
                        df[col] = pd.to_datetime(df[col], errors="coerce").dt.strftime(
                            "%d-%b-%Y"
                        )
                except Exception:
                    # If conversion fails, leave as-is
                    pass

        return df

    @classmethod
    def _filter_by_symbols(
        cls, df: pd.DataFrame, symbols: List[str]
    ) -> pd.DataFrame:
        """
        Filter DataFrame by symbol list using dynamic column detection.

        Searches for symbol column using SYMBOL_PATTERNS
        Performs case-insensitive matching

        Args:
            df: Input DataFrame
            symbols: List of symbols to filter by

        Returns:
            Filtered DataFrame

        Raises:
            ValueError: If symbol column cannot be identified
        """
        # Find symbol column
        symbol_col = cls._find_symbol_column(df)

        if not symbol_col:
            raise ValueError("Could not identify symbol column in data")

        # Normalize symbols for case-insensitive matching
        symbols_upper = [s.upper() for s in symbols]

        # Filter DataFrame
        mask = df[symbol_col].str.upper().isin(symbols_upper)
        return df[mask].copy()

    @classmethod
    def _find_symbol_column(cls, df: pd.DataFrame) -> Optional[str]:
        """
        Find the symbol column using pattern matching.

        Args:
            df: Input DataFrame

        Returns:
            Column name if found, None otherwise
        """
        for col in df.columns:
            if col.upper() in cls.SYMBOL_PATTERNS:
                return col
        return None

    @classmethod
    def sort_fo_data(cls, df: pd.DataFrame) -> pd.DataFrame:
        """
        Sort F&O data by EXPIRY_DT then STRIKE_PR.

        Uses dynamic column detection

        Args:
            df: Input DataFrame

        Returns:
            Sorted DataFrame
        """
        # Find expiry and strike columns
        expiry_col = None
        strike_col = None

        for col in df.columns:
            col_upper = col.upper()
            if "EXPIRY" in col_upper:
                expiry_col = col
            if "STRIKE" in col_upper:
                strike_col = col

        # Sort if columns found
        sort_cols = []
        if expiry_col:
            sort_cols.append(expiry_col)
        if strike_col:
            sort_cols.append(strike_col)

        if sort_cols:
            df = df.sort_values(by=sort_cols).copy()

        return df

    @classmethod
    def _sort_by_date(cls, df: pd.DataFrame) -> pd.DataFrame:
        """
        Sort DataFrame by date column (most recent first).

        Args:
            df: Input DataFrame

        Returns:
            Sorted DataFrame
        """
        # Find date column
        date_col = None
        for col in df.columns:
            if any(
                re.match(pattern, col, re.IGNORECASE) for pattern in cls.DATE_PATTERNS
            ):
                date_col = col
                break
        
        if date_col and len(df) > 0:
            try:
                # Convert to datetime for proper sorting
                df['_sort_date'] = pd.to_datetime(df[date_col], errors='coerce')
                # Sort descending (most recent first)
                df = df.sort_values(by='_sort_date', ascending=False).copy()
                # Drop temporary column
                df = df.drop(columns=['_sort_date'])
            except Exception:
                # If sorting fails, return as-is
                pass
        
        return df
