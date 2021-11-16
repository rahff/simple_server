const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = schema({
    name: {
        type: String,
        require : true
    },
    firstname: {
        type: String,
        require: true
    },
    local: {
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String
        }
    },
    avatar: {
        type: String,
        default:"😀"
    }
})

userSchema.statics.hashPassword = async (password)=> {
    try {
        const salt = await bcrypt.genSalt(5)
        return bcrypt.hash(password, salt)
    } catch (error) {
        throw error
    }
}
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.local.password);
  }

  const User = mongoose.model('user', userSchema)
  module.exports = User