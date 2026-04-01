import mysql.connector
import pandas as pd
from logger import get_logger
from config import DB_CONFIG, PIPELINE_CONFIG

logger = get_logger("storage")

class MySQLStorage:

    def __init__(self):
        self.conn   = None
        self.cursor = None

    def connect(self):
        try:
            self.conn   = mysql.connector.connect(**DB_CONFIG)
            self.cursor = self.conn.cursor()
            logger.info("Connected to MySQL")
        except Exception as e:
            logger.error(f"MySQL connection failed: {e}")
            raise

    def disconnect(self):
        if self.cursor: self.cursor.close()
        if self.conn:   self.conn.close()
        logger.info("MySQL disconnected")

    def create_tables(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS stock_prices (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                date        DATE NOT NULL,
                symbol      VARCHAR(20),
                open_price  DECIMAL(12,2),
                high_price  DECIMAL(12,2),
                low_price   DECIMAL(12,2),
                close_price DECIMAL(12,2),
                volume      BIGINT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_date_symbol (date, symbol)
            )
        """)
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS pipeline_runs (
                id             INT AUTO_INCREMENT PRIMARY KEY,
                run_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status         VARCHAR(20),
                rows_extracted INT DEFAULT 0,
                rows_loaded    INT DEFAULT 0,
                rows_rejected  INT DEFAULT 0,
                duration_sec   FLOAT,
                error_message  TEXT,
                source_file    VARCHAR(255)
            )
        """)
        self.conn.commit()
        logger.info("Tables ready")

    def load_dataframe(self, df, symbol):
        rows_inserted = 0
        batch_size    = PIPELINE_CONFIG["batch_size"]
        insert_sql    = """
            INSERT INTO stock_prices
                (date, symbol, open_price, high_price, low_price, close_price, volume)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                open_price  = VALUES(open_price),
                high_price  = VALUES(high_price),
                low_price   = VALUES(low_price),
                close_price = VALUES(close_price),
                volume      = VALUES(volume)
        """
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i + batch_size]
            rows  = []
            for _, row in batch.iterrows():
                rows.append((
                    row.get("DATE"),
                    symbol,
                    row.get("OPEN"),
                    row.get("HIGH"),
                    row.get("LOW"),
                    row.get("CLOSE"),
                    row.get("VOLUME")
                ))
            try:
                self.cursor.executemany(insert_sql, rows)
                self.conn.commit()
                rows_inserted += len(rows)
                logger.info(f"Inserted batch of {len(rows)} rows")
            except Exception as e:
                logger.error(f"Batch failed: {e}")
                self.conn.rollback()
                raise
        return rows_inserted

    def log_pipeline_run(self, metrics, source_file=""):
        sql = """
            INSERT INTO pipeline_runs
                (status, rows_extracted, rows_loaded, rows_rejected, duration_sec, error_message, source_file)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        error_msg = "; ".join(metrics.get("errors", [])) or None
        self.cursor.execute(sql, (
            metrics["status"],
            metrics["rows_extracted"],
            metrics["rows_loaded"],
            metrics["rows_rejected"],
            metrics["duration_sec"],
            error_msg,
            source_file
        ))
        self.conn.commit()

    def get_latest_runs(self, limit=10):
        self.cursor.execute("""
            SELECT run_at, status, rows_loaded, duration_sec, error_message
            FROM pipeline_runs
            ORDER BY run_at DESC
            LIMIT %s
        """, (limit,))
        return self.cursor.fetchall()