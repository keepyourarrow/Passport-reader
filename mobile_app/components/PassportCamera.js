import React, {Component} from 'react';

import {
    Animated,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

import DocumentScanner, {RectangleOverlay} from 'react-native-document-scanner';

import RenderCameraView from './RenderCameraView';

export default class PassportCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCameraView: false,
            didLoadInitialLayout: false,
            isMultiTasking: false,
            loadingCamera: true,
            processingImage: false,
            takingPicture: false,
            overlayFlashOpacity: new Animated.Value(0),
            isReady: true,
			device: {
				previewHeightPercent: 1,
				previewWidthPercent: 1,
			},
        };

		this.camera = React.createRef();
        this.imageProcessorTimeout = null;
    }

    componentDidMount() {
        if (this.state.didLoadInitialLayout && !this.state.isMultiTasking) {
            this.turnOnCamera();
        }
    }

    componentDidUpdate() {
        if (this.state.didLoadInitialLayout) {
            if (this.state.isMultiTasking) return this.turnOffCamera(true);

            if (!this.state.isReady) {
                return this.turnOffCamera();
            }

            this.turnOnCamera();
        }
        return null;
    }

    componentWillUnmount() {
        clearTimeout(this.imageProcessorTimeout);
    }

    // Called after the device gets setup. This lets you know some platform specifics
    // like if the device has a camera or flash, or even if you have permission to use the
    // camera. It also includes the aspect ratio correction of the preview
    onDeviceSetup = deviceDetails => {
        console.log('onDeviceSetup', deviceDetails);
        const {
            hasCamera,
            permissionToUseCamera,
            flashIsAvailable,
            previewHeightPercent,
            previewWidthPercent,
        } = deviceDetails;

		if (hasCamera, permissionToUseCamera) {
			this.setState({
				loadingCamera: false,
				showCameraView: true,
				isReady: true,
				device: {
					previewHeightPercent: previewHeightPercent || 1,
					previewWidthPercent: previewWidthPercent || 1,
				}
			});
		}
    };

    // Determine why the camera is disabled.
    getCameraDisabledMessage() {
        if (this.state.isMultiTasking) {
            return 'Камера не доступна в мульти-таск моде.';
        }
        return 'Не получилось настроить камеру.';
    }
    getPreviewSize() {
        const dimensions = Dimensions.get('window');
        // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
        const heightMargin =
            ((1 - this.state.device.previewHeightPercent) * dimensions.height) /
            2;
        const widthMargin =
            ((1 - this.state.device.previewWidthPercent) * dimensions.width) /
            2;
        return {
            height: this.state.device.previewHeightPercent,
            width: this.state.device.previewWidthPercent,
            marginTop: heightMargin,
            marginLeft: widthMargin,
        };
    }

    onCapture = async () => {
		if (this.state.takingPicture) return;
		if (this.state.processingImage) return;
		this.setState({ takingPicture: true, processingImage: true });
		this.camera.current.capture();

		// If capture failed, allow for additional captures
		this.imageProcessorTimeout = setTimeout(() => {
			console.log("!!!! imageProcessorTimeout");
			if (this.state.takingPicture) {
				console.log("!!!! imageProcessorTimeout takingPicture");
				this.setState({ takingPicture: false });
			}
		}, 100);
    };

	onPictureTaken = (event) => {
		console.log("!!!!! onPictureTaken");
		this.setState({ takingPicture: false });
	};

	// The picture was taken and cached. You can now go on to using it.
	onPictureProcessed = (event) => {
		console.log(event, '!!!!! onPictureProcessed');

		this.props.onPictureProcessed({image: event.initialImage});

		this.setState({
			takingPicture: false,
			processingImage: false,
			showScannerView: this.props.cameraIsOn || false,
			croppedImage: event.croppedImage,
			initialImage: event.initialImage
		});
	};

    // Hides the camera view. If the camera view was shown and onDeviceSetup was called,
    // but no camera was found, it will not uninitialize the camera state.
    turnOffCamera(shouldUninitializeCamera = false) {
        if (shouldUninitializeCamera) {
            this.setState({
                showCameraView: false,
                isReady: false,
            });
        } else if (this.state.showCameraView) {
            this.setState({showCameraView: false});
        }
    }

    // Will show the camera view which will setup the camera and start it.
    // Expect the onDeviceSetup callback to be called
    turnOnCamera() {
        if (!this.state.showCameraView) {
            this.setState({
                showCameraView: true,
                loadingCamera: true,
            });
        }
    }

    render() {
        const previewSize = this.getPreviewSize();
        let rectangleOverlay = null;
        if (!this.state.loadingCamera && !this.state.processingImage) {
            rectangleOverlay = (
                <RectangleOverlay
                    detectedRectangle={this.state.detectedRectangle}
                    previewRatio={previewSize}
                    backgroundColor="rgba(6,255,255, 0.2)"
                    borderColor="rgb(30,215,215)"
                    borderWidth={4}
                    // == These let you auto capture and change the overlay style on detection ==
                    detectedBackgroundColor="rgba(6,255,255, 0.3)"
                    detectedBorderWidth={6}
                    detectedBorderColor="rgb(30,255,255)"
                    onDetectedCapture={this.capture}
                    allowDetection
                />
            );
        }
        return (
            <View
                style={styles.container}
                onLayout={event => {
                    // This is used to detect multi tasking mode on iOS/iPad
                    // Camera use is not allowed
                    if (Platform.OS === 'ios') {
                        const screenWidth = Dimensions.get('screen').width;
                        const isMultiTasking =
                            Math.round(event.nativeEvent.layout.width) <
                            Math.round(screenWidth);

                        if (isMultiTasking) {
                            this.setState({
                                didLoadInitialLayout: true,
                                isMultiTasking: true,
                                loadingCamera: false,
                            });
                        } else {
                            this.setState({
                                isMultiTasking: false,
                                didLoadInitialLayout: true,
                            });
                        }
                    } else {
                        this.setState({didLoadInitialLayout: true});
                    }
                }}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                    hidden={Platform.OS !== 'android'}
                />

                <RenderCameraView
                    camera={
                        <DocumentScanner
                            onPictureTaken={this.onPictureTaken}
                            onPictureProcessed={this.onPictureProcessed}
                            enableTorch={this.state.flashEnabled}
                            ref={this.camera}
                            capturedQuality={0.6}
                            onRectangleDetected={({detectedRectangle}) =>
                                this.setState({detectedRectangle})
                            }
                            onDeviceSetup={this.onDeviceSetup}
                            onTorchChanged={({enabled}) =>
                                this.setState({flashEnabled: enabled})
                            }
                            style={styles.scanner}
                        />
                    }
                    loadingCamera={this.state.loadingCamera}
                    loadingImage={this.state.loadingImage}
                    showCameraView={this.state.showCameraView}
                    processingImage={this.state.processingImage}
                    getCameraDisabledMessage={this.getCameraDisabledMessage}
                    onCancel={this.props.onCancel}
                    onCapture={this.onCapture}
                    onPictureProcessed={this.props.onPictureProcessed}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
	scanner: {
		flex: 1
	}
});
