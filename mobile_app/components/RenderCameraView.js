import React from 'react';

import {
	ActivityIndicator,
    StyleSheet,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Loader from './Loader';

import {launchImageLibrary} from 'react-native-image-picker';

import {moderateScale, scale, verticalScale} from '../helpers/scaling';

const RenderCameraView = ({
	camera,
	getCameraDisabledMessage,
	loadingCamera,
	loadingImage,
	takingPicture,
	showCameraView,
	processingImage,
	rectangleOverlay=null,
	onCancel,
	onCapture,
    onPictureProcessed
}) => {
	const renderCameraControls = () => {
		const cameraIsDisabled = takingPicture || processingImage;
		const disabledStyle = {opacity: cameraIsDisabled ? 0.8 : 1};

        const IMAGE_PICKER_OPTIONS = {
			mediaType: "photo",
			quality: 1,
			includeBase64: true,
		}

		return (
			<>
				<View
					style={[
						styles.buttonBottomContainer,
						styles.whiteBgContainer,
					]}
                >
                    <View style={styles.buttonsContainer}>
					<View style={styles.buttonMarginTop}>
						<TouchableOpacity
							style={styles.button}
							onPress={onCancel}
							activeOpacity={0.8}>
							{/* <Icon
								name="ios-close"
								size={moderateScale(40)}
								style={styles.buttonIcon}
							/> */}
						</TouchableOpacity>
					</View>
					<View style={[styles.cameraOutline, disabledStyle]}>
						<TouchableOpacity
							activeOpacity={0.8}
							style={styles.cameraButton}
							onPress={onCapture}
						/>
					</View>

                    <View style={[styles.buttonMarginTop, {position:'relative',left:scale(15)}]}>
						<TouchableOpacity
							style={[ styles.button, disabledStyle]}
							onPress={() => {
								launchImageLibrary(IMAGE_PICKER_OPTIONS, (res) => {
									if (res.didCancel) {
										return;
									}
									const image = res.assets[0].uri; // uri of the image
									const base64 = res.assets[0].base64; // uri of the image
									// onPictureProcessed({initialImage:uri}) // old
									onPictureProcessed({image, base64})
								})
							}}
							activeOpacity={0.8}
						>
							<Icon name="images" size={moderateScale(20)} color="white" style={[styles.buttonIcon, {fontSize: moderateScale(40)}]} />
						</TouchableOpacity>
					</View>
				</View>
                </View>
			</>
		);
	};

	// Renders the camera controls or a loading/processing state
	const renderCameraOverlay = () => {
        let loadingMessage = loadingImage ?  'Загрузка...' : processingImage ? 'Обработка...' : null;

		return (
			<>
            {loadingMessage &&
				<Loader
                    message={loadingMessage}
				/>
            }

				<SafeAreaView style={[styles.overlay]}>
					{renderCameraControls()}
				</SafeAreaView>
			</>
		);
	};

	if (showCameraView) {
		// NOTE: I set the background color on here because for some reason the view doesn't line up correctly otherwise. It's a weird quirk I noticed.
		return (
			<View
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0)',
					position: 'relative',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
				}}>
				{camera}
				{rectangleOverlay}

				{renderCameraOverlay()}
			</View>
		);
	}

	let message = null;
	if (loadingCamera) {
		message = (
			<View style={styles.overlay}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator color="white" />
					<Text style={styles.loadingCameraMessage}>
						Загрузка камеры...
					</Text>
				</View>
			</View>
		);
	} else {
		message = (
			<Text style={styles.cameraNotAvailableText}>
				{getCameraDisabledMessage()}
			</Text>
		);
	}

	return <View style={styles.cameraNotAvailableContainer}>{message}</View>;
};

const styles = StyleSheet.create({
	whiteBgContainer: {
		// minHeight: hp("3%"),
        height: scale(100),
		backgroundColor: '#fff',
		width: '100%',
		paddingVertical: scale(5),
		// paddingHorizontal: wp("4%"),
	},
	buttonBottomContainer: {
		position: 'absolute',
		bottom: 0,
		// flexDirection: 'row',
		// alignItems: 'center',
		// justifyContent: 'space-between',
	},


	buttonsContainer: {
		flexDirection:'row',
		justifyContent: 'space-evenly',
		alignItems:"center",
		paddingHorizontal: scale(11),
	},

    button: {
		height: moderateScale(70),
		width: moderateScale(65),
        alignItems:"center",
        justifyContent: 'center',
	},

	buttonIcon: {
		color: '#000',
		fontSize: moderateScale(45),
	},
    cameraOutline: {
		borderColor: 'rgba(0,0,0,0.1)',
		borderRadius: moderateScale(50),
		borderWidth: moderateScale(6),
		height: moderateScale(88),
		width: moderateScale(88),
	},

	cameraButton: {
		backgroundColor: '#495bf5',
		borderRadius: moderateScale(50),
		flex: 1,
		margin: moderateScale(3),
	},

	cameraNotAvailableContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		marginHorizontal: scale(15),
	},
	cameraNotAvailableText: {
		color: 'white',
		fontSize: moderateScale(25),
		textAlign: 'center',
	},
	loadingCameraMessage: {
		color: 'white',
		fontSize: moderateScale(18),
		marginTop: scale(10),
		textAlign: 'center',
	},
	loadingContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	overlay: {
		bottom: 0,
		flex: 1,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},
});

export default RenderCameraView;