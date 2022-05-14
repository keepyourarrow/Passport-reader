import cv2

image = cv2.imread("../images/data/background/bg20.jpg")
resized = cv2.resize(image, (1800,2300))
cv2.imshow('re',resized)
cv2.waitKey(0)
cv2.imwrite('t.jpg',resized)