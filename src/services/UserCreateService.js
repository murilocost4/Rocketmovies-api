const { hash } = require("bcryptjs")
const AppError = require("../utils/AppError");

class UserCreateService {

    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async execute({name, cpf, nascimento, endereco, email, password}) {

        const checkUserExists = await this.userRepository.findByCpf(cpf)
        const validCpf = await this.userRepository.validCpf(cpf)

        if (checkUserExists) {
            throw new AppError("Este cpf ja está cadastrado");
        }
        if (!validCpf) {
            throw new AppError("CPF inválido");
        }

        const hashedPassword = await hash(password, 8)

        const userCreated = await this.userRepository.create({ name, cpf, nascimento, endereco, email, password: hashedPassword })

        return userCreated;
    }
}

module.exports = UserCreateService;