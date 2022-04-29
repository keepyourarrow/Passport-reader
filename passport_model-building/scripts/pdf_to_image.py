import argparse
import cv2
from pdf2image import convert_from_path

import glob



# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="",
	help="path to input image")
args = parser.parse_args()

# Images need to be big enough to fit into our model

files = glob.glob(args.loc + "*.pdf")

print(len(files))
# for index,file in enumerate(files):
#     # if "Макарова Оксана Александровна" in file:
#     print(file)
#     converted = convert_from_path(file, fmt="jpg", output_folder="new_data")
#     print(converted)
