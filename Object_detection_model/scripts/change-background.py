import argparse
import cv2
import glob
import imutils
import numpy as np
import skimage.filters as filters


import os
import time
import xml.etree.ElementTree as ET

def create_new_file(file):
    new_file = os.path.basename(file)
    if not args.remove:
        new_file = new_file + "-" + bg_name
    else:
        new_file = new_file + "-no-bg"

    if args.finger:
        new_file = new_file + "-" + finger_name + "-" + version

    return new_file

def auto_canny(image, sigma=0.33):
    # compute the median of the single channel pixel intensities
	v = np.median(image)

	# apply automatic Canny edge detection using the computed median
	lower = int(max(0, (1.0 - sigma) * v))

	upper = int(min(255, (1.0 + sigma) * v))

	edged = cv2.Canny(image, lower, upper)

	# return the edged image
	return edged


def get_bbox(img, file):
    img = imutils.resize(img, height = 500)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if not args.single_image:
        if args.shadow:
            gray = cv2.GaussianBlur(gray, (5, 5), 0)
            smooth = cv2.GaussianBlur(gray, (95,95), 0)
            division = cv2.divide(gray, smooth, scale=255)
            sharp = filters.unsharp_mask(division, radius=1.5, amount=1.5, multichannel=False, preserve_range=False)
            sharp = (255*sharp).clip(0,255).astype(np.uint8)
            (T, thresh) = cv2.threshold(sharp, 0, 255,
                cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        else:
            gray = cv2.GaussianBlur(gray, (5, 5), 0)
            (T, thresh) = cv2.threshold(gray, 0, 255,
                cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    else:
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        smooth = cv2.GaussianBlur(gray, (95,101), 0)
        division = cv2.divide(gray, smooth, scale=255)
        sharp = filters.unsharp_mask(division, radius=1.5, amount=1.5, multichannel=False, preserve_range=False)
        sharp = (255*sharp).clip(0,255).astype(np.uint8)
        thresh = cv2.threshold(sharp, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    edged = auto_canny(thresh)

    # for single image dilation, erosion helps if usual contour detection technique didn't work
    # if args.single_image:

    #
    if args.morph_oper == 1:
        edged = cv2.dilate(edged.copy(), None, iterations=3)
        edged = cv2.erode(edged.copy(), None, iterations=3)

    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key = cv2.contourArea, reverse = True)[:5]

    # loop over the contours
    screenCnt = np.array([])
    bbox = None

    for c in cnts:
        # approximate the contour
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        (x, y, w, h) = cv2.boundingRect(c)


        # if our approximated contour has four points, then we
        # can assume that we have found our screen
        if len(approx) == 4 and w > 150:
            screenCnt = approx
            # show the contour (outline) of the piece of paper
            cv2.drawContours(img, [screenCnt], -1, (0, 255, 0), 2)
            bbox = np.array((x,y,w,h))
            break
    return bbox

def change_bg(file, new_file, not_found_list=[], created_list=[]):
    print("Current: ",file)
    img = cv2.imread(file + '.jpg')
    (HEIGHT,WIDTH) = img.shape[:2]
    NEW_HEIGHT = 500
    height_ratio = HEIGHT / NEW_HEIGHT

    bbox = get_bbox(img, file) #contours

    if bbox is not None:
        (x,y,w,h) = (bbox * height_ratio).astype(int)
        passport = img[y:y + h, x:x + w]

        if args.finger:

            finger = finger_orig.copy()
            finger_height = finger.shape[0]
            finger_width = finger.shape[1]

            # Different positions of finger
            start_x = 0
            if version == 'v1':
                start_y = 20
            if version == 'v2':
                start_y = 100
            if version == 'v3':
                start_y = 200
            if version == 'v4':
                start_y = 300
            if version == 'v5':
                start_y = 400
            if version == 'v6':
                start_y = 500
            # if version == 'v7':
            #     start_y = 220
            #     start_x = w - finger_width
            # if version == 'v4':
            #     start_y = int(h / 8)
            #     start_x = 0
            # if version == 'v5':
            #     start_y = int(h/2) - 120
            #     start_x = 0

            # right hand - right side
            if finger_name == 'fn3':
                start_x = w - finger_width
            end_y = start_y + finger_height
            end_x = start_x + finger_width

            for i in range(0, finger_height):
                for j in range(0, finger_width):
                    if finger[i,j,0] == 0:
                        try:
                            finger[i,j] = passport[start_y + i,start_x + j]
                        except IndexError:
                            print("IndexError: ", file)
                            return

            passport[start_y:end_y , start_x:end_x] = finger

        # change xml
        et = ET.parse(file + '.xml')
        root = et.getroot()
        filename = et.find("filename")
        filename.text = new_file + '.jpg'

        if not args.remove:
            new_img = cv2.resize(background, (WIDTH,HEIGHT))

            new_img[y:y + h, x:x + w] = passport

        else:
            new_img = passport
            for object in et.findall("object"):

                for box in object.findall("bndbox"):
                    xmin = int(box.find("xmin").text)
                    xmax = int(box.find("xmax").text)
                    ymin = int(box.find("ymin").text)
                    ymax = int(box.find("ymax").text)
                    xmin = xmin - x
                    xmax = xmax - x
                    ymin = ymin - y
                    ymax = ymax - y

                    box.find("xmin").text = str(xmin)
                    box.find("xmax").text = str(xmax)
                    box.find("ymin").text = str(ymin)
                    box.find("ymax").text = str(ymax)



        # new_img = cv2.resize(new_img,(720,720))
        # cv2.imshow('new', new_img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        # return

        print("Created new", new_file)

        # for object in et.findall("object"):
        #     name = object.find("name").text
        #     if name == "id":
        #         root.remove(object)

        et.write(args.output_folder + new_file + '.xml')
        cv2.imwrite(args.output_folder + new_file + '.jpg', new_img)
        created_list.append(new_file)

        cv2.destroyAllWindows()
    else:
        print(f"Not found: {file}")
        cv2.imwrite("../images/data/failed/" + os.path.basename(file) + ".jpg",img)
        not_found_list.append(file)
# construct the argument parser and parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--loc", type=str, default="../images/data/new/",
	help="path to images")
parser.add_argument("-of", "--output_folder", type=str, default="../images/data/transformed/",
	help="path to output folder")
parser.add_argument("-bg", "--background", type=str, default="../images/data/background/dark_wood_bg.jpg",
	help="backround image")
parser.add_argument("-fn", "--finger", type=str,
	help="Optional. Finger image")
parser.add_argument("-si", "--single_image", type=str,
	help="Single image")
parser.add_argument("-s", "--start", type=str,
	help="Optional. To Specify where to start")
parser.add_argument("-sb", "--same_bg", type=int, default=0,
	help="Optional(with finger). To use the same bg. 1 for True. 0 for False")
parser.add_argument("-rm", "--remove", type=int, default=0,
	help="Optional(no bg). Remove bg. 1 for True. 0 for False")
parser.add_argument("-sh", "--shadow", type=int, default=0,
	help="Optional(no shadow). 1 for True. 0 for False")
parser.add_argument("-mo", "--morph_oper", type=int, default=0,
	help="Optional(no morphological operations). 1 for True. 0 for False")
args = parser.parse_args()


# bg_name = os.path.basename(args.background).replace('.jpg','') # dark_wood
# background = cv2.imread(args.background)
t0 = time.time()
# if args.finger:
#     finger_name = os.path.basename(args.finger)
#     finger_orig = cv2.imread(args.finger + '.png')
#     version = 'v2'

# multiple images
if args.single_image:
    single_image = args.single_image.replace('.jpg','')
    print(single_image)

    if args.finger:
        for fn in range(1,4):
            finger_orig = cv2.imread("../images/data/fingers/fn" + str(fn) + '.png')
            finger_name = "fn" + str(fn)


            for v in range(1,7):
                version = "v" + str(v)
                new_file = create_new_file(single_image)

                if not os.path.exists(args.output_folder + new_file + '.jpg'):
                    change_bg(single_image, new_file)
    else:
        if not args.remove:
            for index in range(1,21):
                background = cv2.imread("../images/data/background/bg" + str(index) + ".jpg")
                bg_name = "bg" + str(index)
                new_file = create_new_file(single_image)
                if not os.path.exists(args.output_folder + new_file + '.jpg'):
                    change_bg(single_image, new_file)
        else:
            new_file = create_new_file(single_image)
            if not os.path.exists(args.output_folder + new_file + '.jpg'):
                change_bg(single_image, new_file)

# list of images
else:
    files = glob.glob(args.loc + "*.jpg")
    if args.start:
        files = [file for file in files if os.path.basename(file) >= args.start]
    files = [file.replace(".jpg","") for file in files]
    print(len(files), " images")

    not_found_list = []
    created_list = []

    if args.finger:
        for fn in range(1,4):
            finger_orig = cv2.imread("../images/data/fingers/fn" + str(fn) + '.png')
            finger_name = "fn" + str(fn)

            for v in range(1,7):
                version = "v" + str(v)

                for file in files:
                    new_file = create_new_file(file)

                    if not os.path.exists(args.output_folder + new_file + '.jpg'):
                        change_bg(file, new_file, not_found_list, created_list)
    else:
        if not args.remove:
            for index in range(20):
                background = cv2.imread("../images/data/background/bg" + str(index) + ".jpg")
                bg_name = "bg" + str(index)
                for file in files:
                    new_file = create_new_file(file)

                    if not os.path.exists(args.output_folder + new_file + '.jpg'):
                        change_bg(file, new_file, not_found_list, created_list)
        else:
            for file in files:
                new_file = create_new_file(file)

                if not os.path.exists(args.output_folder + new_file + '.jpg'):
                    change_bg(file, new_file, not_found_list, created_list)



    print(f"FINISHED. Contours weren't found in {len(not_found_list)} images")
    print(f"FINISHED. Created {len(created_list)} images")

    t1 = time.time()
    total_n = t1-t0
    print("It took {0:.2f} minutes".format(total_n / 60))

# imgFront = cv2.imread('../new_data/passport252.jpg')
# imgBack = cv2.imread('../dark_wood_background.jpg')

# height, width = imgFront.shape[:2]

# resizeBack = cv2.resize(imgBack, (width, height), interpolation = cv2.INTER_CUBIC)
# resizeBack = cv2.resize(imgBack, (2000, 2000))

# cv2.imshow('b',resizeBack)
# cv2.waitKey(0)
# cv2.imwrite('hahhahahah.jpg',resizeBack)
# print('front',imgFront.shape)
# print('back',imgBack.shape)
# print('resized',resizeBack.shape)

# for i in range(width):
#     for j in range(height):
#         pixel = imgFront[j, i]
#         if pixel == [255, 255, 255]:
#             imgFront[j, i] = resizeBack[j, i]


# cv2.imshow('renewed',imgFront)
# cv2.waitKey(0)

# WIDTH = 1733
# HEIGHT = 2394
# NEW_WIDTH = 1058
# NEW_HEIGHT = 1455
# width_ratio = NEW_WIDTH / WIDTH
# height_ratio = NEW_HEIGHT / HEIGHT

# print(width_ratio, height_ratio)


# img = cv2.imread('../passport252.jpg')
# resized = cv2.resize(img, (1058,1455))
# cv2.imshow('re',resized)
# cv2.waitKey(0)
# cv2.imwrite("../test2.jpg",resized)
# et = ET.parse("../test.xml")

# for object in et.findall("object"):
#     for box in object.findall("bndbox"):
#         xmin = int(box.find("xmin").text)
#         xmax = int(box.find("xmax").text)
#         ymin = int(box.find("ymin").text)
#         ymax = int(box.find("ymax").text)
#         xmin = xmin * width_ratio
#         xmax = xmax * width_ratio
#         ymin = ymin * height_ratio
#         ymax = ymax * height_ratio

#         box.find("xmin").text = str(xmin)
#         box.find("xmax").text = str(xmax)
#         box.find("ymin").text = str(ymin)
#         box.find("ymax").text = str(ymax)


# et.write("test.xml")
