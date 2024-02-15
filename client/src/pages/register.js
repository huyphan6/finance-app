import React from "react";
import NextLink from "next/link";
import { Flex, Stack, Input, Button, Link, Text, Heading } from "@chakra-ui/react";

const Register = () => {
    return (
        <>
            <Flex
                as="main"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bg="gray.100"
            >
                <Stack
                    spacing={4}
                    w="100%"
                    maxW="400px"
                    p={8}
                    bg="white"
                    rounded={6}
                >
                    <Heading textAlign="left">Register</Heading>
                    <Text pb="6">
                        Already Have an Account? {" "}
                        {/* <Text whiteSpace="pre-line"></Text> */}
                        <Link as={NextLink} href="/register" color="blue">
                            Login Here
                        </Link>
                    </Text>

                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                    <Input placeholder="Email" />
                    <Input placeholder="Password" type="password" />
                    <Button colorScheme="blue">Register</Button>
                </Stack>
            </Flex>
        </>
    );
};

export default Register;
