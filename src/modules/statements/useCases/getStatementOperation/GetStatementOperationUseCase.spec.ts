import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase



enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Statement", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepository)
        getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepository)
    })

    it('Should not be able get an statement operation without user', async () => {
        const test =  getStatementOperationUseCase.execute({
            user_id: "",
            statement_id: "nonExists"
        })
        

        expect(test).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it('Should not be able get an statement operation without statement_id', async () => {
        const userModel: ICreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "test"
        }

        const user = await userRepositoryInMemory.create(userModel);

        const test =  getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: "nonExists"
        })
        

        expect(test).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })

    it('Should not be able create an statement operation', async () => {
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
        
        const statementFinal = await createStatementUseCase.execute(statement);

        const test =  await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: String(statementFinal.id)
        })
        
        expect(test).toBeInstanceOf(Statement)
    })
})