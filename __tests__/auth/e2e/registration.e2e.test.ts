// import request from 'supertest';
// import express from "express";
// import {runMongoose} from "../../../src/settings/database/db_settings";
// import {httpStatus} from "../../../src/settings/types/httpStatuses";
//
// describe('POST /auth/registration', () => {
//     const app = express();
//     beforeAll(async ()=>{
//         await runMongoose();
//         const PORT = process.env.PORT || 8080; //выделили порт для приложения
//         app.listen(PORT, () => {
//         })
//     })
//     afterAll(async()=>{
//         await request(app).delete('/testing/all-data').expect(httpStatus.NoContent)
//     })
//     it('should register new user', async ()=> {
//         await request(app)
//             .post('/auth/registration')
//             .send({
//                 login: 'test',
//                 password: '1234',
//                 email: 'test@mail.ru'
//             })
//             .expect(httpStatus.NoContent)
//     })
// });