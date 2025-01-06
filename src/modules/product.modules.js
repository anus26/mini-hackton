import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true

    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    // orderItem:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"OrderItem",
    // }

},{timestamps:true})
export default mongoose.model("Products",ProductSchema)