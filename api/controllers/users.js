const models = require('../../models/index');
const returns = require('./returns');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const emailController = require('./emailController');
const crypto = require('crypto');

const dotenv = require('dotenv');
dotenv.config();

//const frontend_url = process.env.COPORATE_FRONT_END;

exports.signup = async (req, res, next) => {
    console.log("we in signup module")
    try {
        console.log("we are in signup module")
        // 
         bcrypt.hash(req.body.password, 10);
           // console.log("hi",mypass)


        //create the user in the database
        const createdUser = await models.users.create({
            name: req.body.name,
            msisdn: req.body.msisdn,
            email: req.body.email,
            password: req.body.password,
            status: 0
        });
        console.log(req.body)
        console.log(req.body.password)



        const token = crypto.randomBytes(64).toString('hex');

        //save the token to the database
        const validation = await models.tokens.create({
            user_id: createdUser.id,
            token: token,
            status: 1
        });
        const get_token = await models.tokens.findOne({
            where: {
                user_id: createdUser.id
            }
        })
        // const sendEmail = await emailController.sendEmilVerificationToken(createdUser.email, get_token.token);

        data = {
            createdUser
            
        }
        await returns.successful_returns(req, res, data);
        console.log(createdUser)

    } catch (err) {
        console.log(err)
        const serverError = await returns.serverError(req, res, err);
    }

};
//function to update the user password
exports.updatePassword = async (req, res, next) => {
    try {
        console.log(req.params.token)
        //check if the token is valid
        //get the token from the db
        const verify_user = await models.tokens.findOne({
            where: {
                token: req.params.token
            }
        });
        if (!verify_user) {
            const message = "Token expired";
            const validationError = await returns.validationErrors(req, res, message);
            return;
        }

        let mypass = bcrypt.hashSync(req.body.password, 10);

        //update password
        const update_user_password = await models.users.update({
            password: mypass
        }, {
            where: {
                id: verify_user.user_id
            }
        });

        data = {
            message: "Success"
        }
        await returns.successful_returns(req, res, data);
    } catch (err) {
        console.log(err)
        const serverError = await returns.serverError(req, res, err);
    }
}
exports.login = async (req, res, next) => {
    try {
        console.log("we are in log in module");

        const user = await models.users.findOne({


            where: {
                email: req.body.email
            }
        });
        if (!user) {
            //return validation error
            const message = "You are not registered";
            const validationError = await returns.validationErrors(req, res, message);
            return;
        }
     
        console.log('ty',user.password)

       
        console.log(req.body.password)
      

        if (req.body.password == user.password ) {

            const token = jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: 60 * 60 });

           let data = {
               user,
              "token": token
           }

           await returns.successful_returns(req, res, data);
        } 
    } catch (err) {
        console.log(err)
        const serverError = await returns.serverError(req, res, err);
    }

};

//endpoint to conduct email verifications
// exports.emailVerification = async (req, res, next) => {
//     try{
//         console.log("Email verification")
//         //get the token from the db
//         const verify_user = await models.coporate_users_email_tokens.findOne({
//             where: {
//                 token: req.params.token
//             }
//         });
//         if(!verify_user) {
//             const message = "Token expired";
//             const validationError = await returns.validationErrors(req, res, message);
//             return;
//         }
//         const update_user_status = await models.coporate_users_email_tokens.update({
//             token: '',
//             status: 2},
//             {where: {
//                 token: req.params.token
//             }
//         });

//         const update_users_status = await models.coporate_users.update({
//             status: 2},
//             {where: {
//                 id: verify_user.user_id
//             }
//         });

//         const get_user = await models.coporate_users.findOne({
//             where: {
//                 id: verify_user.user_id
//             }
//         });

//         if (get_user) {

//             console.log("")
//             console.log("update_users_status check")
//             console.log(get_user.email)
//             await emailController.welcomeEmail(get_user.email);
//         }

