import express from "express";
import plaidClient from "../plaidConfig.js";

const router = express.Router();

router.post("/", async (request, response) => {
    const plaidRequest = {
        user: {
            client_user_id: "user",
        },
        client_name: "Plaid Test App",
        products: ["auth", "transactions"],
        language: "en",
        redirect_uri: "https://localhost:3001/",
        country_codes: ["US"],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(
            plaidRequest
        );
        response.json(createTokenResponse.data);
    } catch (error) {
        // handle error
        console.log(error);
        response.status(500).send("Unable to create link token. Try again.");
    }
});

export default router;
