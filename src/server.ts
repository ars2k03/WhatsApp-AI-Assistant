import express, { type Application} from "express";
import "./whatsapp/whatsapp.js";
import 'dotenv/config';
import { connectDB } from "./database/users.js";
import router from "./router/get.route.js";

const app : Application= express();
const port = 8000;

app.use(express.json());

app.use('/health', router);

await connectDB();

app.listen(port, () => {
    
    console.log(`Server is Running ${port}....`);
})