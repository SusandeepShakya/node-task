const Cart = require("../models/cart");
const productCont = require("../controllers/product");
const { errorHandler } = require("../helper/dbErrorHandler");

exports.create = async (req, res) => {

    let userId = req.params.userId;
    let cart = await Cart.findOne({ userId });
    const { product, count, name, price } = req.body;

    try {
        if (cart) {
            //cart exists for user
            let itemIndex = cart.products.findIndex(p => p.product == product);
            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                console.log("p", productItem.count, count)
                productItem.count = productItem.count
                productItem.totalAmount = parseInt(price * (productItem.count += count));
                cart.products[itemIndex] = productItem;
                cart.grandTotal = cart.products.map(items => items.totalAmount).reduce((acc, index) => acc + index)

            } else {
                //product does not exists in cart, add new item
                cart.products.push({ product, count, name, price, totalAmount: parseInt(count * price) });
                cart.grandTotal = cart.products.map(items => items.totalAmount).reduce((acc, index) => acc + index)
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            //no cart for user, create new cart
            const newCart = await Cart.create({
                userId,
                products: [{ product, count, name, price, totalAmount: parseInt(count * price) }],
                grandTotal: parseInt(count * price)
            });

            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}; 