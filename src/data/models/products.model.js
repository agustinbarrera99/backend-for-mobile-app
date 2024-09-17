import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const collection = "products";

const schema = new Schema({
  name: { type: String, required: true, index: true},
  price: { type: Number, required: true },
  ownerId: { type: Types.ObjectId, required: true, ref: "users" },
  photos: [{type: [String]}],
  description: { type: String },
  likes: [{ type: Types.ObjectId, ref: "users" }]
}, {timestamps: true});

schema.plugin(mongoosePaginate)
schema.pre("find", function() { this.populate("ownerId", "-password -createdAt -updatedAt -__v") })

const Product = model(collection, schema)
export default Product