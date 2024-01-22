"use client";

import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "./util/axios";

const Page = () => {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();
  const [account, setAccount] = useState();
  const [acc, setAcc] = useState();

  useEffect(() => {
    // Step 1: Get the link token from the server
    const createLinkToken = async () => {
      const res = await axios.post("/create_link_token");
      setLinkToken(res.data.link_token);
    };
    createLinkToken();
  }, []);

  // Step 2: use the link token to initialize Plaid Link, on success will provide a temporary public token
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      // save the public token
      setPublicToken(public_token);
      console.log("Public token saved successfully as: ", public_token);
      console.log("Here is the metadata:", metadata);

      // Step 3: send public token to server and exchange it for an access token
      // Send the public token to the server, server will send access token back via the response
      const accessToken = await axios.post("/exchange_public_token", {
        public_token: public_token,
      });
      console.log("Access token: ", accessToken.data.accessToken);

      const accounts = await axios.post("/accounts", {
        access_token: accessToken.data.accessToken,
      });

      console.log("accounts data: ", accounts.data);
      setAcc(accounts.data);

      // const auth = await axios.post("/auth", {
      //   access_token: accessToken.data.accessToken,
      // });
      // console.log("auth data ", auth.data);
      // setAccount(auth.data.numbers.ach[0]);
    },
  });

  return publicToken ? (
    // account && (
    //   <>
    //     <h1>Account number: {account.account}</h1>
    //     <h1>Account routing: {account.routing}</h1>
    //   </>
    <pre>{JSON.stringify(acc, null, 2)}</pre>
  ) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

// once you have the public token, it will be passed to a new component
// this component will send the public token to the server and exchange
// it for an access token.

// const PlaidAuth = ({publicToken}) => {
//   const [account, setAccount] = useState();

//   // Step 3: send public token to server and exchange it for an access token
//   useEffect(() => {
//     const exchangePublicToken = async () => {
//       // Send the public token to the server, server will send access token back via the response
//       const accessToken = await axios.post("/exchange_public_token", {public_token: publicToken});
//       console.log("Access token: ", accessToken.data.accessToken);

//       const auth = await axios.post("/auth", {
//         access_token: accessToken.data.accessToken,
//       });
//       console.log("auth data ", auth.data);
//       setAccount(auth.data.numbers.ach[0]);
//     };
//     exchangePublicToken();
//   }, []);

//   return account && (
//     <>
//       <h1>Account number: {account.account}</h1>
//       <h1>Account routing: {account.routing}</h1>
//     </>
//   )
// }

export default Page;
