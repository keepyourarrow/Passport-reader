import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, } from 'react-native';

import {moderateScale,} from '../helpers/scaling';


const Loader = ({ message = "Обработка...", style="light" }) => {

    let bgColor = 'rgba(220, 220, 220, 0.7)';
    let clr = "#333333";

    if ( style == 'dark' ) {
        bgColor = 'rgba(0, 0, 0, 0.5)';
        clr = "#fff";
    }
    return (
        <View style={styles.overlay}>
            <View style={styles.loadingContainer}>
                <View style={[styles.processingContainer, {backgroundColor: bgColor}]}>
                    <ActivityIndicator color={clr} size="large" />
                    <Text style={[styles.text,{ color: clr }]}>{message}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    loadingContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    processingContainer: {
        alignItems: 'center',
        borderRadius: moderateScale(16),
        height: moderateScale(120),
        justifyContent: 'center',
        width: moderateScale(180),
    },
    text: {
        fontSize: moderateScale(28),
        marginTop: moderateScale(10)
    }
});

export default Loader;
