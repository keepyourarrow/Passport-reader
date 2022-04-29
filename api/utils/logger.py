import datetime
import logging
import os

def errors_logger(error, file_name):
    log_file = os.path.join("logs","errors.log")
    logging.basicConfig(filename=log_file, encoding='utf-8', level=logging.INFO)
    logging.info(f"{file_name} Date:{datetime.datetime.now()}")
    logging.error(error)

def bad_prediction_logger(correct_predictions, file_name):
    log_file = os.path.join("logs","bad_predictions.log")
    logging.basicConfig(filename=log_file, encoding='utf-8', level=logging.INFO)
    logging.info(f"Date:{datetime.datetime.now()}")
    logging.error(f"Correct predictions: {correct_predictions}/15 for {file_name}")