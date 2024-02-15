"use client";

import React from "react";
import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "../app/util/axios";

const Transactions = ({ accessToken }) => {
    const [transactions, setTransactions] = useState();

    const getTransactions = async () => {
        const transactions = await axios.post("/transactions", {
            access_token: accessToken,
        });

        console.log("transactions data: ", transactions.data);
        setTransactions(transactions.data);
    };
    return (
        <>
            <button onClick={() => getTransactions()}>Get Transactions</button>
            <pre>{JSON.stringify(transactions, null, 2)}</pre>
        </>
    );
};

const Home = () => {
    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const [accessToken, setAccessToken] = useState();
    const [account, setAccount] = useState();
    const [acc, setAcc] = useState();
    const [transactions, setTransactions] = useState();

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
            // TODO: send public token to server and save to DB
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
            setAccessToken(accessToken.data.accessToken);

            // const accounts = await axios.post("/accounts", {
            //   access_token: accessToken.data.accessToken,
            // });

            // console.log("accounts data: ", accounts.data);
            // setAcc(accounts.data);

            // const auth = await axios.post("/auth", {
            //   access_token: accessToken.data.accessToken,
            // });
            // console.log("auth data ", auth.data);
            // setAccount(auth.data.numbers.ach[0]);
        },
    });

    return publicToken ? (
        <>
            <Transactions accessToken={accessToken} />
        </>
    ) : (
        <>
            <button onClick={() => open()} disabled={!ready}>
                Connect a bank account
            </button>
        </>
    );
};

export default Home;
