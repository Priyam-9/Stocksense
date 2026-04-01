# config.py — All settings in one place
# Senior principle: never hardcode configs in logic files

import os
from dotenv import load_dotenv

load_dotenv()

# MySQL Config
DB_CONFIG = {
    "host":     os.getenv("MYSQL_HOST", "localhost"),
    "user":     os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DATABASE", "stocksense"),
    "port":     int(os.getenv("MYSQL_PORT", 3306))
}

# Pipeline Config
PIPELINE_CONFIG = {
    "batch_size":        100,     # rows per batch insert
    "max_retries":       3,       # retry failed jobs
    "schedule_interval": 60,      # seconds between runs
    "log_file":          "pipeline.log"
}

# Validation thresholds
VALIDATION_CONFIG = {
    "max_null_pct":      0.20,    # max 20% nulls allowed
    "min_rows":          10,      # minimum rows required
    "required_columns": ["DATE", "OPEN", "HIGH", "LOW", "CLOSE", "VOLUME"]
}