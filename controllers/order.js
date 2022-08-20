const { Order } = require("../models/order");
const Cart = require("../models/cart");
const { errorHandler } = require("../helper/dbErrorHandler");
const { orderBy } = require("lodash");



exports.create = async (req, res) => {
    req.params.user = req.profile
    let userId = req.params.userId;
    let cart = await Cart.findOne({ userId });
    let order = new Order(req.body)
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};



exports.listOrders = (req, res) => {
    Order.find()
        .populate('user', '_id name address')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};
