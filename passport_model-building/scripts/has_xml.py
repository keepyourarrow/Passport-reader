import argparse
import glob
import os
import sys

# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="*.jpg",
	help="path to images")
args = parser.parse_args()

os.chdir('F:')

# Images need to be big enough to fit into our model

files = glob.glob(args.loc + "*.jpg")

if len(files) == 0:
    print("ERROR - no images found.")
    sys.exit(1)

files = [file.replace(".jpg","") for file in files]

print(f"{len(files)} images found")

not_exists_arr = []
for index,file in enumerate(files):
    exists = os.path.exists(file + ".xml")
    if not exists:
        print("XML doesnt exist", file)
        not_exists_arr.append(file)


if len(not_exists_arr) > 0:
    print(f"{len(not_exists_arr)} images don't have an xml file")
else:
    print("All good! 👍👍👍👍👍👍")