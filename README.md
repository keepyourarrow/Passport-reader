demo:
https://passport-reader.netlify.app/

## Мотивация
Для чтобы не тратить время на заполнения формы где нужны паспортные данные, использовать авто распознователь который сделает это за тебя

## Stack
API: Python, FastApi, Tensorflow Object detection model, Tesseract

Web: React

Mobile: React-native

## Как работает?
Юзер делает фото главной страницы паспорта которая загружается на сервер, где машинно-обученная модель(tensorflow object detection model) распознает поля паспорта(определяет например что имя это имя и фамилия это фамилия) и Tesseract(OCR) потом читает эти поля и отправляет то что он прочитал как JSON. (Точность чтения не 100% особенно если некоторые поля попадают под тень или под яркий свет).
Есть как веб приложение так и мобильное приложение

## Точность
Определения полей(Object detection) около 100%
Чтение (OCR) около 75%. Путает некоторые буквы, некоторые буквы не распознает. Шрифт очень решает (не все паспорта написаны одним шрифтом) и тени и свет сильно решают

## Учение
Машинная модель училась на 15000 паспортах
