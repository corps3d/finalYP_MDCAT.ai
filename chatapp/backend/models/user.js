const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

userSchema = new mongoose.Schema({
    fullName : {
        type: String, 
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    } 
});

userSchema.pre('save', function(next) {
     if(this.isModified('password')){
        bcrypt.hash(this.password, 8, (err, hash) => {
            if(err){
                return next(err);
            }
            
            this.password = hash;
            next();
        });
     }
});

userSchema.methods.comparePassword = async function(pass) {
    if (!pass) throw new Error('Password is missing!');

    try {
        const result = await bcrypt.compare(pass, this.password);
        return result;
    } catch (e) {
        console.log("Error Occured: ", e.message );
        return false;
    }
    
} 

userSchema.statics.IsThisEmailInUse = async function(email) {
    if (!email) {
        throw new Error("No email provided");
    }

    try{
        const user = await this.findOne({email: email});
        if (user) return true
        return false
    } catch (e) {
        console.log("Error Occured: ", e.message );
        return false;
    }
}

module.exports = mongoose.model('User', userSchema);
