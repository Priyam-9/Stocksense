import pandas as pd
import os
import sys
from logger import get_logger, PipelineMetrics
from validate import DataValidator
from storage import MySQLStorage
from config import PIPELINE_CONFIG

logger = get_logger("pipeline")

class StockDataPipeline:

    def __init__(self):
        self.validator = DataValidator()
        self.storage   = MySQLStorage()
        self.metrics   = PipelineMetrics()

    def extract(self, file_path):
        logger.info(f"Extracting: {file_path}")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        df = pd.read_csv(file_path)
        self.metrics.rows_extracted = len(df)
        logger.info(f"Extracted {len(df)} rows")
        return df

    def validate(self, df):
        logger.info("Validating data...")
        is_valid, clean_df = self.validator.validate(df)
        report = self.validator.report()
        if not is_valid:
            raise ValueError(f"Validation failed: {report['errors']}")
        self.metrics.rows_validated = len(clean_df)
        self.metrics.rows_rejected  = len(df) - len(clean_df)
        logger.info(f"Validation passed: {len(clean_df)} rows")
        return clean_df

    def transform(self, df):
        logger.info("Transforming data...")
        if all(c in df.columns for c in ["CLOSE", "OPEN"]):
            df["DAILY_CHANGE_PCT"] = ((df["CLOSE"] - df["OPEN"]) / df["OPEN"] * 100).round(2)
        if all(c in df.columns for c in ["HIGH", "LOW"]):
            df["DAILY_RANGE"] = (df["HIGH"] - df["LOW"]).round(2)
        if "DATE" in df.columns:
            df = df.sort_values("DATE").reset_index(drop=True)
        logger.info("Transform complete")
        return df

    def load(self, df, symbol, source_file):
        logger.info(f"Loading {len(df)} rows to MySQL...")
        self.storage.connect()
        self.storage.create_tables()
        rows_loaded = self.storage.load_dataframe(df, symbol)
        self.metrics.rows_loaded = rows_loaded
        logger.info(f"Loaded {rows_loaded} rows")
        return rows_loaded

    def run(self, file_path, symbol="UNKNOWN"):
        self.metrics.start()
        logger.info(f"Pipeline started | {file_path} | {symbol}")

        retries = 0
        max_retries = PIPELINE_CONFIG["max_retries"]

        while retries <= max_retries:
            try:
                raw_df   = self.extract(file_path)
                clean_df = self.validate(raw_df)
                final_df = self.transform(clean_df)
                self.load(final_df, symbol, file_path)
                self.metrics.finish(success=True)
                break
            except Exception as e:
                retries += 1
                self.metrics.errors.append(str(e))
                logger.error(f"Error attempt {retries}: {e}")
                if retries > max_retries:
                    self.metrics.finish(success=False)
                    break

        try:
            summary = self.metrics.summary()
            self.storage.log_pipeline_run(summary, file_path)
            self.storage.disconnect()
        except Exception:
            pass

        summary = self.metrics.summary()
        logger.info(f"Pipeline finished | {summary['status']}")
        return summary


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <csv_file> [symbol]")
        sys.exit(1)

    file_path = sys.argv[1]
    symbol    = sys.argv[2] if len(sys.argv) > 2 else "UNKNOWN"

    pipeline = StockDataPipeline()
    result   = pipeline.run(file_path, symbol)

    print("\n Pipeline Summary:")
    for k, v in result.items():
        print(f"  {k:20}: {v}")