import argparse
import os
import glob

# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="",
	help="location of images")
parser.add_argument("-od", "--output_dir", type=str, default='.',
    help="output folder")
args = parser.parse_args()
images = glob.glob(args.loc + "*.jpg")
print(args.loc + "*.jpg")

print(len(images))

start = 252
for index,image in enumerate(images):
    print(index)
    output = ""
    if args.output_dir != '.':
        output = args.output_dir

    os.rename(image, f"{output}passport{str((start + index))}.jpg")