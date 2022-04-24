import { useEffect } from 'react'
import cropImage from '../utils/cropImage';


const FIELDS = [
    'photo',
    'signature',
    "stamp",
    "surname",
    "id",
    "name",
    "middleName",
    "sex",
    "birthday",
    "placeOfBirth",
    "registrarName",
    "registrarCode",
    "registrationDate",
    "mrz",
]

const DisplayResults = ({img, results}) => {
    // results = {
    //     "stamp": {
    //         "bbox": [
    //             925,
    //             708,
    //             1433,
    //             1188
    //         ]
    //     },
    //     "signature": {
    //         "bbox": [
    //             1038,
    //             1394,
    //             1251,
    //             1788
    //         ]
    //     },
    //     "photo": {
    //         "bbox": [
    //             1947,
    //             216,
    //             2507,
    //             661
    //         ]
    //     },
    //     "mrz": {
    //         "data": " PNRUSANDREEVA<<TATI8NACKNIKOLAEVNAK<<<<<<<ecc< 65139303 26RUS6811255 FK< <<< <3 1401177 70093< 94",
    //         "conf": "1.0",
    //         "bbox": [
    //             2655,
    //             178,
    //             2854,
    //             2110
    //         ]
    //     },
    //     "registrarCode": {
    //         "data": "770-093",
    //         "conf": "1.0",
    //         "bbox": [
    //             631,
    //             914,
    //             727,
    //             1823
    //         ]
    //     },
    //     "registrarName": {
    //         "data": "ОТДЕЛОМН  УФМС РОССИИ ПО ГОР.МОСКВЕ ПО РАЙОНУ МИТИНО",
    //         "conf": "1.0",
    //         "bbox": [
    //             300,
    //             180,
    //             599,
    //             1705
    //         ]
    //     },
    //     "surname": {
    //         "data": "АНДРЕЕВА",
    //         "conf": "1.0",
    //         "bbox": [
    //             1728,
    //             761,
    //             1804,
    //             1668
    //         ]
    //     },
    //     "sex": {
    //         "data": "female",
    //         "conf": "1.0",
    //         "bbox": [
    //             2149,
    //             760,
    //             2210,
    //             1038
    //         ]
    //     },
    //     "registrationDate": {
    //         "data": {
    //             "day": "17",
    //             "month": "01",
    //             "year": "2014"
    //         },
    //         "conf": "1.0",
    //         "bbox": [
    //             647,
    //             194,
    //             728,
    //             870
    //         ]
    //     },
    //     "placeOfBirth": {
    //         "data": "  С.БИЧУРЧА БАНТЕВО ШЕМУРШИНСКОГО Р-НА ЧУВАШСКОЙ АССР",
    //         "conf": "1.0",
    //         "bbox": [
    //             2230,
    //             767,
    //             2494,
    //             1899
    //         ]
    //     },
    //     "name": {
    //         "data": "ТАТЬЯНА",
    //         "conf": "1.0",
    //         "bbox": [
    //             1927,
    //             753,
    //             2007,
    //             1672
    //         ]
    //     },
    //     "birthday": {
    //         "data": {
    //             "day": "25",
    //             "month": "11",
    //             "year": "1968"
    //         },
    //         "conf": "1.0",
    //         "bbox": [
    //             2125,
    //             1068,
    //             2213,
    //             1907
    //         ]
    //     },
    //     "middleName": {
    //         "data": "НИКОЛАЕВНА",
    //         "conf": "1.0",
    //         "bbox": [
    //             2042,
    //             756,
    //             2108,
    //             1753
    //         ]
    //     },
    //     "id": {
    //         "data": "4513393032",
    //         "conf": "1.0",
    //         "bbox": [
    //             1845,
    //             2006,
    //             2479,
    //             2058
    //         ]
    //     }
    // }

    useEffect(() => {
        setTimeout(() => {
            for ( let type of FIELDS ) {
                if ( results[type]?.bbox ) {
                    cropImage(img, `im-${type}`, type, results[type].bbox)
                }
            }
        },500)
    },[img, results])

  return (
    <div className="results__main-container">
        <div className="results__secondary-container">
            {/* <div className="results__rows">

            </div> */}
            {FIELDS.map(type => {
                let result = "Не определено";
                let resultClassName = "results__item-result"

                if ( results[type] ) {
                    if ( results[type].data ) {
                        result = results[type].data

                        if ( ["birthday", "registrationDate"].includes(type) ) {
                            result = JSON.stringify(result);
                            resultClassName += " date"
                        }
                    } else {
                        resultClassName += " not-found"
                    }

                    if ( ["stamp", "photo", "signature"].includes(type) ) {
                        result = ""
                    }


                } else {
                    resultClassName += " not-found"
                }

                return (
                    <div className="results__item" key={type}>
                        <span className="results__item-type">{type}</span>
                        {results[type]?.bbox && (
                            <img id={`im-${type}`} />
                        )}
                        <div className={resultClassName}>{result}</div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default DisplayResults