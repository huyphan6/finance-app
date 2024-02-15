import React from "react";
import NextLink from "next/link";
import { Flex, Stack, Input, Button, Heading, Text, Link } from "@chakra-ui/react";

const Login = () => {
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
                    <Heading textAlign="left">Welcome</Heading>
                    <Text pb="6">
                        First time here? {" "}
                        <Link as={NextLink} href="/register" color="blue">
                            Create An Account
                        </Link>
                    </Text>

                    <Input placeholder="Email" />
                    <Input placeholder="Password" type="password" />
                    <Button colorScheme="blue">Login</Button>
                </Stack>
            </Flex>
        </>
    );
};

export default Login;
