import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'hvmnhatminH@gmail.com', password: 'Minh0914121791'} as User);
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'Minh0914121791'} as User]);
      },
      create: (email: string, password: string) => {
        return Promise.resolve({id:1, email, password} as User);
      }
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User);
      },

      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService            
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Find all users with given email', async () => {
    const users = await controller.findAllUsers('hvmnhatminh@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('hvmnhatminh@gmail.com');
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin update session object and return user',async () => {
      const session = {userId: -10};
      const user = await controller.signin(
        {email: 'hvmnhatminh@gmail.com', password: 'Minh0914121791'}, 
        session
      );

      expect(user.id).toEqual(1);
      expect(session.userId).toEqual(1);
  });

  it('Signup unpdate session object and return user', async () => {
    const session = {userId: -10};
    fakeUsersService.find = () => null;
    const user = await controller.createUser(
      {email: 'hvmnhatminh@gmail.com', password: 'Minh0914121791'},
      session
    );

    expect(user.email).toEqual('hvmnhatminh@gmail.com');
    expect(session.userId).toEqual(1);
  });
});
