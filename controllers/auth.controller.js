const QueryUser = require('../queries/user.queries')
const bcrypt = require('bcrypt')
module.exports = {
    createUser: async (req, res)=>{
        try {
            const user = req.body
            const savedUser = await QueryUser.createUser(user);
            if(savedUser){
                delete savedUser.password;
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
                const matchPassword = await user.comparePassword(password);
                if(matchPassword){
                    req.login(user);
                    delete user.password
                    res.json({
                        status: 200,
                        response: user
                    })
                }else{
                    res.json({
                        status: 403,
                        response: "forbidden"
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
    },
    verifToken: (req,res)=>{
        if(req.user){
            const user = JSON.stringify(req.user)
            res.json({
                response: user,
                status: 200
            })
        }else{
            res.json({
                status: 403,
                response: 'invalid token'
            })
        }
    }
}