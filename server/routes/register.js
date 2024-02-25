import express from "express";
import plaidClient from "../plaidConfig.js";
// import app from "../firebaseConfig.js";

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
    // TODO: check if user already exists and give proper error message
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const uuid = user.user.uid;

        try {
            await setDoc(doc(db, "users", uuid), {
                uid: uuid,
                firstName: firstName,
                lastName: lastName,
                email: email,
                accessToken: null,
            })

            res.status(200).send("User registered successfully");
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }    
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

export default router;
