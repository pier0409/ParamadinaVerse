import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, artworkId } = req.body;

  try {
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: userId, artwork_id: artworkId });

    if (error) throw error;

    await supabase.rpc("increment_likes", { artwork_id: artworkId });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
