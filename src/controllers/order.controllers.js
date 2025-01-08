import Order from "../modules/order.modules.js"

const createOrder = async (req, res) => {
  const { userId, products, totalPrice } = req.body;

  if (!userId || !products || !totalPrice) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const order = new Order({
      userId,
      products,
      totalPrice,
    });

    const savedOrder = await order.save();
    res.status(201).json({ message: 'Order created successfully.', order: savedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getorder=async(req,res)=>{
try {
  const page=req.query.page||1
  const limit=req.query.limit||10
  const skip=(page-1)*limit
  const data=await Order.find().skip(skip).limit(limit)
  const totalCount=await Order.countDocuments()
  res.json({
    message:"order gett successfully",
  data,
  pagination:{
    currentPage:page,
    limit,
    totalOrders:totalCount,
    totalPages:Math.ceil(totalCount/limit),
  },
  })
} catch (error) {
  console.log("error fetch data",error.message);
  res.status(500).json({message:"failed to fetch order"})
  
}
}

const getbyId=async(req,res)=>{
  try {
   const {id}=req.params
   const order=await Order.findById(id)


   
   if (!order) {
    return res.status(404).json({ message: "order not found" });
  }
   res.status(200).json({message:"order get by id successfully",
    data:order
   }) 
  } catch (error) {
    console.log("data error to fetch",error.message);
    res.status(500).json({
      message:"failed to fetch order by id"
    })
    
    
  }
}
export {createOrder,getorder,getbyId}

