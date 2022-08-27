module.exports = class MissingParamError extends Error {
    constructor(paramName) {
        super(`Missin param: ${paramName}`);
        this.name = 'MissingParamError';
    }
};
