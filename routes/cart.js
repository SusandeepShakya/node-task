const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { create } = require('../controllers/cart');
const { productById } = require('../controllers/product');




router.post('/cart/create/:userId', requireSignin, isAuth, create);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;