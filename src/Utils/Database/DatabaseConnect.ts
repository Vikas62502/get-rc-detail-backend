
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://anjaanbeimaan:YYKQbJEtPeDJWslh@cluster0.wtvp3.mongodb.net");
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};

export default connectDB;