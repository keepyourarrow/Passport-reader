# import the necessary packages
import cv2
from glob import glob
import os
import imutils
import numpy as np
import sys


def order_points(pts):
	# initialzie a list of coordinates that will be ordered
	# such that the first entry in the list is the top-left,
	# the second entry is the top-right, the third is the
	# bottom-right, and the fourth is the bottom-left
	rect = np.zeros((4, 2), dtype = "float32")

	# the top-left point will have the smallest sum, whereas
	# the bottom-right point will have the largest sum
	s = pts.sum(axis = 1)
	rect[0] = pts[np.argmin(s)]
	rect[2] = pts[np.argmax(s)]

	# now, compute the difference between the points, the
	# top-right point will have the smallest difference,
	# whereas the bottom-left will have the largest difference
	diff = np.diff(pts, axis = 1)
	rect[1] = pts[np.argmin(diff)]
	rect[3] = pts[np.argmax(diff)]

	# return the ordered coordinates
	return rect

def four_point_transform(image, pts):
	# obtain a consistent order of the points and unpack them
	# individually
	rect = order_points(pts)
	(tl, tr, br, bl) = rect

	# compute the width of the new image, which will be the
	# maximum distance between bottom-right and bottom-left
	# x-coordiates or the top-right and top-left x-coordinates
	widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
	widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
	maxWidth = max(int(widthA), int(widthB))

	# compute the height of the new image, which will be the
	# maximum distance between the top-right and bottom-right
	# y-coordinates or the top-left and bottom-left y-coordinates
	heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
	heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
	maxHeight = max(int(heightA), int(heightB))

	# now that we have the dimensions of the new image, construct
	# the set of destination points to obtain a "birds eye view",
	# (i.e. top-down view) of the image, again specifying points
	# in the top-left, top-right, bottom-right, and bottom-left
	# order
	dst = np.array([
		[0, 0],
		[maxWidth - 1, 0],
		[maxWidth - 1, maxHeight - 1],
		[0, maxHeight - 1]], dtype = "float32")
	# compute the perspective transform matrix and then apply it
	M = cv2.getPerspectiveTransform(rect, dst)
	warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

	# return the warped image
	return warped

def auto_canny(image, sigma=0.33):
    # compute the median of the single channel pixel intensities
	v = np.median(image)

	# apply automatic Canny edge detection using the computed median
	lower = int(max(0, (1.0 - sigma) * v))

	upper = int(min(255, (1.0 + sigma) * v))

	edged = cv2.Canny(image, lower, upper)

	# return the edged image
	return edged

def find_contours(img):
    img = imutils.resize(img, height = 500)

    # convert the image to grayscale, blur it, and find edges
    # in the image
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    (T, thresh) = cv2.threshold(gray, 0, 255,
        cv2.THRESH_BINARY | cv2.THRESH_OTSU)

    # kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    # thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    edged = auto_canny(thresh)
    # edged = cv2.dilate(edged.copy(), None, iterations=3)

    # cv2.imshow('dilated',edged)
    # edged = cv2.erode(edged.copy(), None, iterations=3)
    # cv2.imshow('eroded',edged)

    # show the original image and the edge detected image
    print("STEP 1: Edge Detection")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # find the contours in the edged image, keeping only the
    # largest ones, and initialize the screen contour
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key = cv2.contourArea, reverse = True)[:5]

    # loop over the contours
    screenCnt = np.array([])
    print("STEP 2: Find contours of paper")
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
            cv2.imshow('i',img)
            cv2.waitKey(0)
            break

    return screenCnt


def warp_image(img):
    ratio = img.shape[0] / 500.0
    screenCnt = find_contours(img)

    if np.any(screenCnt):
        warped = four_point_transform(img, screenCnt.reshape(4, 2) * ratio)
    else:
        print("screenCnt undefined. Exiting...")
        return
    # warped = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    # T = threshold_local(warped, 11, offset = 10, method = "gaussian")
    # warped = (warped > T).astype("uint8") * 255

    cv2.imshow('warped',warped)
    cv2.waitKey(0)
    print("shape", warped.shape)


def get_images():
    return glob("../new_data/*.jpg")


def main():
    image_files = get_images()
    print(len(image_files))

    for image_file in image_files:
        img = cv2.imread(image_file)
        warp_image(img)
        cv2.destroyAllWindows()
    # for i in range(1, 8):
        # img = cv2.imread('ps{}.jpg'.format(str(i)))

    #     warped = warpImage(img)
    #     if (type(warped) == str):
    #         print(warped)
    #         continue

    #     # (h,w) = warped.shape

    #     # print(h,w)

    #     getFields(warped)

    # four_point_transform()


if __name__ == '__main__':
    main()
