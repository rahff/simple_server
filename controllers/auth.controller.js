const QueryUser = require('../queries/user.queries')
const bcrypt = require('bcrypt')
module.exports = {
    createUser: async (req, res)=>{
        try {
            const user = req.body
            const savedUser = await QueryUser.createUser(user);
            if(savedUser){
                req.login(savedUser)
                res.json({
                    status: 200,
                    response: savedUser
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                error: error
            })
            throw error
        }
    },
    login: async (req, res)=>{
        try {
            const {password, email} = req.body;
            const user = await QueryUser.getUserByEmail(email)
            if(user){
                console.log(password, user.local.password);
                const matchPassword = await user.comparePassword(password);
                if(matchPassword){
                    req.login(user);
                    res.json({
                        status: 200,
                        response: user
                    })
                }
            }else{
                res.json({
                    status: 403,
                    response: "forbidden"
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                error: error
            })
            throw error
        }
    },
    logout: (req, res)=>{
        req.logout()
        res.json({
            status: 200,
            response: 'déconnecter'
        })
    }
}