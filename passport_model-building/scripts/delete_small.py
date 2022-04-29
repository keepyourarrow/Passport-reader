import argparse
import cv2

import glob
import os


# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str,
	help="path to input image")
parser.add_argument("-s", "--size", type=str, default=640,
    help="path to input image")
parser.add_argument("-d", "--delete", type=int, default=1,
    help="path to input image")
args = parser.parse_args()
size = int(args.size)

# Images need to be big enough to fit into our model

files = glob.glob(args.loc + "*.jpg")

print(len(files))
print(args.delete)
small_images = []
for index,file in enumerate(files):
    image = cv2.imread(file)
    (height, width, channel) = image.shape
    if height < size or width < size:
        small_images.append(file)
        print(height,width,file)
        if args.delete:
            print('delete')

        # os.remove("/" + file)

print(f"Total amount of small images: {len(small_images)}")