
const validator = require("validator")
const z = require("zod");
function validateRequestBody(req) {

    try {
        const { email, password, firstName } = req.body;


        if (!firstName) {
            throw new Error("No first name present")

        }
        else if (!validator.isEmail(email)) {
            throw new Error("Invalid Email")
        }
        else if (!validator.isStrongPassword(password)) {
            throw new Error("Not a strong Password")
        } else {

            return true
        }

    }
    catch (error) {
        throw new Error(error)
    }

}

module.exports = validateRequestBody;