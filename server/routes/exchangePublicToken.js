import express from "express";
import plaidClient from "../plaidConfig.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
    // TODO: save this to a persistent database
    const publicToken = req.body.public_token;
    try {
        // server makes request to plaid and exchanges the public token for an access token
        // the response contains the access token
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        // These values should be saved to a persistent database and
        // associated with the currently signed-in user

        const accessToken = plaidResponse.data.access_token;
        // TODO: save this to a persistent database
        const itemID = plaidResponse.data.item_id;

        // send access token to client
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).send("Unable to exchange public token. Try again.");
    }
});

export default router;
