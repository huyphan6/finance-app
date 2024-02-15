import express from "express";
import plaidClient from "../plaidConfig.js";

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        const access_token = request.body.access_token;

        const plaidRequest = {
            access_token: access_token
        };
        const plaidResponse = await plaidClient.transactionsSync(plaidRequest);
        response.json(plaidResponse.data);
    } catch (error) {
        console.log(error);
        response.status(500).send("failed");
    }
});

export default router;
