import re

def filter_low_conf(data_frame, threshold=-1):
    print(data_frame)
    data_frame = data_frame[(data_frame.conf > threshold)]

    if data_frame.empty:
        return ""

    return data_frame["text"].to_string(index=False)

def blocks_correcter(data_frame):
    text = filter_low_conf(data_frame)
    if len(text) < 5:
        return ""

    text = text.replace('\n', ' ')

    # remove lower case characters (noise)
    new_text = ""
    for text_spl in text.split(" "):
        temp_text = ""
        for char in text_spl:
            if char.islower():
                temp_text = ""
                break

            temp_text += char

        new_text += temp_text
        new_text += " "


    # replace excessive spaces
    text = re.sub(' +', ' ', new_text)
    # remove special characters
    for ch in ['/',"\\", "*","+", "=", "@", "'", "!", "%", "^", "&", "*", "_","+", "`", ";", ":", "[", "]", "{", "}",  ">", "<", "|"]:
        text = text.replace(ch, '')

    # text sometimes has a space at the beginning and at the end
    # " Text "
    if " " in text[0]:
        text = text[1:]
    if " " in text[-1]:
        text = text[:-1]

    return text


def sex_correcter(data_frame):
    text = filter_low_conf(data_frame)
    if "М" in text.upper():
        return "male"
    elif "Ж" in text.upper():
        return "female"

    # default
    return "male"

def one_word_correcter(data_frame):
    text = filter_low_conf(data_frame)
    if len(text) < 3:
        return ""

    # remove lower case characters (noise)
    new_text = ""
    for text_spl in text.split("\n"):
        temp_text = ""
        for char in text_spl:
            if char.islower():
                temp_text = ""
                break

            temp_text += char

        new_text += temp_text
        new_text += " "

    text = ''.join(e for e in new_text if e.isalnum())

    # remove numbers
    text = re.sub('[0-9]', '', text)
    return text

def date_correcter(data_frame):
    text = filter_low_conf(data_frame)
    if len(text) < 5:
        return {}

    text_spl = re.findall(r'[0-9]+', text)
    date = {}
    if len(text_spl) == 3:
        (day, month, year) = text_spl[:3]

        if len(day) == 2 and int(day) <= 31:
            date["day"] = day

        if len(month) == 2 and int(month) <= 12:
            date["month"] = month
        if len(year) == 4 and int(year) >= 1950 and int(year) <= 2050:
            date["year"] = year

    return date

# finds positions of first and last digits
def number_correcter(data_frame, class_name):
    text = filter_low_conf(data_frame)
    if len(text) < 5:
        return ""

    if class_name == "id":
        text = text.replace('\n', "")
        text = text.replace(' ', "")
        # tesseract gives a very unique output 93.0 11.0 442333.0
        text = "".join(text.split(".0"))
        # might have symbols, so lets filter those
        text = "".join([i for i in text if i.isdigit()])

        return text

    numbers = ""
    # find first digit in text
    fd = re.search(r"\d", text)
    # find last digit in text
    ld = re.search('(\d+)(?!.*\d)',text)
    if fd and ld and fd.start() != ld.end():
        numbers = text[fd.start():ld.end()]
    return numbers

# there are 2 ids
def choose_one_id(ocr_list):
    new_id = None
    new_lst = []
    for item in ocr_list:
        if item["class"] == "id":
            if new_id is None:
                new_id = item
            elif new_id is not None:
                new_data = new_id["data"]
                item_data = item["data"]

                # id is the same
                if new_data == item_data:
                    continue
                elif len(new_data) == len(item_data):
                    continue
                # compare lengths (should be 10)
                elif len(new_data) > len(item_data) and len(new_data) <= 10:
                    continue
                elif len(item_data) > len(new_data) and len(item_data) <= 10:
                    new_id = item
                    continue
                # change 8 to 4 on first position(tesseract reads 4 as 8)
                elif new_data[0] == "8" and item_data[0] == "4":
                    new_id = item


        else:
            new_lst.append(item)

    new_lst.append(new_id)

    return new_lst