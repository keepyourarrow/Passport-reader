*25000* data compared to *200* in the previous version of
*20000* training, 5000 validation/testing
*400* new images. Only 200 of those were able to go through
my change-background script that generates more variations of the same image. (Different background, fingers)
*For examples on how augmentation looks like, check out data/transformed.

In total: *600 Original* images, out of which only *200* got augmented manyfold into *25000* images.

# Config file
1. Changed num_steps, total_steps from *100000* to *50000*
1. changed max_detections_per_class from *100* to *2*
1. changed max_total_detections and max_number_of_boxes from *100* to *15*