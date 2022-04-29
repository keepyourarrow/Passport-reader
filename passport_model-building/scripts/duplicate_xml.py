### The goal is to take one xml file (passport252.xml) and duplicate it for other images.
### result: passport253.xml, passport254.xml etc...

#Usage python duplicate_xml.py -l new_data\ -xf passport252.xml

import argparse
from glob import glob
import os
import xml.etree.ElementTree as ET

# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="",
	help="location of images")
parser.add_argument("-xf", "--xml_file", type=str,
    help="output folder")
parser.add_argument("-sp", "--stop_point", type=str, required=False,
    help="output folder")
args = parser.parse_args()

# find image names
image_files = glob(args.loc + "*.jpg")
image_files = [name.replace(".jpg","") for name in image_files]
image_names = [name.replace(args.loc,"") for name in image_files]
# remove file extension

for image_file, image_name in zip(image_files, image_names):
    if image_name < args.xml_file:
        continue
    if args.xml_file not in image_file:
        src = os.path.join("new_data",args.xml_file)
        dst = image_file + '.xml'
        # shutil.copy(src,dst)
        et = ET.parse(src)
        filename = et.find("filename")
        filename.text = image_name + '.jpg'
        et.write(dst)
    if args.stop_point is not None and image_name == args.stop_point:
        print("EXITING on " + args.stop_point,)
        break