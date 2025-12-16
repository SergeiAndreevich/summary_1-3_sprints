import {QueryRepo} from "../../../src/classes/QueryRepo.class";
import {UsersRepo} from "../../../src/classes/Users/UsersRepo.class";
import {UsersService} from "../../../src/classes/Users/UsersService.class";
import {beforeEach} from "node:test";
import {httpStatus} from "../../../src/settings/types/httpStatuses";

describe('UsersService.createUser', () => {
    let queryRepo: jest.Mocked<QueryRepo>;
    let usersRepo: jest.Mocked<UsersRepo>;
    let usersService: UsersService;

    beforeEach(()=>{
        queryRepo = {
            findUserByLoginOrEmail: jest.fn()
        } as any;
        usersRepo = {
            createUser: jest.fn()
        } as any;
        usersService = new UsersService(queryRepo,usersRepo);
    });
    it('should return 403 if user already exists', async ()=>{
        queryRepo.findUserByLoginOrEmail.mockResolvedValue({
            id: '1', login: 'test', email: 'test@mail.ru', createdAt: new Date().toISOString()
        })
        const result = await usersService.createUser({
            login: 'test', password: '1234', email:'test@mail.ru'
        })
        expect(result.status).toBe(httpStatus.Forbidden);
        expect(usersRepo.createUser).not.toHaveBeenCalled();
    })
});
