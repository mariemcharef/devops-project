import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); } catch (err) { console.error(`Error: ${err}`); }
}
export default connectDB;
