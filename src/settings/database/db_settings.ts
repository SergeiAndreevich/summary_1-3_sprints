import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const dbSettings = {
    PORT: process.env.PORT || 5005,
    MONGO_URL:  process.env.MONGO_URL || 'mongodb://localhost:27018',
    DB_NAME: process.env.DB_NAME || 'mongodb'
}

export async function runMongoose(){
    try{
        await mongoose.connect(dbSettings.MONGO_URL,{dbName: dbSettings.DB_NAME})
    }
    catch (err){
        console.error('Mongoose connection error:', err);
        await mongoose.disconnect();
        throw new Error(`Could not connect to the database ${err}`)
    }
}
export async function stopMongoose(){
    try{
        await mongoose.disconnect();
    }
    catch (err){
        console.error('Mongoose connection error:', err);
        throw new Error(`Could not connect to the database ${err}`)
    }
}
export type WithMongoId<T> = T & { _id: ObjectId };
