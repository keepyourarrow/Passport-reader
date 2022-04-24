import {useState} from 'react';

const UrlUploader = ({isLoading, handleSubmitData}) => {
    const [url, setUrl] = useState("")

    const handleUrl = (e) => {
        const reg=/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

        console.log(e.target.value.includes('.png') || e.target.value.includes('.jpg'));
        if ( reg.test(e.target.value) && (e.target.value.includes('.png') || e.target.value.includes('.jpg')) &&
            e.target.value.includes('https://') && e.target.value.length > 25
        ) {
            // console.log('valid url', reg.test(e.target.value));
            // handleSubmitData(e.target.value, "url"); // submit url
        }

        setUrl(e.target.value)
    }

    const handleSubmit = () => {
        if ( (url.includes('https://') || url.includes('http://')) && (url.includes('.jpg') || url.includes('.png'))
            && url.length > 25
        ) {
            console.log('valid URL');
            handleSubmitData(url, "url"); // submit url
        }
    }
    return (
        <div className="url-uploader">
            <h3 className="main__second-title">Или с помощью URL</h3>
            <div className="url-uploader__container">
                <input className="form-input" type="text" placeholder="https://" onChange={handleUrl} disabled={isLoading} />
                <button className="existing-uploader-btn" onClick={handleSubmit}>Отправить</button>
            </div>
        </div>
    );
};

export default UrlUploader;
