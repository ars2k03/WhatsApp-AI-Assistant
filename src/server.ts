import express, { type Application } from "express";
import "./whatsapp/whatsapp.js";
const app : Application= express();
const port = 8000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is Running ${port}....`);
})