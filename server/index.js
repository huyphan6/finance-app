import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // dictates which plaid api env you will access
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.CLIENT_ID,
      "PLAID-SECRET": process.env.SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/* 
  Plaid Flow:
    1. send request from your server to plaid to create a link token via /link/token/create
    2. from your client, use the link token to initialize Plaid Link, on success will provide a 
        temporary public token which you will send to your server
    3. after your server gets the public token, exchange it for an access token via another request to plaid
    4. use the access token to make requests to plaid on behalf of the user
    5. OPTIONAL: store the access token in your database for future use
*/

// Step 1: Create Link Token
app.post("/create_link_token", async (request, response) => {
  const plaidRequest = {
    user: {
      client_user_id: "user",
    },
    client_name: "Plaid Test App",
    products: ["auth"],
    language: "en",
    redirect_uri: "http://localhost:3000/",
    country_codes: ["US"],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    // handle error
    console.log(error);
    response.status(500).send("Unable to create link token. Try again.");
  }
});

// Step 2: Initialize Plaid Link from Client Side

// Step 3: Exchange Public Token for Access Token
app.post("/exchange_public_token", async (req, res, next) => {
  const publicToken = req.body.public_token;

  try {
    // server makes request to plaid and exchanges the public token for an access token
    // the response contains the access token
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user

    const accessToken = plaidResponse.data.access_token;
    const itemID = plaidResponse.data.item_id;

    // send access token to client
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("Unable to exchange public token. Try again.");
  }
});

// Step 4: Use the access token to make requests to plaid on behalf of the user
app.post("/auth", async (request, response) => {
  try {
    const access_token = request.body.access_token;
    const plaidRequest = {
      access_token: access_token,
    };
    const plaidResponse = await plaidClient.authGet(plaidRequest);
    // prettyPrintResponse(plaidResponse);
    response.json(plaidResponse.data);
  } catch (e) {
    console.log(e)
    response.status(500).send("failed");
  }
});

// request to accounts/get
app.post("/accounts", async (request, response, next) => {
  try {
    const access_token = request.body.access_token
    const plaidRequest = {
      access_token: access_token
    }
    const plaidResponse = await plaidClient.accountsBalanceGet(plaidRequest)
    response.json(plaidResponse.data)
  } catch (error) {
    console.log(error)
    response.status(500).send("failed")
  }
})

// example express route
app.get("/api/home", (req, res) => {
  res.json({ message: "Welcome to the home page!" });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
