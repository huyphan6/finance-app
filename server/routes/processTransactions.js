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
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";

const router = express.Router();
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

router.post("/", async (req, res) => {
    try {
        const transactions = req.body.transactions;
        const next_cursor = req.body.next_cursor;
        const userRef = doc(db, "users", req.body.uuid);
        const transactionsRef = collection(userRef, "transactions");
        transactions.added.map( async (tx) => {
            await setDoc(doc(transactionsRef, tx.transaction_id), {
                transaction_id: tx.transaction_id,
                account_id: tx.account_id,
                merchant_name: tx.merchant_name,
                name: tx.name,
                amount: tx.amount,
                currency: tx.iso_currency_code,
                authorized_date: tx.authorized_date,
                date: tx.date,
                category: tx.personal_finance_category,
                transaction_type: tx.transaction_type,
                location: tx.location || null,
                counterparties: tx.counterparties || null,
                next_cursor: next_cursor,
            }) 
        })

        res.status(200).send("Transactions added successfully");
    } catch (error) {
        console.log(error);  
        res.status(500).send(error.message)
    }
})

export default router