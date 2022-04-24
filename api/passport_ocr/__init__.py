import cv2
import imutils
import pandas as pd
import pytesseract

from utils.ocr_correcter import date_correcter, one_word_correcter, number_correcter, sex_correcter, blocks_correcter, filter_low_conf, choose_one_id
from utils.preprocessing import binarize
from utils import list_to_dict


def passport_ocr(img, bboxes, classes, scores):
    word_blacklist = ".,_`\\/@#$%^&*()!"
    options_dict = {
        "registrarCode": "--psm 6 -c tessedit_char_whitelist=0123456789.-",
        "registrarName": "--psm 3",
        "registrationDate": "--psm 6 -c tessedit_char_whitelist=0123456789.-",
        "surname": "--psm 8 -c tessedit_char_blacklist={}".format(word_blacklist),
        "name": "--psm 8 -c tessedit_char_blacklist={}".format(word_blacklist),
        "middleName": "--psm 8 -c tessedit_char_blacklist={}".format(word_blacklist),
        "sex": "--psm 8 -c tessedit_char_blacklist={}".format(word_blacklist),
        "birthday": "--psm 6 -c tessedit_char_whitelist=0123456789.-",
        "placeOfBirth": "--psm 3",
        "id": "--psm 6 -c tessedit_char_whitelist=0123456789",
        "mrz": "--psm 3"
    }

    ignore = ["stamp", "photo", "signature",]

    date_classes = ["registrationDate", "birthday"]
    one_word_classes = ["surname", "name", "middleName"]
    number_classes = ["registrarCode", "id"]
    blocks_classes = ["registrarName", "placeOfBirth", "mrz"]

    # classes that will be thresholded (other classes will be OCRed as raw)
    binarization_classes = ["registrationDate", "birthday", "registrarCode"]

    ocr_list = []
    prediction_dict = {}
    for (loc, class_name, conf) in zip(bboxes, classes, scores):

        options = "-l rus"
        if class_name == "mrz":
            options = "-l eng"

        (min_y, min_x, max_y, max_x) = loc


        if class_name in ignore:
            prediction_dict[class_name] = {"bbox": loc}
            continue

        if options_dict[class_name]:
            options += " " + options_dict[class_name]
        else:
            options += " " + "--psm 7"

        padding = 5
        # bigger padding for id field
        if class_name == "id":
            padding = 20

        roi = img[min_y - padding:padding+max_y, min_x - padding:padding+max_x]

        # rotate id
        if class_name == "id":
            roi = cv2.rotate(roi, cv2.ROTATE_90_COUNTERCLOCKWISE)


        # some passports needs to be black and white some don't (DEFAULT)
        # for performance purposes
        if class_name in binarization_classes:
            image_to_ocr = binarize(roi, True)
        else:
            image_to_ocr = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)

        # tesseract prediction
        ocr_data = pytesseract.image_to_data(image_to_ocr, config=options, output_type='data.frame')

        if class_name in date_classes:
            data = date_correcter(ocr_data)

        elif class_name == "sex":
            data = sex_correcter(ocr_data)

        elif class_name in one_word_classes:
            data = one_word_correcter(ocr_data)

        elif class_name in number_classes:
            data = number_correcter(ocr_data, class_name)

        elif class_name in blocks_classes:
            data = blocks_correcter(ocr_data)

        else:
            data = filter_low_conf(ocr_data)

        ocr_list.append(
            {
                "data": data,
                "class": class_name,
                "conf": str(conf),
                "bbox": loc
            }
        )

    ocr_list = choose_one_id(ocr_list)
    prediction_dict = list_to_dict(ocr_list, prediction_dict)
    return prediction_dict
