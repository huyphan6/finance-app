import express from "express";
import plaidClient from "../plaidConfig.js";

// Firebase imports
import admin from "firebase-admin";
import fbApp from "../firebaseConfig.js";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const router = express.Router();
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

router.post("/", async (req, res) => {
    const uuid = req.body.uuid;
    try {
        // get specific user from users collection
        const user = await getDoc(doc(db, "users", uuid));
        res.status(200).send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message); 
    }
});

export default router;
