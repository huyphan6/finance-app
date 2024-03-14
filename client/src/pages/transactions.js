import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import {
    Button,
    Flex,
    Spacer,
    Heading,
    Stack,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";
import axios from "../app/util/axios";
import { useRouter } from "next/router";
import { useSession } from "../app/util/sessionProvider";

const Transactions = ({accessToken}) => {
    const { user } = useSession();
    const [transactions, setTransactions] = useState();

    useEffect(() => {
        getTransactions();
    }, [])

    const getTransactions = async () => {
        const transactions = await axios.post("/transactions", {
            access_token: accessToken,
        });

        setTransactions(transactions.data);

        // save transaction data to DB
        axios.post("/processTransactions", {
            transactions: transactions.data,
            uuid: user.uuid,
        })
    };
    return transactions ? (
        <>
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100%"
                bg="gray.100"
            >
                <TableContainer p="10">
                    <Table variant="simple" colorScheme="">
                        <TableCaption>Transactions</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Account ID</Th>
                                <Th>Vendor</Th>
                                <Th>Amount</Th>
                                <Th>Currency</Th>
                                <Th>Date</Th>
                                <Th>Category</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {transactions.added.map((tx) => {
                                return (
                                    <Tr key={tx.transaction_id}>
                                        <Td>{tx.account_id}</Td>
                                        <Td>{tx.merchant_name}</Td>
                                        <Td>{tx.amount}</Td>
                                        <Td>{tx.iso_currency_code}</Td>
                                        <Td>{tx.authorized_date}</Td>
                                        <Td>{tx.personal_finance_category.primary}</Td> 
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </>
    ) : (
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
                </Stack>
            </Flex>
        </>
    );
};

export default Transactions;
