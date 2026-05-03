import "dotenv/config"; // ⬅️ WAJIB BARIS PERTAMA
import app from "./src/app.js";

console.log("ENV CHECK:", {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "OK" : "MISSING",
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
