import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

// Route imports
import createLinkTokenRouter from "./routes/linkToken.js";
import exchangePublicTokenRouter from "./routes/exchangePublicToken.js";
import getTransactionsRouter from "./routes/getTransactions.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import getUserRouter from "./routes/getUser.js";
import getAccountsRouter from "./routes/getAccounts.js";
import getInstitutionsRouter from "./routes/getInstitutions.js";
import processTransactionsRouter from "./routes/processTransactions.js";
import getAccessTokenRouter from "./routes/getAccessToken.js";
import getSpendingCategorySummaryRouter from "./routes/getSpendingCategorySummary.js";
import getTopVendorsSummaryRouter from "./routes/getTopVendorsSummary.js";

// Firebase imports
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/create_link_token", createLinkTokenRouter);
app.use("/exchange_public_token", exchangePublicTokenRouter);
app.use("/transactions", getTransactionsRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/getUser", getUserRouter);
app.use("/getAccounts", getAccountsRouter);
app.use("/getInstitutions", getInstitutionsRouter);
app.use("/processTransactions", processTransactionsRouter);
app.use("/getAccessToken", getAccessTokenRouter);
app.use("/getSpendingCategorySummary", getSpendingCategorySummaryRouter);
app.use("/getTopVendorsSummary", getTopVendorsSummaryRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

/* 
  Plaid Flow:
    1. send request from your server to plaid to create a link token via /link/token/create
    2. from your client, use the link token to initialize Plaid Link, on success will provide a 
        temporary public token which you will send to your server
    3. after your server gets the public token, exchange it for an access token via another request to plaid
    4. use the access token to make requests to plaid on behalf of the user
    5. OPTIONAL: store the access token in your database for future use
*/
