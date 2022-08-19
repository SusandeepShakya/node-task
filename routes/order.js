const express = require('express');
const router = express.Router();

const { requireSignin, isAuth,  } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { create, listOrders } = require('../controllers/order');
const { decreaseQuantity } = require('../controllers/product');

router.post("/order/create/:userId", requireSignin, isAuth,  create );
 
router.get('/order/list/:userId', requireSignin, isAuth, listOrders);

router.param("userId", userById);


module.exports = router;