import express, { type Application, type Request, type Response } from "express";
import "./whatsapp/whatsapp.js";
import dotenv from 'dotenv';
dotenv.config();

const app : Application= express();
const port = 8000;

const SERVER_URL = "https://whatsapp-ai-assistant-9uem.onrender.com";

app.use(express.json());


app.get("/health", (req : Request, res : Response) => {
  res.status(200).json({
    success : true,
    message : 'OK'
  });
});

setInterval(async () => {
  await fetch(`${SERVER_URL}/health`);
  console.log("Self ping sent ✅");
}, 5 * 60 * 1000);

app.listen(port, () => {
    console.log(`Server is Running ${port}....`);
})