const passport = require('passport')

const getUser=(req,res)=>{
    const session = passport.session();
    return res.send(`Congratulations, your account is now fully active!`);
}

module.exports = {getUser};