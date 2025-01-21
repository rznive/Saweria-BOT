require("dotenv").config();
const axios = require("axios");
const supabase = require("../config/supabaseClient");
const getLogin = require("./getLogin");

const getBalance = async (req, res) => {
  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from("saweriaData")
      .select("authorizationToken")
      .eq("id", 1)
      .single();

    if (tokenError) {
      console.error("Error fetching token from Supabase:", tokenError);
      return res.status(500).send("Failed to fetch token from database");
    }

    let token = tokenData.authorizationToken;

    const config = {
      method: "GET",
      url: `${process.env.SAWERIA_BALANCE_URL}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Authorization: token,
        Origin: "https://saweria.co",
        Referer: "https://saweria.co/",
        Connection: "keep-alive",
      },
    };

    let response;
    try {
      response = await axios(config);
    } catch (apiError) {
      if (
        apiError.response &&
        apiError.response.data.message === "TOKEN_BROKEN_EXPIRED"
      ) {
        console.log("Token expired. Refreshing token...");
        token = await getLogin();

        const { error: updateError } = await supabase
          .from("saweriaData")
          .update({ authorizationToken: token })
          .eq("id", 1);

        if (updateError) {
          console.error("Error updating token in Supabase:", updateError);
          return res.status(500).send("Failed to update token in database");
        }

        console.log(
          "Token refreshed and saved to database. Retrying transaction..."
        );
        config.headers["Authorization"] = token;
        response = await axios(config);
      } else {
        throw apiError;
      }
    }

    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return res.status(500).send("Error fetching balance");
  }
};

module.exports = getBalance;
