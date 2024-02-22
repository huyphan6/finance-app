import express from "express";
import plaidClient from "../plaidConfig.js";

// Firebase imports
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import { getAuth, initializeAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";   
import fbApp from "../firebaseConfig.js";

const router = express.Router();
const auth = getAuth();
const db = getFirestore();

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        res.status(200).send({
            message: "User logged in successfully!",
            uuid: user.user.uid
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
})

export default router;