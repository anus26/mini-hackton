import Products from "../modules/product.modules.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// Cloudinary Configuration
cloudinary.config({ 
    cloud_name:'dvryhevqf',
    api_key:'499764812538244' ,
    api_secret:"dZxyLgZPj9lWcMfajM6gTAGjGTc"
});

// Utility function to upload image to Cloudinary
const uploadImageToCloudinary = async (localPath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath); // Delete local file after upload
    return uploadResult.url;
  } catch (error) {
    fs.unlinkSync(localPath); // Delete local file even if upload fails
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const newProducts = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
  
    try {
      
      const uploadResult = await uploadImageToCloudinary(req.file.path);
      if (!uploadResult) {
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
  
      
      const { name, description, userId ,price} = req.body;
  
      
      if (!name) return res.status(400).json({ message: "Name is required" });
      if (!description) return res.status(400).json({ message: "Description is required" });
      if (!userId) return res.status(400).json({ message: "User ID is required" });
      if (!price) return res.status(400).json({ message: "price is required" });
      
      const newProduct = await Products.create({
        imageUrl: uploadResult, 
        name,
        description,
        price,
        createdby: userId,
      });
  
      
      res.status(200).json({
        message: "Image uploaded and product created successfully",
        data: newProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  };
  

const getProduct=async(req,res)=>{
    try {
        const page=req.query.page||1
        const limit=req.query.limit||10
        const skip=(page-1)*limit
       const data=await Products.find().skip(skip).limit(limit)


        res.status(200).json({
            message: "Users fetched successfully",
           data,
           page,
           limit
        });
    } catch (error) {
        res.json(error)
        res.status(500).json({ message: "Failed to fetch products" });
    }
}


const getProductByID = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Products.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  };

  const updateproduct=async(req,res)=>{
    try {
        const {id}=req.params
        const {name,description,imageUrl,price}=req.body
        const checkproduct=await Products.findById(id)
        if(!checkproduct)return res.status(400).json({message :"product not found"})
       const updatedproduct=await Products.findByIdAndUpdate(id,{name,description,imageUrl,price})
        res.status(200).json({
            message: "Product updated successfully",
            data: updatedproduct,
          });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
  }  

  const deleteproduct=async(req,res)=>{
      try {
        const {id}=req.params
        const  deleteproduct=await Products.findByIdAndDelete(id)
        res.json({message:"delete successfully",data:deleteproduct})
      } catch (error) {
        console.error("Error delete product:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
      }
  }

export { newProducts,getProduct ,getProductByID,updateproduct,deleteproduct};



// axiosintercetors
// https://forms.gle/5vDTWSz1JaUSUCdV9
// https://ayyan1700.github.io/shopmks/