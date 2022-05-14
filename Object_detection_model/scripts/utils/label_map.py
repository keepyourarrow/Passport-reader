import numpy as np
from google.protobuf import text_format
from object_detection.protos import string_int_label_map_pb2
import tensorflow as tf


def label_map_as_dict(path):
    with tf.io.gfile.GFile(path, 'r') as fid:
        label_map_string = fid.read()
        label_map = string_int_label_map_pb2.StringIntLabelMap()
        try:
            text_format.Merge(label_map_string, label_map)
        except text_format.ParseError:
            label_map.ParseFromString(label_map_string)


    label_map_dict = {}
    for item in label_map.item:
        label_map_dict[item.id] = item.name
    return  label_map_dict