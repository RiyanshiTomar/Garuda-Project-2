const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be less than 50 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false


    },
    balance: {
        type: String,
        required: true,
        default: "0",
        min: [0, "Balance cannot be negative"],
        isVerified: {
            type: Boolean,
            default: false
        }
    },

},
{
timestamps: true
}
)
//pre save hash password before going into database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();


    
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//compare password at login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema)