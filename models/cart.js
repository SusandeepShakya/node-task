const mongoose = require("mongoose");

const CartItemsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        products: [
            {
                product: String,
                count: Number,
                name: String,
                price: Number,
                totalAmount: Number
            },


        ],
        grandTotal: {
            type: Number,
        },
        active: {
            type: Boolean,
            default: true
        },
        modifiedOn: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartItemsSchema);