const {Order} = require("../models/order");
const { errorHandler } = require("../helper/dbErrorHandler");

exports.create = (req, res) => {
    req.params.user = req.profile
    const order = new Order(req.body.order)
    console.log("or", order)
    order.save((error, data) =>{
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.listOrders = (req,res) => {
    Order.find()
        .populate('user','_id name address')
        .sort('-created')
        .exec((err,orders) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};
