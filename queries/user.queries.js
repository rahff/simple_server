const User = require('../database/models/user.model');

module.exports = {
    createUser: async (user)=>{
        try {
            const hashedPassword = await User.hashPassword(user.password);
            const newUser = new User({
                name: user.name,
                firstname: user.firstname,
                local: {
                    email: user.email,
                    password: hashedPassword
                },
                avatar: user.avatar
            })
            return newUser.save()
        } catch (error) {
            throw error
        }
    },
    getUserByEmail: (email)=>{
        try {
           return User.findOne({'local.email': email}).exec();
        } catch (error) {
            throw error;
        }
    },
    findUserPerId: (id)=>{
        return User.findById(id).exec()
    }
}