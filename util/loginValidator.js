module.exports.loginValidator = (
    // el orden de los argumentos debe estar igual que cuando se lo llama en el resolver
    username,
    password
) => {
    const errors = {}
    // empty user?
    if (username.trim() === '') {
        errors.username = 'username field is empty'
    }

    // empty password?
    if (password.trim() === '') {
        errors.password = 'username field is empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
