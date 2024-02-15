"use client";

import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "../app/util/axios";
import { Flex, Stack, Button, Heading, Text, Spacer, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Index = () => {
    const router = useRouter();
    return (
        <>
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                p="8"
                w="auto"
                direction="column"
            >
                <Heading textAlign="center" p="10" m="10"> Welcome to X </Heading>

                <SimpleGrid
                columns={{ base: 0, md: 1, lg: 2 }}
                spacing={10}
                align="center"
              >
                    <Stack bg="gray.100" direction="column" p="4" m="8" maxW="75vw" borderRadius="8%">
                        <Heading textAlign="center" p="10"> New User </Heading>
                        <Button colorScheme="blue" m="10" onClick={ () =>  router.push("/register")}> Create New Account </Button>
                    </Stack>  

                    <Stack bg="gray.100" direction="column" p="4" m="8" maxW="75vw" borderRadius="8%">
                        <Heading textAlign="center" p="10"> Returning User </Heading>
                        <Button colorScheme="blue" m="10" onClick={ () =>  router.push("/login")}> Login </Button>
                    </Stack>
                </SimpleGrid>
            </Flex>
        </>
    );
};

export default Index;
