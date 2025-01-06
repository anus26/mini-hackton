import Order from "../modules/order.modules.js";

import  Products from "../modules/product.modules.js"
const placeNewOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required and cannot be empty" });
    }

    const productDetails = await Products.find({ _id: { $in: products } });

    if (productDetails.length !== products.length) {
      return res.status(404).json({ message: "One or more products were not found" });
    }

    const totalPrice = productDetails.reduce((total, product) => total + (product.price || 0), 0);

    const newOrder = await Order.create({
      user: userId,
      products,
      totalPrice,
    });

    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error placing new order:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
export {placeNewOrder}
