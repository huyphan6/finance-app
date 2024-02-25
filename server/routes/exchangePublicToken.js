import express from "express";
import plaidClient from "../plaidConfig.js";


// Firebase imports
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import { getAuth, initializeAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";   
import fbApp from "../firebaseConfig.js";

const router = express.Router();
const auth = getAuth();
const db = getFirestore();

router.post("/", async (req, res, next) => {
    const publicToken = req.body.public_token;
    const UUID = req.body.uuid;
    try {
        // server makes request to plaid and exchanges the public token for an access token
        // the response contains the access token
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        // These values should be saved to a persistent database and
        // associated with the currently signed-in user

        const accessToken = plaidResponse.data.access_token;
        await updateDoc(doc(db, "users", UUID), {
            accessToken: accessToken,
        });

        const itemID = plaidResponse.data.item_id;

        // send access token to client
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).send("Unable to exchange public token. Try again.");
    }
});

export default router;
