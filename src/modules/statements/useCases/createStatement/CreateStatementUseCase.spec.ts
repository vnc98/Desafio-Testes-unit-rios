import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepository)
    })

    it('Should not be able create an statement without user', async () => {
        const statement: ICreateStatementDTO = {
            amount: 20,
            description: "test",
            type: OperationType.DEPOSIT,
            user_id: "test"
        }

        const createStatement = createStatementUseCase.execute(statement);

        expect(createStatement).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
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
            type: OperationType.WITHDRAW,
            user_id: String(user.id)
        }

        const createStatement = createStatementUseCase.execute(statement);

        expect(createStatement).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

    it('Should be able create an statement when user have a balance', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }

        const user = await userRepositoryInMemory.create(userModel);

        const statementDeposit: ICreateStatementDTO = {
            amount: 20,
            description: "test",
            type: OperationType.DEPOSIT,
            user_id: String(user.id)
        }

        const statementWithdraw: ICreateStatementDTO = {
            amount: 20,
            description: "test",
            type: OperationType.WITHDRAW,
            user_id: String(user.id)
        }

        await createStatementUseCase.execute(statementDeposit);

        const createStatementWithdraw = await createStatementUseCase.execute(statementWithdraw)


        expect(createStatementWithdraw).toBeInstanceOf(Statement)
    })
})