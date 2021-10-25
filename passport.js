const passportJwt = require('passport-jwt');
const Users = require('./models/user');
const { JWT_SECRET } = require('./config/keys')

const { ExtractJwt, Strategy } = passportJwt;

const options = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strategy = new Strategy(options, async (payload, callback) => {
    const user = await Users.findOne( { _id: payload._id} );

    if(!user) {
        return callback(new Error("User not found!"), null)
    }

    return callback(null, user)
})

module.exports = strategy;