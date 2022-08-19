const Product = require("../models/product");
const formidable = require('formidable');
const _ = require("lodash");
const fs = require('fs');
const { errorHandler } = require("../helper/dbErrorHandler");


exports.productById = (req, res, next, id) => {
    console.log("hello", req, res, next, id);
    Product.findById(id).exec((err, product) => {
        console.log('erro, product', err, product)
        if (err || !product) {
            return res.status(400).json({
                error: "Product Not found"
            });
        }
        return product
        // req.product = product
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400), json({
                error: 'imager cannot be uploaded'
            });
        }
        const { name, price, color, description, category, stock, material } = fields
        if (!name || !price || !color || !description || !category || !stock || !material) {
            return res.status(400).json({
                error: "All filed should be fill out"
            }); 
        }
        let product = new Product(fields);

        if (files.photo) {
            if (files.photo.sizr > 1000000) {
                return res.status(400).json({
                    error: "Images should be less than 1md in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(result);
        })
    });

};

exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) =>{
        if(err) {
            return res.status(400),json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedProduct,
            "message": 'product Deleted Successfully'
        })
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400), json({
                error: 'imager cannot be uploaded'
            });
        }
        const { name, price, color, description, category, stock, material } = fields
        if (!name || !price || !color || !description || !category || !stock || !material) {
            return res.status(400).json({
                error: "All filed should be fill out"
            });
        }
        let product = req.product
        product = _.extend(product, fields)

        if (files.photo) {
            if (files.photo.sizr > 1000000) {
                return res.status(400).json({
                    error: "Images should be less than 1md in size"
                });
            }
            product.photo.data = fs.readFilesSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(result);
        })
    });

};

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? (req.query.limit) : "6";
  
    Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) => {
        if (err) {
          return res.status(400).json({
            error: "Products not found",
          });
        }
        res.send(products);
      });
  };


  exports.decreaseQuantity = (req,res,next) => {
    let bulkOps = req.body.order.products.map(item => {
        return{
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {stock: -item.count  }}
            }
        };
    });
    Product.bulkWrite(bulkOps, {}, (error, product) => {
        if(error){
            return res.statuts(400).json({
                error: 'Could Not update Product'
            });
        }
        next();
    });
  };

  exports.listCategories = (req, res) => {
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.st
        }
    })
  }