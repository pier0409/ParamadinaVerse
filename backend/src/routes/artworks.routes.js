import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

/**
 * CREATE artwork (kirim ke admin → pending)
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      userId,
    } = req.body;

    if (!title || !description || !category || !userId) {
      return res.status(400).json({
        message: "Data karya belum lengkap",
      });
    }

    const { data, error } = await supabase
      .from("artworks")
      .insert([
        {
          title,
          description,
          category,
          user_id: userId,
          status: "pending", // ⬅️ PENTING
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (err) {
    console.error("ARTWORK CREATE ERROR:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET USER ARTWORKS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.json(data);
});

router.get("/admin/pending", async (req, res) => {
  const { data, error } = await supabase
    .from("artworks")
    .select(`
      id,
      title,
      description,
      category,
      status,
      created_at,
      user_id,
      users:users!artworks_user_id_fkey (
        id,
        name,
        email
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ADMIN PENDING ERROR:", error);
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});


router.put("/admin/approve/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("artworks")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }

  res.json({ message: "Karya disetujui" });
});

router.put("/admin/reject/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("artworks")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }

  res.json({ message: "Karya ditolak" });
});


export default router;