//         res.writeHead(302, {'Location': `${frontend_url}/login`});
//         res.end();
//     }catch(err) {
//         console.log(err)
//         const serverError = await returns.serverError(req, res, err);
//     }
// }

//function to resend email verification token
// exports.resendEmailToken = async (req, res, next) => {
//     try {
//         //check if the user is registered
//         const is_user_registered = await models.coporate_users.findOne({
//             where: {
//                 email: req.body.email
//             }
//         });
//         if(!is_user_registered) {
//             const message = "You are not registered in our records.";
//             const validationError = await returns.validationErrors(req, res, message);
//             return;
//         }

//         //create a new token if user is registered
//         const token = crypto.randomBytes(64).toString('hex');

//         //update the user token in database
//         const email_validation = await models.coporate_users_email_tokens.update({
//             token: token,
//             status: 1},
//             {
//                 where: {
//                     user_id: is_user_registered.id
//                 }
//         });
//         const get_token = await models.coporate_users_email_tokens.findOne({where: {
//             user_id: is_user_registered.id
//         }})
//     //send the token to user email
//         const sendEmail = await emailController.sendEmilVerificationToken(req.body.email, get_token.token);
//     //return the response
//     data = {
//         user: {name: is_user_registered.name, email: is_user_registered.email}
//     }
//     const SuccessfullReturn = await returns.successful_returns(req, res, data);

//     }catch(err) {
//         console.log(err);
//         const serverError = await returns.serverError(req, res, err);
//     }
// }

//function to reset password
// // exports.resetPassword = async (req, res, next) => {
//     try {
//         console.log(req.body.email)
//          //check if the user is registered
//          const is_user_registered = await models.coporate_users.findOne({
//             where: {
//                 email: req.body.email
//             }
//         });

//         if(!is_user_registered) {
//             const message = "You are not registered in our records.";
//             const validationError = await returns.validationErrors(req, res, message);
//             return;
//         }

//         //create a new token if user is registerd
//         const new_token = crypto.randomBytes(64).toString('hex');

//         //delete all user tokens from the database
//         const delete_tokens = await models.coporate_users_email_tokens.destroy({
//             where: {
//                 user_id: is_user_registered.id
//             }
//         })

//         //save the token to the database
//         const email_validation = await models.coporate_users_email_tokens.create({
//             user_id: is_user_registered.id,
//             token: new_token,
//             status: 1
//         });

//         const sendEmail = await emailController.sendResetPasswordToken(req.body.email, new_token);

//         data = {
//             message: "Check email to proceed with password reset"
//         }
//         const SuccessfullReturn = await returns.successful_returns(req, res, data);

//     }catch(err) {
//         console.log(err)
//         const serverError = await returns.serverError(req, res, err);
//     }
// }

// //function to update the user password
// exports.updatePassword = async (req, res, next) => {
//     try {
//         console.log(req.params.token)
//         //check if the token is valid
//         //get the token from the db
//          const verify_user = await models.coporate_users_email_tokens.findOne({
//             where: {
//                 token: req.params.token
//             }
//         });
//         if(!verify_user) {
//             const message = "Token expired";
//             const validationError = await returns.validationErrors(req, res, message);
//             return;
//         }

//         let mypass = bcrypt.hashSync(req.body.password, 10);

//         //update password
//         const update_user_password = await models.coporate_users.update({
//             password: mypass
//         }, {where: {
//             id: verify_user.user_id
//         }
//         });

//         data = {
//             message: "Success"
//         }
//         const SuccessfullReturn = await returns.successful_returns(req, res, data);
//     }catch(err) {
//         console.log(err)
//         const serverError = await returns.serverError(req, res, err);
//     }
// }

// async function doLogin(token, email, req, res) {

//     const findUser = await models.coporate_users.findOne({
//         where: {
//             email: email
//         },attributes: { exclude: ['password']}, include: [{model: models.coporate_roles_user}]
//     });
//     data = {
//         findUser,
//         "token": token,
//     }
//     SuccessfullReturn = await returns.successful_returns(req, res, data);

// }
