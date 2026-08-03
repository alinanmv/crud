import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    quantity: number;
    price: number;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Please enter a name"],
        },
        quantity: {
            type: Number,
            required: [true, "Please enter a quantity"],
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Please enter a price"],
            default: 0,
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;