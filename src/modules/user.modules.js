import mongoose, { Schema, Types }  from "mongoose";
import bcrypt from 'bcrypt'
const userSchema=new  mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    imageUrl:{
        type:String,

    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }
    
},{
    timestamps:true,
}) 
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
      this.password=await bcrypt.hash (this.password,10)
    next()
  })

export default mongoose.model("User",userSchema)