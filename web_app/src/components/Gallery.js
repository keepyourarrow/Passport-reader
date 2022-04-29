import { useEffect, useState } from "react";

import EXISTING_RESULTS from '../constants/existingResults.json';

const Gallery = ({ show, setImg, setIsLoading, setResults, setShow }) => {
    const [images, setImages] = useState([]);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const newImages = importAll(require.context("../assets", false, /\.(png|jpe?g|svg)$/));

        if (newImages?.length > 0) {
            setImages(newImages);
        }
    }, []);

    function importAll(r) {
        const images = r.keys().map(r);

        return images.map((item, index) => {
            return {
                src: item,
                id: index + 1,
                isSelected: false,
            };
        });
    }

    const onSelect = (image) => {
        if (image.id) {
            let newIsSelected = false;
            const newImages = images.map((item) => {
                if (item.id == image.id) {
                    item.isSelected = !item.isSelected;
                    newIsSelected = item.isSelected;
                } else {
                    item.isSelected = false;
                }
                return { ...item };
            });

            setImages(newImages);
            setIsSelected(newIsSelected);


            if ( newIsSelected ) {
                window.scrollTo(0,0);
                setIsLoading(true);
                setResults(null);
                setTimeout(() => {
                    setIsLoading(false);
                    setImg(image.src)
                    setResults(EXISTING_RESULTS[image.id])
                    setShow(false);
                },2000)
            }
        }
    };

    if (!show) {
        return undefined;
    }

    return (
        <div className="gallery">
            {images.map((image) => {
                let classNames = "gallery__img-container";
                let checked = false;

                if ( isSelected && !image.isSelected ) {
                    classNames += " not-selected"
                }
                else if ( isSelected && image.isSelected ) {
                    checked = true;
                }

                return (
                    <div
                        className={classNames}
                        key={image.id}
                        onClick={() => onSelect(image)}
                    >
                        <div className="gallery__checkbox-container">
                            {checked &&
                                <span className="gallery__checkbox">
                                    &#10003;
                                </span>
                            }
                        </div>
                        <img className="gallery__img" src={image.src} />
                    </div>
                );
            })}
        </div>
    );
};

export default Gallery;
