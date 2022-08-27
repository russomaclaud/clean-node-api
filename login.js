const express = require('express');
const router = express.Router();

module.exports = () => {
    const router = new SignUpRouter();
    router.post('/signup', ExpressRouterAdapter.adapt(route));
};

class ExpressRouterAdapter {
    static adapt(roter) {
        return async (req, res) => {
            const httpRequest = {
                body: req.body,
            };
            const httpResponse = await router.route(httpRequest);
            res.status(httpResponse.statusCode).json(httpResponse.body);
        };
    }
}

// Presentación
/* Signup-router */
class SignUpRouter {
    async route(req, res) {
        const { email, password, repeatPassword } = req.body;
        new SignUpUseCase().signUp(email, password, repeatPassword);
        res.status(400).json({
            error: 'El password debe ser igual al repeatPassword',
        });
    }
}

// Domain
/* Signup-usecase */
class SignUpUseCase {
    async signUp(email, password, repeatPassword) {
        if (password === repeatPassword) {
            new AddAccountRepository().addAccount(emai, password);
        }
    }
}

// Repositories o Infraestructura
/* Add-account-reposirory */
const mongoose = require('mongoose');
const AccountModel = mongoose.model('Account');

class AddAccountRepository {
    async addAccount(email, password, repeatPassword) {
        const user = await AccountModel.create({ email, password });
        return user;
    }
}
