import React, {useState, useEffect} from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';

import {moderateScale, scale, verticalScale} from '../helpers/scaling';

const ButtonsContainer = ({
    alertMessage = 'Подтвердите',
    loading,
    serverError,
    cancelCallback = () => {},
    doneCallback = () => {},
    setServerError = () => {},
}) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (serverError) {
            setShowAlert(true);
        }
    }, [serverError]);

    const Alert = ({alertMessage}) => {
        let props = {
            cancelText: 'Назад',
            confirmText: 'Подтвердить',
            showConfirmButton: true,
            showCancelButton: true,
            message: alertMessage,
            contentContainerStyle: {width: 280}
        };

        if (serverError) {
            props.cancelText = 'ОК';
            props.showConfirmButton = false;
            props.cancelButtonColor="#DD6B55"
            props.message = serverError;
            props.contentContainerStyle = {width: 200}
        }
        return (
            <AwesomeAlert
                {...props}
                actionContainerStyle={{justifyContent: 'space-around'}}
                confirmButtonColor="#DD6B55"
                closeOnHardwareBackPress={false}
                closeOnTouchOutside={false}
                show={showAlert}
                onCancelPressed={() => {
                    setShowAlert(false);
                    setServerError(null);
                }}
                onConfirmPressed={() => {
                    setShowAlert(false);
                    cancelCallback();
                }}
                messageStyle={styles.alertText}
                confirmButtonTextStyle={styles.alertText}
                cancelButtonTextStyle={styles.alertText}
            />
        );
    };

    const handleBack = () => {
        if (!loading) {
            setShowAlert(true);
        }
    };

    const handleDone = () => {
        if (!loading) {
            doneCallback();
        }
    };

    const disabledStyle = {opacity: loading ? 0.6 : 1};

    return (
        <View style={styles.whiteBgContainer}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleBack} disabled={loading}>
                    <Text style={[styles.buttonsText, disabledStyle]}>
                        Назад
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDone} disabled={loading}>
                    <Text style={[styles.buttonsText, disabledStyle]}>
                        Готово
                    </Text>
                </TouchableOpacity>
            </View>

            <Alert alertMessage={alertMessage} />
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
        marginTop: scale(25),
        overflow: 'hidden',
        // paddingHorizontal: 20,
    },
    textContainer: {
        paddingVertical: verticalScale(6),
        width: '100%',
    },
    text: {
        textAlign: 'center',
        color: '#232323',
        fontWeight: 'bold',
    },
    whiteBgContainer: {
        // minHeight: 100,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scale(15),
        paddingHorizontal: scale(20),
    },

    buttonsText: {
        color: '#3572bb',
        fontSize: moderateScale(15.5),
        fontWeight: 'bold',
    },
    buttonIcon: {
        color: '#000',
        fontSize: moderateScale(32),
        fontWeight: 'bold',
    },
    alertText: {
        fontSize: moderateScale(12),
    },
});

export default ButtonsContainer;
