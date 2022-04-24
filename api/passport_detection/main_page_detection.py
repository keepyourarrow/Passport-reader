import numpy as np
import tensorflow as tf

from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
from utils import label_map_as_dict

class MainPageDetection:
    def __init__(self, label_path, model, input_tensor, image):
        # store the image data format
        self.category_index = label_map_util.create_category_index_from_labelmap(label_path,
                                                                    use_display_name=True)
        self.detections = self.make_prediction(model, input_tensor)
        self.label_map_as_dict = label_map_as_dict(label_path)
        self.image_height = image.shape[0]
        self.image_width = image.shape[1]

    def get_bboxes(self):
        bboxes = self.detections['detection_boxes']

        #convert
        bboxes[:,0] = bboxes[:,0]* self.image_height
        bboxes[:,1] = bboxes[:,1]* self.image_width
        bboxes[:,2] = bboxes[:,2]* self.image_height
        bboxes[:,3] = bboxes[:,3]* self.image_width

        bboxes = bboxes.astype("int")
        return {
            "bboxes": bboxes.tolist(),
            "classes": [self.label_map_as_dict[i] for i in self.detections['detection_classes']],
            "scores": np.round(self.detections['detection_scores'], 2).tolist(),
        }

    def filter_low_conf(self, bboxes, classes, scores, thresh=0.6):
        for bbox, class_name, score in zip(bboxes.copy(), classes.copy(), scores.copy()):
            if score < thresh:
                bboxes.remove(bbox)
                classes.remove(class_name)
                scores.remove(score)

        return {
            "bboxes": bboxes,
            "classes": classes,
            "scores": scores
        }


    def make_prediction(self, model, input_tensor):
        detections = model(input_tensor)
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy()
                    for key, value in detections.items()}
        detections['num_detections'] = num_detections

        # detection_classes should be ints.
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

        return detections

    def visualize_detections(self, image, detections):
        image_with_detections = image.copy()

        viz_utils.visualize_boxes_and_labels_on_image_array(
            image_with_detections,
            detections['detection_boxes'],
            detections['detection_classes'],
            detections['detection_scores'],
            self.category_index,
            use_normalized_coordinates=True,
            max_boxes_to_draw=15,
            min_score_thresh=.85,
            agnostic_mode=False
        )

        return image_with_detections
