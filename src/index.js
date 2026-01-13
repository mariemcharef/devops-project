import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';

dotenv.config({ path: './src/config/.env' });

const startServer = async() => {
    try{
        await connectDB();
        app.on("eror", (err) => {
            throw err;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(err){
        console.error(`Failed to connect to the database: ${err}`);
    }
}
startServer();