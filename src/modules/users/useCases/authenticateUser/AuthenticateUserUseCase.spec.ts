import 'dotenv/config'
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"
let userRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase;

describe("Auth User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })

    it('Should not be able auth user without valid email', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }

        const authuser = authenticateUserUseCase.execute(userModel)

        expect(authuser).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it('Should not be able auth user with wrong password', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }
        
        await createUserUseCase.execute(userModel);
        const authuser = authenticateUserUseCase.execute({email: userModel.email, password: "wrongPassword"})

        expect(authuser).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it('Should be able auth valid user', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }
        
        await createUserUseCase.execute(userModel);
        const authuser = await authenticateUserUseCase.execute({email: userModel.email, password: userModel.password})

        expect(authuser).toHaveProperty("token")
        expect(authuser).toHaveProperty("user")
    })

    
})