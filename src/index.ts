import express from 'express';
import {setupApp} from "./setupApp";
import mongoose from "mongoose";
import {dbSettings} from "./settings/db_settings";

async function main() {
    const app = express(); //создали экземпляр приложения
    setupApp(app); //в отдельной функции подключили middleware и роуты
    const PORT = process.env.PORT || 8080; //выделили порт для приложения

    //подключаем mongoose
    try{
        await mongoose.connect(dbSettings.MONGO_URL,{dbName: dbSettings.DB_NAME})
    }
    catch (err){
        console.error('Mongoose connection error:', err);
        await mongoose.disconnect();
        throw new Error(`Could not connect to the database ${err}`)
    }
    //и начали слушать, ждать команд для исполнения
    app.listen(PORT, () => {
    })
}
main()
