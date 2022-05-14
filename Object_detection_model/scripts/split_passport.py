### Splits passport into 14 fields (for tesseract fine tuning)
import argparse
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf

import glob
import os

from utils.main_page_detection import MainPageDetection

#region constants
MODEL = tf.saved_model.load("../saved_models/model_4.16/saved_model")
#regionend constants

# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="../images/data/new/",
	help="path to images")
parser.add_argument("-od", "--output_dir", type=str, default="../../tesseract_fine_tuning/train_data/",
	help="output folder")
parser.add_argument("-lm", "--label_map", type=str,
	help="Path to label map file")
parser.add_argument("-s", "--start", type=str, required=False,
	help="INT when to start. Example: 1")
parser.add_argument("-e", "--end", type=str, required=False,
	help="INT when to end. Example: 10 ")
args = parser.parse_args()

images = glob.glob(args.loc + "*.jpg")


if args.start:
    start = int(args.start)
    print(start)
    images = images[start:]
if args.end:
    end = int(args.end)
    images = images[:end]


print(f"{len(images)} IMAGES")
print(images)

for image in images:
    image_name = os.path.basename(image) #passport252.jpg
    image = Image.open(image)
    image = np.array(image)
    input_tensor = tf.convert_to_tensor(image)
    # The model expects a batch of images, so add an axis with `tf.newaxis`.
    input_tensor = input_tensor[tf.newaxis, ...]
    # main page detections
    mpd = MainPageDetection(label_path=args.label_map, model=MODEL, input_tensor=input_tensor, image=image)
    result = mpd.get_bboxes()

    for bbox, class_name in zip(result["bboxes"], result["classes"]):
        if class_name in ["photo", "mrz", "stamp", "signature"]:
            continue

        (min_y, min_x, max_y, max_x) = bbox

        padding = 20
        roi = image[min_y - padding:padding+max_y, min_x - padding:padding+max_x]

        if class_name == "id":
            roi = cv2.rotate(roi, cv2.ROTATE_90_COUNTERCLOCKWISE)

        cv2.imwrite(args.output_dir + class_name + "-" + image_name, roi)
