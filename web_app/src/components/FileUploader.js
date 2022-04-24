import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({isLoading, setError, setImg, handleSubmitData}) => {
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if ( !['image/png', 'image/jpeg'].includes(file.type) ) {
            setError("Ошибка. Выберите .jpg или .png файлы");
            return;
        }
        handleSubmitData(file)
        setImg(URL.createObjectURL(file))
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop,  disabled: isLoading, accept: 'image/jpeg,image/png' });


    let classNames = "file-uploader";

    if ( isLoading ) {
        classNames += " disabled"
    }
    return (
        <div {...getRootProps()} className="file-uploader">
            {isDragActive && <div className="drag-active">Перетащите сюда </div>}
            <input {...getInputProps()} />
            <a className="uploader-btn">Выберите JPG изображение</a>
            <p className="uploader-drag-text">или перетащите файл сюда</p>
        </div>
    );
};

export default FileUploader;
