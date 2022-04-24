import { useState } from "react";


const ExistingUpload = ({isLoading, show, setShow}) => {

    const handleShow = () => {
        if ( !isLoading ) {
            setShow(!show);
        }
    };

    return (
        <div className="existing-uploader">
            <h3 className="main__second-title">Или выберите один из пасспортов</h3>
			<div className="existing-uploader-btn-container">
            	<button className="existing-uploader-btn" onClick={handleShow}>{show ? "Скрыть" : "Показать" }</button>
			</div>

        </div>
    );
};


export default ExistingUpload;
