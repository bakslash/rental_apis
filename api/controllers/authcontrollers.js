const jwt = require('jsonwebtoken');
const returns = require('./returns');
//const models = require('//../../models/index');

exports.checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
 
    if(typeof header !== 'undefined') {
        jwt.verify(header, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
            if (err){
              console.log(err);
              return res.status(403).json({
                "Success": "false",
                "accesstoken": null,
                "Message": "Failed to authenticate "+err
              });   
            }
            req.user_id = decoded.userId
            next();
          });

    } else {
        //If header is undefined return Forbidden (403)
        res.status(403).json({
            "message": "You are not authorized to view this page!",
             status: 403
        })
    }
}
