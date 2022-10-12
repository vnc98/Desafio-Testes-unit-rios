import 'dotenv/config'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';
let userRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe("Auth User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })

    it('Should not be able duplicate user', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }
        
        await createUserUseCase.execute(userModel);
        
        const userAlreadyExists = createUserUseCase.execute(userModel);

        expect(userAlreadyExists).rejects.toBeInstanceOf(CreateUserError)
    })
    
})