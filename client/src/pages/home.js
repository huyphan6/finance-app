"use client";

import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button, Flex, Spacer, Heading, Stack, Text } from "@chakra-ui/react";
import axios from "../app/util/axios";
import { useRouter } from "next/router";
import { useSession } from "../app/util/sessionProvider";

const Home = () => {
    const router = useRouter();
    const { user, updateAuthToken, logout } = useSession();
    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const [accessToken, setAccessToken] = useState();
    const [account, setAccount] = useState();
    const [acc, setAcc] = useState();
    const [transactions, setTransactions] = useState();

    const handleLogout = () => {
        // clear user session data
        logout();

        // redirect to login page
        router.push("/login");

        // check if user session data is cleared
        console.log(`Current user info: ${user.uuid} ${user.authToken}`);
    };

    useEffect(() => {
        // Step 1: Get the link token from the server
        const createLinkToken = async () => {
            try {
                const res = await axios.post("/create_link_token");
                setLinkToken(res.data.link_token);
            } catch (error) {
                console.log(error);
            }
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
            try {
                const UUID = user.uuid;
                const accessToken = await axios.post("/exchange_public_token", {
                    public_token: public_token,
                    uuid: UUID,
                });
                console.log("Access token: ", accessToken.data.accessToken);
                setAccessToken(accessToken.data.accessToken);

                // saves access token to the user's context and the backend server saves it to the DB
                updateAuthToken(accessToken.data.accessToken);
                console.log(
                    `Current user info: ${user.uuid} ${user.authToken}`
                );

                // update the user's auth token field in local storage
                localStorage.setItem("user", JSON.stringify(user));
            } catch (error) {
                console.log(error);
            }
        },
    });

    // TODO: make sure the user is logged in and authenticated to show transactions
    return user.authToken && user.uuid ? (
        <>
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bg="gray.100"
            >
                <Stack alignItems="center">
                    <Heading p="10">Welcome to your Personal Dashboard</Heading>
                    <Button
                        colorScheme="green"
                        onClick={() => open()}
                        disabled={!ready}
                    >
                        Connect a bank account
                    </Button>

                    <Button
                        colorScheme="blue"
                        onClick={() => router.push("/transactions")}
                        disabled={!ready}
                    >
                        Get Transaction Data
                    </Button>

                    <Button
                        colorScheme="red"
                        onClick={handleLogout}
                        disabled={!ready}
                    >
                        Logout
                    </Button>
                </Stack>
            </Flex>
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
                <Stack alignItems="center">
                    <Heading >Welcome </Heading>
                    <Heading pb="10"> User: {user.uuid} </Heading>
                    <Button
                        colorScheme="green"
                        onClick={() => open()}
                        disabled={!ready}
                    >
                        Connect a Bank
                    </Button>

                    <Button
                        colorScheme="red"
                        onClick={handleLogout}
                        disabled={!ready}
                    >
                        Logout
                    </Button>
                </Stack>
            </Flex>
        </>
    );
};

export default Home;
