"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pet = exports.Category = exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: [true, 'Please Enter First name']
    },
    last_name: {
        type: String,
        required: [true, 'Please Enter Last name']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        unique: [true, 'Password must be Unique'],
        min: [6, 'Password should be atleast 6 Characters']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Email'],
        unique: [true, 'Email must be Unique'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid Email address']
    },
    age: {
        type: Number,
        required: [true, 'Please Enter Age']
    },
    country: {
        type: String,
        required: [true, 'Please Enter Country']
    },
    role: {
        type: Number,
        min: [1, 'Min value must be 1'],
        max: [2, 'Max value must be 2'],
        default: 1
    }
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.User = User;
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Category Name']
    },
    status: {
        type: Number,
        min: [0, 'Min Value must be 0'],
        max: [1, 'Max Value must be 1'],
        required: [true, 'Please Enter Status'],
    }
});
const Category = (0, mongoose_1.model)('Category', CategorySchema);
exports.Category = Category;
const PetSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Pet Name']
    },
    status: {
        type: Number,
        min: [0, 'Min Value must be 0'],
        max: [1, 'Max Value must be 1'],
        required: [true, 'Please Enter Status']
    },
    category_id: {
        type: mongoose_1.Types.ObjectId,
        ref: 'category'
    },
    breed: {
        type: String,
        required: [true, 'Please Enter Breed']
    },
    age: {
        type: Number,
        required: [true, 'Please Enter Age']
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    }
});
const Pet = (0, mongoose_1.model)('Pet', PetSchema);
exports.Pet = Pet;
//# sourceMappingURL=model.js.map