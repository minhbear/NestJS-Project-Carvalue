import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        //create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email) => {
                const filteredUsers = users.filter(users => users.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password
                } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('Can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Create a new user with a aslted and hased password', async () => {
        const user = await service.signup('hvmnhatminh@gmail.com', 'Minh0914121791');

        expect(user.password).not.toEqual('Minh0914121791');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('Throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'hvmnhatminh@gmail.com', password: '1' } as User]);
        await expect(service.signup('hvmnhatminh@gmail.com', 'Minh0914121791')).rejects.toThrow(BadRequestException);
    });

    it('return a user if correct password is provided', async () => {
        await service.signup('hvmnhatminh@gmail.com', 'Minh0914121791');

        const user = await service.signin('hvmnhatminh@gmail.com', 'Minh0914121791');
        expect(user).toBeDefined();
    });

    it('Throws an error if user signs up with email that is in use', async () => {
        await service.signup('hvmnhatminh@gmail.com', 'Minh0914121791');
        await expect(service.signup('hvmnhatminh@gmail.com', 'Minh0914121791')).rejects.toThrow(BadRequestException);
    });

    it("Throws if signin is called with an unused email", async () => {
        await expect(
            service.signin('hvmnhatminh@gmail.com', 'Minh0914121791')
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('hvmnhatminh@gmail.com', 'Minh0914121791');
        await expect(
            service.signin('hvmnhatminh@gmail.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
    })
});
