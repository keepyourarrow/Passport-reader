import React, { useState } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    PermissionsAndroid,
} from 'react-native';


import {
    responsiveScreenHeight,
    responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ButtonsContainer from './ButtonsContainer';

import Loader from './Loader';

import {moderateScale, verticalScale} from '../helpers/scaling';


const ConfirmImage = ({croppedImage, loading, type, serverError, setServerError, onCancel, onDone}) => {

    return (
        <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Подтвердите изображение</Text>
                </View>

                <Image
                    resizeMode="stretch" // was stretch
                    source={{
                        uri: `${croppedImage}`,
                        width: responsiveScreenWidth(100),
                        height: responsiveScreenHeight(70),
                    }}
                />
            </View>

           <ButtonsContainer
                alertMessage="Вы уверены что хотите вернутся к предыдущему шагу?"
                cancelCallback={onCancel}
                doneCallback={onDone}
                loading={loading}
                serverError={serverError}
                setServerError={setServerError}
           />

           {loading && <Loader message="Загрузка" />}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: '#f2f2f2',
    },
    imageContainer: {
        flex: 1,
        marginTop: verticalScale(25),
        overflow: 'hidden',
    },
    textContainer: {
        paddingVertical: 6,
        width: '100%',
    },
    text: {
        textAlign: 'center',
        color: '#232323',
        fontWeight: 'bold',
        fontSize: moderateScale(14)
    },
    whiteBgContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
    },

});

export default ConfirmImage;