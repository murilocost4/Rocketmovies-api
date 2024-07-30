const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError");

const UserRepository = require("../repositories/UserRepository")
const sqliteConnection = require("../database/sqlite");
const UserCreateService = require("../services/UserCreateService")

class UsersController {
    async create(request, response) {
        const { name, cpf, nascimento, endereco, email, password } = request.body;

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        await userCreateService.execute({ name, cpf, nascimento, endereco, email, password });

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, cpf, nascimento, endereco, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if (!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedCpf = await database.get("SELECT * FROM users WHERE cpf = (?)", [cpf]);

        if (userWithUpdatedCpf && userWithUpdatedCpf.id !== user.id) {
            throw new AppError("Este CPF já está cadastrado")
        }

        user.name = name ?? user.name;
        user.cpf = name ?? user.cpf;
        user.nascimento = name ?? user.nascimento;
        user.endereco = name ?? user.endereco;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Informe a senha antiga");
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("As senhas não coincidem");
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            cpf = ?,
            nascimento = ?,
            endereco = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.cpf, user.nascimento, user.endereco, user.email, user.password, user_id]
        );

        return response.json();
    }
}

module.exports = UsersController;