require("dotenv").config();
const supabase = require("../config/supabaseClient");
const cloudscraper = require("cloudscraper");

const getLogin = async () => {
  try {
    const options = {
      method: "POST",
      uri: process.env.SAWERIA_LOGIN_URL,
      body: JSON.stringify({
        email: process.env.saweriaUsername,
        password: process.env.saweriaPassword,
      }),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        Origin: "https://saweria.co",
        Referer: "https://saweria.co/",
      },
    };

    const response = await cloudscraper.post(options);
    const parsedResponse = JSON.parse(response);

    const authorizationToken = parsedResponse.headers["authorization"];

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
