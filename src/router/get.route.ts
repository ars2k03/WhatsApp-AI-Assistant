import express, { type Request, type Response } from 'express';
import { Settings } from '../models/settings.model.js';
import { authMiddleware } from '../middleware/auth.middle.js';

const router = express.Router();

const SERVER_URL = "https://whatsapp-ai-assistant-ee5w.onrender.com";

router.route('/health').get((req : Request, res : Response) => {
  
  console.log('Cron_Job sent successful ✅')

  res.status(200).json({
      success : true,
      message : 'OK'
  });

})

router.get('/status', async (req : Request, res : Response) => {

  const settings = await Settings.findOne();

  res.status(200).json({
    Message : 'Welcome',
    aiEnabled: settings?.isEnableAi
  })

})

router.post('/status', authMiddleware, async (req, res) => {

    const { enabled } = req.body;

    console.log(enabled);

    await Settings.findOneAndUpdate(
      {},
      { isEnableAi: enabled },
      {
        upsert: true
      }
    );

    res.status(200).json({
        success: true,
        aiEnabled: enabled
    });

});

setInterval(async () => {
  try {
    await fetch(`${SERVER_URL}/health`);
    console.log("Self ping sent successful ✅");
  } catch (error) {
    console.error("Health check failed:", error);
  }
}, 5 * 60* 1000);

export default router;