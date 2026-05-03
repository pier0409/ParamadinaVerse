import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    if (
      !email.endsWith("@paramadina.ac.id") &&
      !email.endsWith("@students.paramadina.ac.id")
    ) {
      return res.status(400).json({ message: "Email tidak valid" });
    }

    // generate name dari email
    const name = email
      .split("@")[0]
      .split(/[._]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const role = email.endsWith("@paramadina.ac.id")
      ? "admin"
      : "mahasiswa";

    // ⬇⬇⬇ LANGSUNG PAKAI supabase (JANGAN BIKIN LAGI)
    const { data, error } = await supabase
      .from("users")
      .upsert(
        { email, name, role },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
