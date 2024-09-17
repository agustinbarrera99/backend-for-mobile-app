import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection = "users";

const schema = new Schema({
  userName: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  photo: {
    type: String,
    default:
      "https://www.freepik.es/vector-gratis/ilustracion-icono-avatar-usuario_2606572.htm#fromView=search&page=1&position=2&uuid=19c678f5-eae6-472f-9c75-51d32ae66462",
  },
  age: {type: Number},
  role: {type: Number, enum: [0, 1], default: 0},
  rating: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true }, 
      score: { type: Number, min: 0, max: 5, required: true }, 
    }
  ],
},{timestamps: true});

schema.plugin(mongoosePaginate)
const User = model(collection, schema)
export default User