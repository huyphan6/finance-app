import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import createLinkTokenRouter from "./routes/linkToken.js";
import exchangePublicTokenRouter from "./routes/exchangePublicToken.js";
import getTransactionsRouter from "./routes/getTransactions.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = express();
const PORT = 8080;
const db = getFirestore();

app.use(cors());
app.use(bodyParser.json());
app.use("/create_link_token", createLinkTokenRouter);
app.use("/exchange_public_token", exchangePublicTokenRouter);
app.use("/transactions", getTransactionsRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

// // test route to confirm database connection is successful
// app.post("/testDB", async (request, response) => {
//   let testDb = db.collection("testCollection");
//   const testDoc = testDb.doc("testDoc1");
//   await testDoc.set(request.body);

//   response.send({ Message: "Added to test DB Successfully" });
// });

/* 
  Plaid Flow:
    1. send request from your server to plaid to create a link token via /link/token/create
    2. from your client, use the link token to initialize Plaid Link, on success will provide a 
        temporary public token which you will send to your server
    3. after your server gets the public token, exchange it for an access token via another request to plaid
    4. use the access token to make requests to plaid on behalf of the user
    5. OPTIONAL: store the access token in your database for future use
*/
