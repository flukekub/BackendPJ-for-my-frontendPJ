const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

// ดึง URL และ KEY จาก .env
dotenv.config({path: "./config/config.env"});
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;


// สร้าง client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
