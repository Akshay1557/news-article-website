const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  
  },

  photo: { 
    type: String ,
    default:"/uploads/profiles/default-user.png"   // profile pic
  } ,
  
  role: {
    type: String,
    enum: ["author", "reader", "admin"],
    default: "reader",
  },
}, { timestamps: true });


// Add username + password fields automatically
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email" 
});

module.exports = mongoose.model("User", userSchema);
