# scheduler.py 
# 

import schedule
import time
import os
import glob
from logger import get_logger
from pipeline import StockDataPipeline
from config import PIPELINE_CONFIG

logger = get_logger("scheduler")

WATCH_FOLDER = os.getenv("WATCH_FOLDER", "./data/incoming")
DONE_FOLDER  = os.getenv("DONE_FOLDER",  "./data/processed")


def process_new_files():
    """
    Check for new CSV files and process them.
    Senior pattern: watch folder + move to processed = idempotent pipeline
    """
    os.makedirs(WATCH_FOLDER, exist_ok=True)
    os.makedirs(DONE_FOLDER,  exist_ok=True)

    csv_files = glob.glob(f"{WATCH_FOLDER}/*.csv")

    if not csv_files:
        logger.info("No new files to process")
        return

    logger.info(f"Found {len(csv_files)} new file(s) to process")

    for file_path in csv_files:
        filename = os.path.basename(file_path)
        symbol   = filename.replace(".csv", "").upper()

        logger.info(f"Processing: {filename}")

        pipeline = StockDataPipeline()
        result   = pipeline.run(file_path, symbol)

        if result["status"] == "success":
            # Move to processed folder
            done_path = os.path.join(DONE_FOLDER, filename)
            os.rename(file_path, done_path)
            logger.info(f"Moved to processed: {done_path}")
        else:
            logger.error(f"Failed to process {filename}: {result['errors']}")


def run_scheduler():
    """Start the scheduler"""
    interval = PIPELINE_CONFIG["schedule_interval"]
    logger.info(f"Scheduler started — checking every {interval} seconds")
    logger.info(f"Watching folder: {WATCH_FOLDER}")

    # Run immediately on start
    process_new_files()

    #run on schedule
    schedule.every(interval).seconds.do(process_new_files)

    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == "__main__":
    run_scheduler()