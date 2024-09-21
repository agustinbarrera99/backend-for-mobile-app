import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schema = new Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  ownerId: { type: Types.ObjectId, required: true, ref: "users" },
  photos: { type: String, default: "https://es.pngtree.com/free-png-vectors/administraci%C3%B3n" },
  description: { type: String, required: true },
  FavoriteProducts: [{ type: Types.ObjectId, ref: "users" }],
  comments: [
    {
      userId: { type: Types.ObjectId, ref: "users", required: true },
      text: { type: String, required: true },
      date: {type: Date, required: true}
    }
  ]
}, { timestamps: true });

schema.plugin(mongoosePaginate);
schema.pre("find", function() { 
  this.populate("ownerId", "-password -createdAt -updatedAt -__v")
      .populate("comments.userId", "username email");
});

const Product = model(collection, schema);
export default Product;