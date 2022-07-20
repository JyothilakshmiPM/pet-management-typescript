import  { model, Schema, Types, Document } from 'mongoose';

interface IUser extends Document {
    first_name: string;
    last_name: string;
    password: string;
    email: string;
    age: number;
    country: string;
    role: number;
  }

const UserSchema: Schema = new Schema({
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
        min: [1,'Min value must be 1'],
        max: [2, 'Max value must be 2'],
        default: 1
    }
});

const User = model<IUser>('User', UserSchema);


interface ICategory extends Document {
    name: string;
    status: number;
}
const CategorySchema: Schema = new Schema({
    name: {
            type: String,
            required: [true, 'Please Enter Category Name']
    },
    status: {
            type: Number,
            min: [0,'Min Value must be 0'],
            max: [1, 'Max Value must be 1'],
            required: [true, 'Please Enter Status'],
            
    }
});

const Category = model<ICategory>('Category', CategorySchema);

interface IPet extends Document {
    name: string;
    status: number;
    category_id: Types.ObjectId;
    breed: string;
    age: number;
    create_date: Date;
    update_date: Date;
}

const PetSchema: Schema = new Schema({
    name: {
            type: String,
            required: [true, 'Please Enter Pet Name']
    },
    status: {
            type: Number,
            min: [0,'Min Value must be 0'],
            max: [1, 'Max Value must be 1'],
            required: [true, 'Please Enter Status']
    },
    category_id: 
           { 
            type: Types.ObjectId, 
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

const Pet = model<IPet>('Pet', PetSchema)

export { User,Category,Pet }