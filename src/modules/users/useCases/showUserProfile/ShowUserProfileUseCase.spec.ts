import { User } from '../../entities/User';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let userRepositoryInMemory: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Auth User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })

    it('Should not be able find an exists user', async () => {
        const userAlreadyExists = showUserProfileUseCase.execute("invalid_user");

        expect(userAlreadyExists).rejects.toBeInstanceOf(ShowUserProfileError)
    })

    it('Should be able find an exists user', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }
        
        const validUser = await createUserUseCase.execute(userModel);

        const userAlreadyExists = await showUserProfileUseCase.execute(validUser.id as string);

        expect(userAlreadyExists).toBeInstanceOf(User)
    })
    
})