import argparse
import cv2
import imutils
import numpy as np


# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-i", "--image", type=str,
	help="path to input image")
parser.add_argument("-a", "--angle", type=str, default="2",
    help="rotation angle")
parser.add_argument("-od", "--output_dir", type=str, default='.',
    help="output folder")
parser.add_argument("-of", "--output_file", type=str, default='000',
    help="output folder")
args = parser.parse_args()

image = cv2.imread(args.image)


# image = cv2.resize(image, (512,512))
# for i in np.arange(-3.5, 0, 0.1):
#     # i = i + 0.5
#     print(i)
#     rotated = imutils.rotate_bound(image,i)
#     cv2.imshow('rotated' +str(i), rotated)
#     cv2.waitKey(0)

rotated = imutils.rotate_bound(image, float(args.angle))

cv2.imshow('rotated' + args.angle, rotated)
cv2.waitKey(0)

output = args.output_file + '.jpg'
if args.output_dir != '.':
    output = args.output_dir + output
print(output)
cv2.imwrite(output,rotated)
