const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:[3,"Please enter the username more than 3 characters"],
        maxlength:[40,"Atmost 40 characters hit the limit"]
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[5,"Password should contains atleast 5 characters"],
        maxlength:[20,"Password should contains tmost 20 characters"]
    },
    profilePhoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    }
},{
    timestamps:true
});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        return next();
    }
    let genSalt = await bcryptjs.genSalt(12);
    let hashedPassword = await bcryptjs.hash(this.password,genSalt);
    this.password = hashedPassword;
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}

module.exports = mongoose.model("User",userSchema);