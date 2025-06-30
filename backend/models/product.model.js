import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please enter product category']
    },
    imageUrl: {
        type: String,
        required: [true, 'Please enter product image URL']
    },
    featured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;