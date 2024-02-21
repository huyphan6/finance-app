"use client";

import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button, Flex, Spacer } from "@chakra-ui/react";
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
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bg="gray.100"
            >
                <Button colorScheme="cyan" onClick={() => getTransactions()}>
                    Get Transactions
                </Button>

                <Spacer/>

                <pre>{JSON.stringify(transactions, null, 2)}</pre>
            </Flex>

            
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
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bg="gray.100"
            >
                <Button
                    colorScheme="red"
                    onClick={() => open()}
                    disabled={!ready}
                >
                    Connect a bank account
                </Button>
            </Flex>
        </>
    );
};

export default Home;
