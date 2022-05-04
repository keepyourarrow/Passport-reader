import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator, Text, } from 'react-native';

import {moderateScale, verticalScale} from '../helpers/scaling';
import {Bar} from 'react-native-progress';



const Loader = ({ message = "Обработка...", style="light", progressBar, loading, setLoading, setServerError }) => {
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState(0);

    let bgColor = 'rgba(220, 220, 220, 0.7)';
    let clr = "#333333";

    if ( style == 'dark' ) {
        bgColor = 'rgba(0, 0, 0, 0.5)';
        clr = "#fff";
    }

    useEffect(() => {
        if ( progressBar ) {
            let newProgress = 0;
            let newProgressText = 0;
            // about 100 seconds
            const interval = setInterval(() => {
                newProgress += 0.005;
                newProgressText += 0.5;
                if ( newProgress >= 1 || newProgressText >= 100 ) {
                    newProgressText = 100;
                }
                setProgress(newProgress);
                setProgressText(parseInt(newProgressText));
                if ( newProgress >= 1 && loading ) {
                    setServerError("Проблемы с сервером");
                    setLoading(false);
                    clearInterval(interval);
                }
            },500)
        }
    },[])



    return (
        <View style={styles.overlay}>
            <View style={styles.loadingContainer}>
                <View style={[styles.processingContainer, {backgroundColor: bgColor}]}>
                    <ActivityIndicator color={clr} size="large" />
                    <Text style={[styles.text,{ color: clr }]}>{message}</Text>
                    {progressBar ?
                        <View style={styles.progressBar}>
                            <Bar
                                progress={progress}
                            />
                            <Text style={styles.progressText}>{progressText}%</Text>
                        </View>
                        : null
                    }
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
        height: moderateScale(140),
        justifyContent: 'center',
        width: moderateScale(190),
        paddingTop: verticalScale(10),
    },
    text: {
        fontSize: moderateScale(28),
        marginTop: moderateScale(10)
    },
    progressBar: {
        marginTop: 10
    },
    progressText: {
        color: "#000",
        textAlign: "right",
        fontSize: moderateScale(14),
    }
});

export default Loader;
