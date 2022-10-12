import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCae: GetBalanceUseCase
let createStatementUseCase: CreateStatementUseCase


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        getBalanceUseCae = new GetBalanceUseCase(statementsRepository,userRepositoryInMemory)
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepository)
    })

    it('Should not be able get an statement without user', async () => {
        const statement: ICreateStatementDTO = {
            amount: 20,
            description: "test",
            type: OperationType.DEPOSIT,
            user_id: "test"
        }

        const getBalance = getBalanceUseCae.execute(statement);

        expect(getBalance).rejects.toBeInstanceOf(GetBalanceError)
    })

    it('Should not be able create an statement without balance', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }

        const user = await userRepositoryInMemory.create(userModel);

        const statement: ICreateStatementDTO = {
            amount: 20,
            description: "test",
            type: OperationType.DEPOSIT,
            user_id: String(user.id)
        }

        await createStatementUseCase.execute(statement);
        const getBalance = await getBalanceUseCae.execute({user_id: user.id as string});

        expect(getBalance).toHaveProperty('statement')
        expect(getBalance).toHaveProperty('balance')
    })
})