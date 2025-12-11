import express, {Express} from 'express';
import {PATH} from "./settings/PATH";
import {authRouter} from "./routers/auth.router";

export function setupApp(app: Express) {
    app.use(express.json());  //middleware для парсинга строк. Сетевые строки в объект js

    //базовый эндпоинт, стартовая страница
    app.get('/', (req, res) => {
        res.send('Go to: ______');
    })

    app.use(PATH.auth, authRouter);

}