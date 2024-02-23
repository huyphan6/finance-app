import express from "express";
import plaidClient from "../plaidConfig.js";

// Firebase imports
import admin from "firebase-admin";
import fbApp from "../firebaseConfig.js";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const router = express.Router();
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

router.post("/", async (req, res) => {
    try {
        const access_token = req.body.access_token;

        const plaidRequest = {
            access_token: access_token,
        };
        const plaidResponse = await plaidClient.accountsGet(plaidRequest);
        res.json(plaidResponse.data);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

export default router;