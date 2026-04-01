# validate.py — Data validation layer
# Senior principle: garbage in = garbage out. Validate BEFORE loading

import pandas as pd
from logger import get_logger
from config import VALIDATION_CONFIG

logger = get_logger("validator")


class DataValidator:
    """
    Validates stock data before loading to MySQL.
    Interview talking point: "I added a validation layer to ensure
    data quality before it hits the database — prevents silent corruption"
    """

    def __init__(self):
        self.errors   = []
        self.warnings = []

    def validate(self, df: pd.DataFrame):
        """
        Returns (is_valid, cleaned_df)
        Staff principle: return both result AND cleaned data
        so caller doesn't have to re-process
        """
        self.errors   = []
        self.warnings = []

        # Check 1 — minimum rows
        if len(df) < VALIDATION_CONFIG["min_rows"]:
            self.errors.append(f"Too few rows: {len(df)} < {VALIDATION_CONFIG['min_rows']}")
            return False, df

        # Check 2 — required columns present
        missing = [c for c in VALIDATION_CONFIG["required_columns"] if c not in df.columns]
        if missing:
            # Try case-insensitive match
            df.columns = df.columns.str.upper().str.strip()
            missing = [c for c in VALIDATION_CONFIG["required_columns"] if c not in df.columns]
            if missing:
                self.errors.append(f"Missing required columns: {missing}")
                return False, df

        # Check 3 — null percentage per column
        for col in df.columns:
            null_pct = df[col].isnull().mean()
            if null_pct > VALIDATION_CONFIG["max_null_pct"]:
                self.warnings.append(f"Column '{col}' has {null_pct:.1%} nulls")

        # Check 4 — numeric columns should be numeric
        numeric_cols = ["OPEN", "HIGH", "LOW", "CLOSE", "VOLUME"]
        for col in numeric_cols:
            if col in df.columns:
                # Remove commas and convert
                df[col] = df[col].astype(str).str.replace(",", "")
                df[col] = pd.to_numeric(df[col], errors="coerce")
                bad_rows = df[col].isnull().sum()
                if bad_rows > 0:
                    self.warnings.append(f"Column '{col}' has {bad_rows} non-numeric values — coerced to NaN")

        # Check 5 — DATE column parseable
        if "DATE" in df.columns:
            try:
                df["DATE"] = pd.to_datetime(df["DATE"], dayfirst=True)
            except Exception as e:
                self.errors.append(f"DATE column not parseable: {e}")
                return False, df

        # Check 6 — price logic (HIGH >= LOW)
        if "HIGH" in df.columns and "LOW" in df.columns:
            invalid_prices = (df["HIGH"] < df["LOW"]).sum()
            if invalid_prices > 0:
                self.warnings.append(f"{invalid_prices} rows where HIGH < LOW — possible data error")

        # Check 7 — no duplicate dates
        if "DATE" in df.columns:
            dupes = df["DATE"].duplicated().sum()
            if dupes > 0:
                self.warnings.append(f"{dupes} duplicate dates found — keeping first occurrence")
                df = df.drop_duplicates(subset=["DATE"], keep="first")

        # Drop rows with all NaN
        df = df.dropna(how="all")

        # Log results
        if self.warnings:
            for w in self.warnings:
                logger.warning(w)

        logger.info(f"Validation passed: {len(df)} rows clean")
        return True, df

    def report(self) -> dict:
        return {
            "passed":   len(self.errors) == 0,
            "errors":   self.errors,
            "warnings": self.warnings
        }