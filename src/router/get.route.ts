import express, { type Request, type Response } from 'express';
import { Settings } from '../models/settings.model.js';
import { authMiddleware } from '../middleware/auth.middle.js';
import { sock } from '../whatsapp/whatsapp.js';

const router = express.Router();

const SERVER_URL = "https://whatsapp-ai-assistant-ee5w.onrender.com";

router.route('/health').get((req : Request, res : Response) => {
  
  console.log('Cron_Job sent successful ✅')

  res.status(200).json({
      success : true,
      message : 'OK'
  });

})

router.post('/send-otp', async (req : Request, res : Response) => {
  try {

    const {phone, otp} = req.body;

    if (!sock) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    if (!/^01\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    await sock.sendMessage(
      `88${phone}@s.whatsapp.net`,
      {
        text:
`👋 Welcome to *A R S Live*

🔐 Your verification code is : *${otp}*

For security reasons, do not share this code with anyone.

⏳ This code will expire in 5 minutes.
`
      }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {

    console.error('OTP Send Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });

  }
});

router.get('/status', authMiddleware, async (req : Request, res : Response) => {

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