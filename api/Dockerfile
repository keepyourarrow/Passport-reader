FROM python:3.9

WORKDIR /server

RUN apt-get update && apt-get install -y tesseract-ocr
RUN apt-get install -y tesseract-ocr-rus

COPY . .

RUN pip3 install -r requirements.txt

RUN apt-get install -y protobuf-compiler

RUN git clone https://github.com/tensorflow/models.git /models

WORKDIR /models/research

RUN protoc object_detection/protos/*.proto --python_out=.

RUN cp object_detection/packages/tf2/setup.py .

RUN python -m pip install .

RUN export PYTHONPATH=$PYTHONPATH:`pwd`:`pwd`slim

WORKDIR /server

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]