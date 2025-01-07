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
export {createOrder}

