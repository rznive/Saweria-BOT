require("dotenv").config();
const axios = require("axios");
const supabase = require("../config/supabaseClient");

const getLogin = async () => {
  try {
    const response = await axios.post(
      process.env.SAWERIA_LOGIN_URL,
      {
        email: process.env.saweriaUsername,
        password: process.env.saweriaPassword,
      },
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
          Origin: "https://saweria.co",
          Referer: "https://saweria.co/",
        },
      }
    );

    const authorizationToken = response.headers["authorization"];
    const { data, error } = await supabase
      .from("saweriaData")
      .update({ authorizationToken })
      .eq("id", 1)
      .select("*");

    if (error) {
      console.error("Error updating token in Supabase:", error);
      throw error;
    }

    console.log("Token updated successfully:", JSON.stringify(data, null, 2));
    return authorizationToken;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

module.exports = getLogin;
