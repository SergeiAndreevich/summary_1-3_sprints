import {Router} from "express";

export const authRouter = Router({});

authRouter
    .post('/registration',)
    .post('/registration-confirmation',)
    .post('/registration-email-resending',)
    .post('/login', )
    .post('/password-recovery',)
    .post('/new-password',)
    .post('/refresh-token',)
    .post('/logout',)
    .get('/me',)

