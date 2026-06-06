import express, { type Application} from "express";
import "./whatsapp/whatsapp.js";
import dotenv from 'dotenv';
import { connectDB } from "./database/users.js";
import router from "./router/get.route.js";
dotenv.config();

const app : Application= express();
const port = 8000;

app.use(express.json());

app.use('/health', router);

await connectDB();

app.listen(port, () => {
    
    console.log(`Server is Running ${port}....`);
})