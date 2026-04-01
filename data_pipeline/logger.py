# logger.py — Pipeline monitoring and logging
# Staff principle: you can't fix what you can't observe

import logging
import os
from datetime import datetime
from config import PIPELINE_CONFIG

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Console handler
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    ))

    # File handler
    file_handler = logging.FileHandler(PIPELINE_CONFIG["log_file"])
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    ))

    if not logger.handlers:
        logger.addHandler(console)
        logger.addHandler(file_handler)

    return logger


class PipelineMetrics:
    """Track pipeline run statistics — for interview: show you care about observability"""

    def __init__(self):
        self.start_time  = None
        self.end_time    = None
        self.rows_extracted  = 0
        self.rows_validated  = 0
        self.rows_loaded     = 0
        self.rows_rejected   = 0
        self.errors          = []
        self.status          = "pending"

    def start(self):
        self.start_time = datetime.now()
        self.status = "running"

    def finish(self, success: bool):
        self.end_time = datetime.now()
        self.status = "success" if success else "failed"

    @property
    def duration_seconds(self):
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0

    def summary(self) -> dict:
        return {
            "status":          self.status,
            "duration_sec":    self.duration_seconds,
            "rows_extracted":  self.rows_extracted,
            "rows_validated":  self.rows_validated,
            "rows_loaded":     self.rows_loaded,
            "rows_rejected":   self.rows_rejected,
            "errors":          self.errors,
            "started_at":      str(self.start_time),
            "finished_at":     str(self.end_time)
        }