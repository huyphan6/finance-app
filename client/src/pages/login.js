import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import axios from "../app/util/axios";
import {
    Flex,
    Stack,
    Input,
    Button,
    Heading,
    Text,
    Link,
    useToast,
} from "@chakra-ui/react";

// User session object&functions so we can store&persist important user info
import { useSession } from "../app/util/sessionProvider";

const Login = () => {
    const { user, updateUUID } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            // validate form data first before sending to server
            for (const key in loginForm) {
                if (loginForm[key] === "") {
                    toast({
                        title: "Missing fields",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    return;
                }
            }

            // send form data to server and handle response
            const res = await axios.post("/login", loginForm);

            if (res.status === 200) {
                toast({
                    title: "User logged in successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });

                // set up user context here
                updateUUID(res.data.uuid);
                console.log("User UUID: ", user.uuid);

                // save user object to local storage
                localStorage.setItem("user", JSON.stringify(user));

                // successful login will route you to the home page
                router.push("/home");
            } else {
                toast({
                    title: res.data,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: error.response.data,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }

        // clear the form
        setLoginForm({
            email: "",
            password: "",
        });
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
                        First time here?{" "}
                        <Link as={NextLink} href="/register" color="blue">
                            Create An Account
                        </Link>
                    </Text>

                    <Input
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                    />
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Login
                    </Button>
                </Stack>
            </Flex>
        </>
    );
};

export default Login;
