import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button, Flex, Spacer, Heading, Stack } from "@chakra-ui/react";
import axios from "../app/util/axios";
import { useRouter } from "next/router";
import { useSession } from "../app/util/sessionProvider";

const Transactions = () => {
    const { user } = useSession();
    const [transactions, setTransactions] = useState();

    const getTransactions = async () => {
        const transactions = await axios.post("/transactions", {
            access_token: user.authToken,
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
                height="100%"
                bg="gray.100"
            >
                <Stack alignItems="center">
                    <Button
                        colorScheme="cyan"
                        onClick={() => getTransactions()}
                    >
                        Get Transactions
                    </Button>

                    <Spacer />

                    <pre>{JSON.stringify(transactions, null, 2)}</pre>
                </Stack>
            </Flex>
        </>
    );
};

export default Transactions;
