import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_DB as string); 

try {

    await mongoClient.connect();
    console.log("✅ WhatsApp Authentication Successful");

} catch (error) {
    
    console.error("❌ Auth MongoDB Connection Error:", error);
    process.exit(1);
}

const collection = mongoClient.db("whatsapp_auth").collection("authState");

export default collection;