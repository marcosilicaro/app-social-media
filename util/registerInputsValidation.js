// normal arrow function that validates arguments
// it stores error descriptions in "errors" object
// in this function you only validate data between inputs
// if you need to validate db data, you must do it in a resolver (i.e. does the username already exist?)

module.exports.registerInputsValidation = (
    // el orden de los argumentos debe estar igual que cuando se lo llama en el resolver
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {}
    // empty user?
    if (username.trim() === '') {
        errors.username = 'username field is empty'
    }

    //empty email?
    if (email.trim() === '') {
        errors.email = 'email field is empty'
    }

    // wrong email?
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
    }

    // empty password?
    // if (password !== confirmPassword) {
    //    errors.confirmPassword = 'Passwords must match';
    // }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
