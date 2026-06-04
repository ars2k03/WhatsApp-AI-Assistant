import express, { type Request, type Response } from 'express';

const router = express.Router();

const SERVER_URL = "https://whatsapp-ai-assistant-ee5w.onrender.com";

router.route('/').get((req : Request, res : Response) => {
    res.status(200).json({
        success : true,
        message : 'OK'
    });
})

setInterval(async () => {
  try {
    await fetch(`${SERVER_URL}/health`);
    console.log("Self ping sent ✅");
  } catch (error) {
    console.error("Health check failed:", error);
  }
}, 60* 1000);

export default router;