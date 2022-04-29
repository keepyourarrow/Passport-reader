from glob import glob
import os
import xml.etree.ElementTree as ET

# find image names
image_files = glob("./new_data/*.jpg")
image_files = [name.replace(".jpg","") for name in image_files]
image_names = [name.replace("./new_data\\","") for name in image_files]
# remove file extension

for image_file, image_name in zip(image_files, image_names):
    if '252' not in image_file:
        src = os.path.join("new_data","passport252.xml")
        dst = image_file + '.xml'
        # shutil.copy(src,dst)
        et = ET.parse(src)
        filename = et.find("filename")
        filename.text = image_name + '.jpg'
        et.write(dst)
    if image_name == 'passport255':
        break


    # cv2.imwrite(f"./images/{image_names[index]}.jpg", resized)