const sqliteConnection = require("../database/sqlite");

class UserRepository {
    async findByCpf(cpf) {
        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE cpf = (?)", [cpf]);

        return user;
    }

    async validCpf(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') {
        return false;
    }	
    var Soma;
    var Resto;
    Soma = 0;
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999") {
			return false;
        }
        for (var i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10)) ) return false;

  Soma = 0;
    for (var i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11) ) ) return false;
    return true;
    }

    async create({ name, cpf, endereco, nascimento,  email, password }) {
        const database = await sqliteConnection();
        const userId = await database.run("INSERT INTO users (name, cpf, nascimento, endereco, email, password) VALUES (?, ?, ?, ?, ?, ?)", [name, cpf, nascimento, endereco, email, password]);

        return { id: userId };
    }
    
}

module.exports = UserRepository