const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError");

describe("UserCreateService", () => {
    let userRepositoryInMemory = null;
    let userCreateService = null;

    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory();
        userCreateService = new UserCreateService(userRepositoryInMemory);
    })

    it("user should be created", async () => {
        const user = {
            name: "User test",
            cpf: "05468263009",
            nascimento: "01011800",
            endereco: "Rua principal 123",
            email: "user@test.com",
            password: "123"
        };
    
        const userCreated = await userCreateService.execute(user);
    
        expect(userCreated).toHaveProperty("id");
    
    })

    it("user shoud not be created with existing cpf", async () => {
        const user1 = {
            name: "User test 1",
            cpf: "05468263009",
            nascimento: "01011800",
            endereco: "Rua principal 123",
            email: "user@test.com",
            password: "123"
        }
        const user2 = {
            name: "User test 2",
            cpf: "05468263009",
            nascimento: "01011800",
            endereco: "Rua principal 123",
            email: "user@test.com",
            password: "456"
        }

        await userCreateService.execute(user1)
        expect(async () => {
            await userCreateService.execute(user2)
        }).rejects.toEqual(new AppError("Este cpf ja está cadastrado"))
    })
})

