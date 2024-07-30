class UserRepositoryInMemory {
    users = []

    async create({ name, cpf, nascimento, endereco, email, password }) {
        const user = {
            id: Math.floor(Math.random() * 1000) + 1,
            name, 
            cpf,
            nascimento,
            endereco,
            email,
            password
        }

        this.users.push(user)

        return user
    }

    async findByCpf(cpf) {
        return this.users.find(user => user.cpf === cpf)
    }
}

module.exports = UserRepositoryInMemory;