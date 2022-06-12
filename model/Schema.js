const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
      
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    url: {
        type: String,
        default: "",
    },
});


userSchema.pre("save",async function(next){
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        
    }
    next();

})
module.exports = mongoose.model("playlist", userSchema);