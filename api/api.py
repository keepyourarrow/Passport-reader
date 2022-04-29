from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import requests
import tensorflow as tf
import uvicorn

from io import BytesIO


from passport_detection import MainPageDetection
from passport_ocr import passport_ocr
from utils import get_file_name
from utils.logger import bad_prediction_logger


#region constants
MODEL = tf.saved_model.load("./models/model-4.16.22/saved_model")
#regionend constants

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allows anyone to connect to our api
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def convert_bytes(bytes):
    image = Image.open(BytesIO(bytes))
    if image.format == "PNG":
        image = image.convert("RGB")

    return image

def save_img(image, file_name):
    image.save(file_name)


def image_to_numpy_array(image) -> np.ndarray:
    """Converts bytes to np array"""
    return np.array(image)

def prediction(image, file_name=""):
    input_tensor = tf.convert_to_tensor(image)
    # The model expects a batch of images, so add an axis with `tf.newaxis`.
    input_tensor = input_tensor[tf.newaxis, ...]


    # main page detections
    mpd = MainPageDetection(label_path="./models/model-4.16.22/label_map.pbtxt", model=MODEL, input_tensor=input_tensor, image=image)
    result = mpd.get_bboxes()
    result = mpd.filter_low_conf(**result)
    prediction_dict = passport_ocr(image, file_name, **result)

    print(result)

    return prediction_dict

@app.get("/ping")
async def ping():
    return "Hello"

@app.get("/predict")
async def predict_with_url(url:str):
    response = requests.get(url)
    image = convert_bytes(response.content)
    image = image_to_numpy_array(image)


    # prediction
    prediction_dict = prediction(image)

    return prediction_dict

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    #convert to bytes
    bytes = await file.read()
    image = convert_bytes(bytes)
    file_name = get_file_name()
    save_img(image, file_name)

    # convert to numpy array
    image = image_to_numpy_array(image)

    # prediction
    prediction_dict = prediction(image, file_name)

    print(len(prediction_dict))
    print(prediction_dict)
    if len(prediction_dict) < 10:
        bad_prediction_logger(len(prediction_dict), file_name)

    return JSONResponse(content=prediction_dict)

if __name__  == "__main__":
    uvicorn.run(app)
