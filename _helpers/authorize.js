const expressJwt = require('express-jwt');
const Account = require('../models/account.model');

module.exports = authorize;

function authorize() {
  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['sha1', 'RS256', 'HS256'] }),
    
    // authorize based on user role
    async (req, res, next) => {
      const user = await Account.findById(req.user.sub);
      // authentication and authorization successful
      next();
    }
  ];
}