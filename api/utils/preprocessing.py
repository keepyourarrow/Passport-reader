import cv2
import numpy as np

def binarize(img, mo=False):
    preprocessed_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    preprocessed_img = cv2.GaussianBlur(preprocessed_img, (3, 3), 0)
    preprocessed_img = cv2.threshold(preprocessed_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    if mo:
        kernel = np.ones((3,3),np.uint8)
        preprocessed_img = cv2.dilate(preprocessed_img, kernel, iterations = 1)
        preprocessed_img = cv2.erode(preprocessed_img, kernel, iterations = 1)

    return preprocessed_img