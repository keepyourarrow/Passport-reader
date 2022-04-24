import glob
import re
def get_file_name():
    files = glob.glob("saved_files/*.jpg")

    if len(files) > 0:
        file_suffixes = []
        for file in glob.glob("saved_files/*.jpg"):
            regex_match = re.match(".*passport(\d+)", file)
            if regex_match:
                file_suffix = regex_match.groups()[0]
                file_suffix_int = int(file_suffix)
                file_suffixes.append(file_suffix_int)


        new_suffix = max(file_suffixes) + 1 # get max and increment by one
    else:
        new_suffix = 1

    return "saved_files/new_passport" + str(new_suffix) + ".jpg"
