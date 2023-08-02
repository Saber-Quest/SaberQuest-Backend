import querystring from "querystring";
import { Request, Response } from "express";
import { GET } from "../../router";

export class BeatLeaderLogin {
  @GET("bl-login")
  async get(req: Request, res: Response) {
    const code = req.query.code.toString();
    const iss = req.query.iss.toString();

    if (iss !== "https://beatleader.xyz") {
      return res.status(403).send("Invalid issuer");
    }

    if (!code) {
      return res.status(400).send("No code provided");
    }

    const response = await fetch("https://api.beatleader.xyz/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        client_secret: process.env.BEATLEADER_SECRET,
        client_id: process.env.BEATLEADER_ID,
        redirect_uri: "https://saberquest.xyz/bl-login",
      }),
    }).then((res) => res.json());

    const token = response.access_token;

    const user = await fetch("https://api.beatleader.xyz/oauth2/identity", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (user.status !== 200) {
      return res.status(500).send("Error getting user");
    }

    const userJson = await user.json();

    const id = userJson.id;
    console.log("New user logged in: " + id);

    // Code to add user to database here
  }
}
