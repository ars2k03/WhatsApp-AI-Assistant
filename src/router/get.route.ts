import express, { type Request, type Response } from "express";
import { Settings } from "../models/settings.model.js";
import { authMiddleware } from "../middleware/auth.middle.js";

const router = express.Router();

router.route("/health").get((req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "OK",
  });
});

router.get("/status", authMiddleware, async (req: Request, res: Response) => {
  const settings = await Settings.findOne();

  res.status(200).json({
    Message: "Welcome",
    aiEnabled: settings?.isEnableAi,
  });
});

router.post("/status", authMiddleware, async (req, res) => {
  const { enabled } = req.body;

  console.log(enabled);

  await Settings.findOneAndUpdate(
    {},
    { isEnableAi: enabled },
    {
      upsert: true,
    }
  );

  res.status(200).json({
    success: true,
    aiEnabled: enabled,
  });
});

export default router;
