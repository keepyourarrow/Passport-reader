import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, Image } from 'react-native';
import CustomCrop from 'react-native-perspective-image-cropper';

import ButtonsContainer from './ButtonsContainer';
import Loader from './Loader';

const horizontalPadding = 40
const viewHeight = Dimensions.get('window').height;
const viewWidth = Dimensions.get('window').width - horizontalPadding;

const DEFAULT_COORDINATES = {
	topLeft: { x: 0, y: 0 },
	topRight: { x: viewWidth, y: 0 },
	bottomRight: { x: viewWidth, y: viewHeight },
	bottomLeft: { x: 0, y: viewHeight },
};

class CropImage extends Component {
	constructor(props) {
		super(props);

		const DEFAULT_IMAGE_HEIGHT = 3264;
		const DEFAULT_IMAGE_WIDTH = 2448;

		this.state = {
			initialImage: this.props.initialImage,
			rectangleCoordinates: this.props.rectangleCoordinates,
			imageWidth: DEFAULT_IMAGE_WIDTH,
			imageHeight: DEFAULT_IMAGE_HEIGHT,
		};
	}

	componentDidMount() {
		Image.getSize(this.props.initialImage, (width, height) => {
			this.setState({
				imageWidth: width,
				imageHeight: height,
			});
		});
	}

	updateImageForViewer(image) {
		this.props.onCroppedDone(image);
        this.props.setLoading(false);
	}

	// has more padding for easier contour detection
	// updateImageForOCR(image) {
	// 	this.props.setCroppedImageForOCR(image);
	// }

	crop() {
		this.props.setLoading(true);
		this.customCrop.crop();
	}
	fullscreen() {
		// this.customCrop.fullscreen();
	}

	// TODO
	/*
	 * 1. (low priority) if you try to drag points after fullscrening it goes bananas(For now i'll disable those buttons)
	 * 1. (low priority) implement rotate
	 * 1. (low priority) make a unique shape (circles are a part of a rectangle shape)
	 */


	render() {
        console.log(viewWidth, viewHeight);
		return (
			<View style={styles.mainContainer}>
				<View style={styles.imageContainer}>
					<View style={styles.textContainer}>
						<Text style={styles.text}>
							Потяните за углы чтобы отрегулировать.
						</Text>
					</View>

					<CustomCrop
						enablePanStrict={false}
						initialImage={this.state.initialImage}
						height={this.state.imageHeight}
						width={this.state.imageWidth}
						handlerColor="rgba(20,150,160, 1)"
						overlayColor="rgba(18,190,210, 0.5)"
						overlayStrokeColor="rgba(20,190,210, 1)"
						ref={ref => (this.customCrop = ref)}
						rectangleCoordinates={DEFAULT_COORDINATES}
						updateImageForViewer={this.updateImageForViewer.bind(this)}
					/>
				</View>

				<ButtonsContainer
					alertMessage="Изображение будет удалено. Это действие необратимо"
					cancelCallback={this.props.onCancel}
					doneCallback={this.crop.bind(this)}
					loading={this.props.loading}
				/>

				{this.props.loading && <Loader/>}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		height: '100%',
		backgroundColor: '#f2f2f2',
	},
	imageContainer: {
		flex: 1,
		marginTop: 25,
		overflow: 'hidden',
		// paddingHorizontal: 20,
	},
	textContainer: {
		paddingVertical: 6,
		width: '100%',
	},
	text: {
		textAlign: 'center',
		color: '#232323',
		fontWeight: 'bold',
	},
	firstButtonsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: 10,
		position: 'relative',
		borderBottomColor: 'rgba(203, 203, 203, 0.5)',
		borderBottomWidth: 1,
	},
	firstContainerBorder: {
		height: 53,
		width: 1,
		top: 0,
		left: 200,
		position: 'absolute',
		backgroundColor: 'rgba(203, 203, 203, 0.5)',
	},

	buttonIcon: {
		color: '#000',
		fontSize: 32,
		fontWeight: 'bold',
	},
});

export default CropImage;