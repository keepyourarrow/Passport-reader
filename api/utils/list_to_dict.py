def list_to_dict(list, dict={}):

    for item in list:
        if item == None:
            continue
        new_item = item.copy()
        new_item.pop('class')
        # Example: {"surname": {bbox: [400,200,150,400], data:'text', conf: '1.' } }
        dict[item["class"]] = {
            **new_item
        }

    return dict