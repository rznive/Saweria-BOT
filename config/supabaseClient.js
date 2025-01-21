require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.supabaseUrl, process.env.supabaseKey);
module.exports = supabase;
