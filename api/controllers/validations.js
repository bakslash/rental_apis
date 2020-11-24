const returns = require('./returns');

exports.signupValidation = async (req, res, next) => {
    try {
        if(!req.body.msisdn) {
            const message = "Please provide a phone number"
            await returns.validationErrors(req, res, message);
            return false
        }
        if(!req.body.name) {
            const message = "Please provide a name!"
            await returns.validationErrors(req, res, message);
            return false
        }
        // if(!req.body.email) {
        //     const message = "Please provide user email!"
        //     await returns.validationErrors(req, res, message);
        //     return false
        // }
       
        }catch(err) {
        console.log(err)
        await returns.serverError(req, res, err);
    }
 }

    
   


