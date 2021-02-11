exports.success = function success(result) {
    return {
        status: 'success',
        result: result
    }
}

exports.error = function error(message) {
    return {
        status: 'error',
        result: message
    }
}

// Fonction qui renvoie true si l'objet passé est une instance de Error
exports.isErr = (err) => {
    return err instanceof Error;
}

// Fonction renvoie le message d'erreur si l'objet passé en est une, sinon renvoie un succès avec l'objet
exports.checkAndChange = (obj) => {
    if (this.isErr(obj))
        return this.error(obj.message)
    else
        return this.success(obj)
}