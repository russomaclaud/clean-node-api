const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');
const UnauthorizedError = require('../helpers/unauthorize-error');

const makeSut = () => {
    /* Usamos un SPY AuthUseCaseSpy como clase y hacer prueb de integración */
    class AuthUseCaseSpy {
        auth(email, password) {
            this.email = email;
            this.password = password;
            return this.accessToken;
        }
    }

    const authUseCaseSpy = new AuthUseCaseSpy();
    authUseCaseSpy.accessToken = 'valid_token';
    const sut = new LoginRouter(authUseCaseSpy);

    return {
        sut,
        authUseCaseSpy,
    };
};

describe('Login Router', () => {
    test('Should return 400 if no email is provider', () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                password: 'any_password',
            },
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    test('Should return 400 if no password is provider', () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
            },
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    test('Should return 500 if no httpRequest is provider', () => {
        const { sut } = makeSut();
        const httpResponse = sut.route();

        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should return 500 if httpRequest has no body', () => {
        const { sut } = makeSut();
        const httpResponse = sut.route({});

        expect(httpResponse.statusCode).toBe(500);
    });

    /* Prueba de integración de email y password */
    test('Should call AuthUseCase with correct params', () => {
        const { sut, authUseCaseSpy } = makeSut();

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        };
        sut.route(httpRequest);

        expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
    });

    /* Prueba de integración de email y password */
    test('Should return 401 when invalid cedentials are provided', () => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = null;

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                password: 'invalid_password',
            },
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    test('Should return 200 when valid - valid_token cedentials are provided', () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                email: 'valid_email@mail.com',
                password: 'valid_password',
            },
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
    });

    test('Should return 500 if no AuthUseCase is provided', () => {
        const sut = new LoginRouter();

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should return 500 if AuthUseCase has no auth method', () => {
        const sut = new LoginRouter({});

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
    });
});
