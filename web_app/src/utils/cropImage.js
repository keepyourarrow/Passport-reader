const Clipper = require('image-clipper');

export default function (imgPath, imgId, type, bbox) {
    const imgElement = document.getElementById(imgId);

    Clipper(imgPath, function() {
        // pad a bit
        let padding = 5;
        if ( type == "id" ) {
            padding = 10;
        }
        bbox[0] = bbox[0] - padding;
        bbox[1] = bbox[1] - padding;
        bbox[2] = bbox[2] + padding;
        bbox[3] = bbox[3] + padding;

        const width = bbox[3] - bbox[1];
        const height =  bbox[2] - bbox[0];

        let new_width = 150;
        if ( !["photo","signature", "stamp"].includes(type)) {
            new_width = 350;
        }
        if ( type == "mrz" ) {
            new_width = 450;
        }
        const width_ratio = new_width / width;
        let new_height = parseInt(height * width_ratio);

        if ( type == "id" ) {
            new_height = 250;
            const height_ratio = new_height / height
            new_width = parseInt(width * height_ratio)
        }

        this.crop(bbox[1], bbox[0], width, height)
        .resize(new_width, new_height)
        .toDataURL(function(dataUrl) {
            imgElement.src = dataUrl;
        });
    })
}