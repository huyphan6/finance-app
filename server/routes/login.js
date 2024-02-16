import express from "express";
import plaidClient from "../plaidConfig.js";
import app from "../firebaseConfig.js";

// Firebase imports
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//   });

const router = express.Router();
const auth = getAuth();
const db = getFirestore();

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        res.status(200).send("User logged in successfully");
    } catch {
        res.status(500).send("Unable to login. Try again.");
    }
})

export default router;