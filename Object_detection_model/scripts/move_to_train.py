### Move from data to train

# Usage python move_to_train.py -n passport252
import argparse

import os

# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="./new_data/",
	help="path to input folder")
parser.add_argument("-n", "--name", type=str,
	help="image,xml name")
parser.add_argument("-of", "--output_folder", type=str, default="./4.12/data/train/",
    help="output folder")
args = parser.parse_args()

# image = cv2.resize(image, (512,512))
# for i in np.arange(-3.5, 0, 0.1):
#     # i = i + 0.5
#     print(i)
#     rotated = imutils.rotate_bound(image,i)
#     cv2.imshow('rotated' +str(i), rotated)
#     cv2.waitKey(0)

image = args.name + '.jpg'
xml = args.name + '.xml'

image_loc = os.path.join(args.loc, image)
xml_loc = os.path.join(args.loc, xml)
image_output_loc = os.path.join(args.output_folder, image)
xml_output_loc = os.path.join(args.output_folder, xml)

if os.path.exists(image_loc) and os.path.exists(xml_loc):
    os.replace(image_loc, image_output_loc)
    os.replace(xml_loc, xml_output_loc)
    print("All good 👍👍👍👍")
else:
    print("Path doesn't exist")
