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
    } catch (error) {}
})

export default router;