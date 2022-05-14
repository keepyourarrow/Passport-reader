import shutil
from sklearn.model_selection import train_test_split

from glob import glob
import os

# do test train splitting
# find image names
os.chdir('F:')
image_files = glob("passport_data/*.jpg")
# remove file extension
file_names = [name.replace(".jpg","") for name in image_files]
file_names = [name.replace("./passport_data\\","") for name in file_names]
# Use scikit learn function for convenience
test_names, train_names = train_test_split(file_names, test_size=0.2)


def batch_move_files(file_list, source_path, destination_path):
    for file in file_list:
        name = file.replace('passport_data\\', "")
        print(name)
        # print(os.path.join(destination_path, file_name))
        # print(f"{source_path}{image}")
        # print(f"{source_path}{destination_path}{image}")

        shutil.copy(os.path.join(source_path, name + '.jpg'), os.path.join(destination_path, name + '.jpg'))
        shutil.copy(os.path.join(source_path, name + '.xml'), os.path.join(destination_path, name + '.xml'))
        # os.rename(f"{source_path}{image}", f"{source_path}{destination_path}{image}")

         # shutil.move(os.path.join(source_path, xml),
         #             os.path.join(destination_path, xml))

batch_move_files(test_names,'passport_data/', 'test/')
batch_move_files(train_names,'passport_data/', 'train/')