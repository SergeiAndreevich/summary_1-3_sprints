import express from 'express';
import {setupApp} from "./setupApp";
import {runMongoose} from "./settings/database/db_settings";

async function main() {
    const app = express(); //создали экземпляр приложения
    app.set('trust proxy', true);
    setupApp(app); //в отдельной функции подключили middleware и роуты
    const PORT = process.env.PORT || 5005; //выделили порт для приложения

    //подключаем mongoose
    await runMongoose();
    //и начали слушать, ждать команд для исполнения
    app.listen(PORT, () => {
    })
}
main()
