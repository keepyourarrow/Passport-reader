import React, {useState} from 'react';

import {StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';

import {moderateScale, verticalScale} from '../helpers/scaling';

const FIELDS = [
    'surname',
    'id',
    'name',
    'middleName',
    'sex',
    'birthday',
    'placeOfBirth',
    'registrarName',
    'registrarCode',
    'registrationDate',
    'mrz',
];

const DisplayResults = ({results, setStep}) => {
    const [focused, setFocused] = useState(false);

    return (
        <ScrollView style={styles.mainContainer}>
            <Text style={styles.header}>RESULTS</Text>
            {FIELDS.map(type => {
                let result = 'Не определено';
                let keyboardType = undefined;
                let textArea = false;
                let inputStyles = [styles.formInput];
                let labelStyles = [styles.label];

                if (focused == type) {
                    inputStyles.push(styles.focusedInput);
                    labelStyles.push(styles.focusedLabel);
                }

                if (results[type]) {
                    if (results[type].data) {
                        result = results[type].data;

                        if (['birthday', 'registrationDate'].includes(type)) {
                            result = JSON.stringify(result);
                            inputStyles.push(styles.dateResult);
                        }

                        if (
                            ['mrz', 'registrarName', 'placeOfBirth'].includes(
                                type,
                            )
                        ) {
                            inputStyles.push(styles.textArea);
                            textArea = true;
                        }

                        if (
                            [
                                'birthday',
                                'id',
                                'registrationDate',
                                'registrarCode',
                            ].includes(type)
                        ) {
                            keyboardType = 'phone-pad';
                        }
                    } else {
                        inputStyles.push(styles.notFound);
                    }
                } else {
                    inputStyles.push(styles.notFound);
                }

                return (
                    <View style={styles.formBlock}>
                        <Text style={labelStyles}>{type}:</Text>
                        <TextInput
                            style={inputStyles}
                            value={result}
                            keyboardType={keyboardType}
                            onFocus={() => setFocused(type)}
                            onBlur={() => setFocused('')}
                            multiline={textArea}
                            editable={true}
                            numberOfLines={4}
                            inputAccessoryViewID="next"
                        />
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#d5e3eb',
        padding: moderateScale(10),
    },
    header: {
        textAlign: 'center',
        fontSize: moderateScale(24),
        margin: 20,
        color: '#000',
        fontWeight: 'bold',
    },
    formBlock: {
        marginBottom: verticalScale(10),
        position: 'relative',
    },
    label: {
        color: '#000',
        fontSize: moderateScale(14.5),
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    formInput: {
        borderWidth: 1,
        padding: moderateScale(10, 0.4),
        paddingHorizontal: moderateScale(8, 0.4),
        height: moderateScale(40, 0.4),
        fontSize: moderateScale(14, 0.4),
        color: '#000',
    },
    textArea: {
        height: verticalScale(150),
        justifyContent: 'flex-start',
        textAlignVertical: 'top',
    },
    focusedLabel: {
        color: 'rgb(31, 66, 180)',
    },
    focusedInput: {
        borderColor: 'rgb(31, 66, 180)',
    },
    dateResult: {
        color: '#385aff',
    },
    notFound: {
        color: 'red',
    },
});

export default DisplayResults;
