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

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/create_link_token", createLinkTokenRouter);
app.use("/exchange_public_token", exchangePublicTokenRouter);
app.use("/transactions", getTransactionsRouter);
app.use("/register", registerRouter);

const PORT = process.env.PORT || 8080;
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
