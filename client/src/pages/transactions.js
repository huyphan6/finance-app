import React, { useEffect, useState, useMemo } from "react";
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
    useToast,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from "@chakra-ui/react";
import axios from "../app/util/axios";
import { useRouter } from "next/router";
import { useSession } from "../app/util/sessionProvider";

const Transactions = ({ accessToken }) => {
    const toast = useToast();
    const { user } = useSession();
    const [transactions, setTransactions] = useState();
    const [txTableDisplay, setTxTableDisplay] = useState(false);
    const [vendorDisplay, setVendorDisplay] = useState(false);
    const [spendingCategoryDisplay, setSpendingCategoryDisplay] =
        useState(false);
    const [spendingCategories, setSpendingCategories] = useState({});
    const [topVendors, setTopVendors] = useState({});

    useEffect(() => {
        getTransactions();
    }, []);  

    const getTransactions = async () => {
        try {
            const transactions = await axios.post("/transactions", {
                access_token: accessToken,
            });

            setTransactions(transactions.data);
            
            // TODO: move data processing to server
            // data grouping + processing
            
            const spendingCategories = await axios.post("/getSpendingCategorySummary", {
                transactions: transactions.data,
            });

            const topVendors = await axios.post("/getTopVendorsSummary", {
                transactions: transactions.data,
            });
            
            setSpendingCategories(spendingCategories.data);
            setTopVendors(topVendors.data);
            console.log(spendingCategories);
            console.log(topVendors);

            // save transaction data to DB
            axios.post("/processTransactions", {
                transactions: transactions.data,
                next_cursor: transactions.data.next_cursor,
                uuid: user.uuid,
            });
        } catch (error) {
            toast({
                title: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return transactions ? (
        <>
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100%"
                bg="gray.100"
                direction="column"
            >
                {/* // TODO: Table View */}
                <Button
                    colorScheme="blue"
                    onClick={() => setTxTableDisplay(!txTableDisplay)}
                    m="4"
                >
                    Show Transactions Table
                </Button>
                <Flex>
                    <TableContainer
                        p="10"
                        display={txTableDisplay ? "block" : "none"}
                    >
                        <Table variant="striped" colorScheme="telegram">
                            <TableCaption>Transactions Table</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Description</Th>
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
                                            <Td>{tx.name}</Td>
                                            <Td>
                                                {tx.counterparties[0]
                                                    ? tx.counterparties[0].name
                                                    : tx.merchant_name}
                                            </Td>
                                            <Td>{tx.amount}</Td>
                                            <Td>{tx.iso_currency_code}</Td>
                                            <Td>{tx.authorized_date}</Td>
                                            <Td>
                                                {
                                                    tx.personal_finance_category
                                                        .primary
                                                }
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>

                <Spacer />

                {/* // TODO: Top 5 Vendors Chart */}
                <Button
                    colorScheme="blue"
                    onClick={() => setVendorDisplay(!vendorDisplay)}
                    m="4"
                >
                    Show Top 5 Vendors
                </Button>

                <Card
                    display={vendorDisplay ? "block" : "none"}
                    p="4"
                    m="4"
                    w="40vw"
                    h="40vh"
                >
                    <CardHeader>Top 5 Vendors</CardHeader>
                    <CardBody>
                        
                        {Object.entries(topVendors).map(([vendor, amount]) => {
                            return (
                                <StatGroup>
                                    <Stat>
                                        <StatLabel>{vendor}</StatLabel>
                                        <StatNumber>{amount}</StatNumber>
                                    </Stat>
                                </StatGroup>
                            );
                        })}
                    </CardBody>
                </Card>

                {/* // TODO: Spending Categories Chart */}
                <Button
                    colorScheme="blue"
                    onClick={() =>
                        setSpendingCategoryDisplay(!spendingCategoryDisplay)
                    }
                    m="4"
                >
                    Top Spending Categories
                </Button>
                <Flex></Flex>
            </Flex>
        </>
    ) : (
        <></>
    );
};

export default Transactions;
