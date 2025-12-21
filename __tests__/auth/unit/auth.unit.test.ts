import {QueryRepo} from "../../../src/classes/QueryRepo.class";
import {UsersRepo} from "../../../src/classes/Users/UsersRepo.class";
import {UsersService} from "../../../src/classes/Users/UsersService.class";
import {httpStatus} from "../../../src/settings/types/httpStatuses";

const mockedUser = {
    id: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accountData: {
        login: 'test',
        email: 'test@mail.ru'
    },
    emailConfirmation: {
        confirmationCode: '12345',
        isConfirmed: true,
        expirationDate: new Date(),
    },
    passwordRecovery:{
        confirmationCode: '12345',
        isConfirmed: false,
        expirationDate: new Date()
    }
}

describe('UsersService.createUser', () => {
    let queryRepo: jest.Mocked<QueryRepo>;
    let usersRepo: jest.Mocked<UsersRepo>;
    let usersService: UsersService;

    beforeEach(()=>{
        queryRepo = {
            findUserByLoginOrEmail: jest.fn(),
            findUserByConfirmationCode: jest.fn(),
            findUserByEmail:  jest.fn()
        } as any;
        usersRepo = {
            createUser: jest.fn(),
            confirmEmail: jest.fn()
        } as any;
        usersService = new UsersService(queryRepo,usersRepo);
    });
    it('should return 403 if user already exists', async ()=>{
        //ищем юзера по логину или почте
        queryRepo.findUserByLoginOrEmail.mockResolvedValue(mockedUser)
        //теперь создаём юзера
        const result = await usersService.createUser({
            login: 'test', password: '1234', email:'test@mail.ru'
        })
        expect(result.status).toBe(httpStatus.Forbidden);
        expect(usersRepo.createUser).not.toHaveBeenCalled()
    })
    it('should return 400 if ConfirmationCode already used', async ()=>{
        //ищем юзера по коду
        queryRepo.findUserByConfirmationCode.mockResolvedValue(mockedUser);
        const result = await usersService.confirmEmailByCode(mockedUser.emailConfirmation.confirmationCode)
        expect(result.status).toBe(httpStatus.BadRequest);
        expect(usersRepo.confirmEmail).not.toHaveBeenCalled()
    })
    it('should return 400 if user already confirmed', async ()=>{
        //ищем юзера по email
        queryRepo.findUserByEmail.mockResolvedValue(mockedUser)
        const result = await usersService.resendEmailConfirmationCode(mockedUser.accountData.email)
        expect(result.status).toBe(httpStatus.BadRequest);
        expect(usersRepo.confirmEmail).not.toHaveBeenCalled()
    })
});
