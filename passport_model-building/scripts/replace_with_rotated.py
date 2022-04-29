### Replaces original UNROTATED image with a rotated version

# Usage python replace_with_rotated.py -l .\new_data\ -i passport403
import argparse

from datetime import datetime
import os

# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str,
	help="path to image folder")
parser.add_argument("-i", "--image", type=str,
    help="image name")
parser.add_argument("-rw", "--replace_with", type=str, default='000.jpg',
    help="output folder")
args = parser.parse_args()

# image = cv2.resize(image, (512,512))
# for i in np.arange(-3.5, 0, 0.1):
#     # i = i + 0.5
#     print(i)
#     rotated = imutils.rotate_bound(image,i)
#     cv2.imshow('rotated' +str(i), rotated)
#     cv2.waitKey(0)

image = args.image + '.jpg'
xml = args.image + '.xml'

image_path = os.path.join(args.loc, image)
replace_with_path = os.path.join(args.loc, args.replace_with)
if os.path.exists(image_path) and os.path.exists(replace_with_path):
    xml_path = os.path.join(args.loc, xml)
    modified_time = os.path.getmtime(xml_path)
    day_created = datetime.fromtimestamp(modified_time).day
    if day_created == 6:
        os.remove(image_path)
        os.rename(replace_with_path, image_path)
        print("All good 👍👍👍👍", datetime.now())
    else:
        print("You submitted a wrong passport.\n Day created:", day_created)
else:
    print("Path doesn't exist")
