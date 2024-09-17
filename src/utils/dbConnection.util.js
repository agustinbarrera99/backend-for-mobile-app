import { connect } from "mongoose";

export const dbConnection = async () => {
  try {
    await connect(process.env.MONGO_LINK);
    console.log("mongoose connected");
  } catch (error) {
    console.error(error);
  }
};
