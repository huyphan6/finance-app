import express from "express";
import plaidClient from "../plaidConfig.js";
import app from "../firebaseConfig.js";

// Firebase imports
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

const router = express.Router();
const auth = getAuth();
const db = getFirestore();

router.post("/", async (req, res, ) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password)
        const uuid = user.user.uid;

        const usersDB = db.collection("users");
        const userDoc = usersDB.doc(uuid);
        await userDoc.set({
            uid: uuid,
            firstName: firstName,
            lastName: lastName,
            email: email
        })

        res.status(200).send("User registered successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Unable to register. Try again.");
    }
})

export default router;