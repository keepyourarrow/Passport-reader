import { useState } from "react";
import ReactLoading from "react-loading";

//#region form
import ExistingUpload from "./ExistingUpload";
import FileUploader from "./FileUploader";
import Gallery from "./Gallery";
import UrlUploader from "./UrlUploader";
//#endregion form
import DisplayResults from "./DisplayResults";

import "./Home.css";

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [img, setImg] = useState(null);
    const [results, setResults] = useState(null)


    const handleSubmitData = async (data, url = false) => {
         if ( data ) {
            setIsLoading(true);
            setError(null);
            setShow(false);
            setResults(null);
            let formData = new FormData();
            formData.append("file", data);

            let endPoint = "predict"
            let obj = {
                method: "POST",
                body: formData
            }

            if ( url ) {
                endPoint = `predict?url=${data}`
                obj = {
                    method: "GET"
                }

                setImg(data)
            }

            try {
                const response = await fetch(`https://a8b3-188-243-86-226.eu.ngrok.io/${endPoint}`, obj);
                if ( response?.status > 400 ) {
                    throw new Error();
                }
                data = await response.json()
                setResults(data)

                console.log("RESPONSE", data);
            } catch(err) {
                console.log("ERROR". err);
                setError("Что-то пошло не так.")
                setImg(null);
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <main>
            <section className="main__input-container">
                <article className="main__input-blocks">
                    <h1 className="main__title">Passport reader</h1>
                    <h2 className="main__second-title">
                        Загрузите разворот главной странице пасспорта для чтения пасспорта
                    </h2>

                    <FileUploader
                        isLoading={isLoading}
                        setError={setError}
                        setImg={setImg}
                        handleSubmitData={handleSubmitData}
                    />
                    <UrlUploader isLoading={isLoading} handleSubmitData={handleSubmitData} />
                    <ExistingUpload isLoading={isLoading} show={show} setShow={setShow} />

                    {error && <p className="error">{error}</p>}

                    {isLoading && (
                        <div className="loader">
                            <ReactLoading
                                className="mobile-loader"
                                type="spokes"
                                color="#fff"
                                height={"170px"}
                                width={"170px"}
                            />
                        </div>
                    )}
                </article>
            </section>
            {!isLoading && (
                <Gallery
                    show={show}
                    setImg={setImg}
                    setIsLoading={setIsLoading}
                    setResults={setResults}
                    setShow={setShow}
                />
            )}
            {/* so upper part of screen wouldnt tilt when gallery is shown */}
            {!results && !isLoading && !show &&
                <div className="tilt-helper"></div>
            }


            {(img && results) &&
                <DisplayResults img={img} results={results}/>
            }
        </main>
    );
};

export default Home;
