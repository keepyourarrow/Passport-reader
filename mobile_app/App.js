import React, {useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
	Platform
} from 'react-native';
import ConfirmImage from './components/ConfirmImage';
import CropImage from './components/CropImage';
import DisplayResults from './components/DisplayResults';

import PassportCamera from './components/PassportCamera';

const App = () => {
    const [step, setStep] = useState(1);
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [results, setResults] = useState(false);

    const onPictureProcessed = data => {
        console.log('[INFO] onPictureProcessed ', data);
        if (data) {
            if ( Platform.OS == 'ios' ) {
                setStep(3);
                setCroppedImage(data.image)
            } else {
                setImage(data.image);
                setStep(2);
            }
        }
    };
    const onCroppedDone = data => {
        console.log('[INFO] onCroppedDone ', data);
        if (data) {
            setCroppedImage(data);
            setStep(3);
        }
    };
    const onDone = async () => {
		setLoading(true);

        const formData = new FormData();
        formData.append("file", {
			uri: croppedImage,
			name: '',
			type: "image/jpeg"
		});


		try {
			console.log('here');
			const response = await fetch('https://a8b3-188-243-86-226.eu.ngrok.io/predict', {
				method: 'POST',
            	body: formData,
			});
			if ( response?.status > 400 ) {
				console.log("response", response);
				throw new Error();
			}
			data = await response.json()
			setResults(data)
			setStep(4)

			console.log("RESPONSE", data);
		} catch(err) {
			console.log('err',err);
			setServerError('Что-то пошло не так');
		}

		setLoading(false)

    };

    return (
        <SafeAreaView style={styles.container}>
            {step == 1 ? (
                <PassportCamera onPictureProcessed={onPictureProcessed} />
            ) : null}
            {step == 2 && image ? (
                <CropImage
                    initialImage={image}
                    loading={loading}
                    onCancel={() => {
                        setStep(1);
                        setImage(null);
                    }}
                    onCroppedDone={onCroppedDone}
                    setLoading={setLoading}
                />
            ) : null}
            {step == 3 && image ? (
                <ConfirmImage
                    croppedImage={croppedImage}
                    loading={loading}
                    setLoading={setLoading}
                    onCancel={() => {
                        if ( Platform.OS == 'ios' ) {
                            setStep(1);
                            setImage(null);
                        } else {
                            setStep(2);
                            setCroppedImage(null);
                        }
                    }}
                    onDone={onDone}
                    serverError={serverError}
                    setServerError={setServerError}
                />
            ) : null}
            {step == 4 ? (
                <DisplayResults results={results} setStep={setStep} />
            ) : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
    },
});

export default App;
