import React, { useState } from "react";
import axios from "../app/util/axios";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
    Flex,
    Stack,
    Input,
    Button,
    Link,
    Text,
    Heading,
    useToast,
} from "@chakra-ui/react";

const Register = () => {
    const router = useRouter();
    const [regForm, setRegForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const toast = useToast();

    const handleChange = (e) => {
        setRegForm({
            ...regForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            // make sure that there are no missing fields
            for (const key in regForm) {
                if (regForm[key] === "") {
                    toast({
                        title: "Missing fields",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    return;
                }
            }

            const res = await axios.post("/register", regForm);

            if (res.status === 200) {
                toast({
                    title: "User registered successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });

                // successful registration will route you to the login page
                router.push("/login");
            } else {
                toast({
                    title: res.data,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: error.response.data,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }

        // clear the form
        setRegForm({
            firstName: "",
            lastName: "",
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
                    <Heading textAlign="left">Register</Heading>
                    <Text pb="6">
                        Already Have an Account?{" "}
                        {/* <Text whiteSpace="pre-line"></Text> */}
                        <Link as={NextLink} href="/login" color="blue">
                            Login Here
                        </Link>
                    </Text>

                    <Input
                        name="firstName"
                        placeholder="First Name"
                        onChange={handleChange}
                    />
                    <Input
                        name="lastName"
                        placeholder="Last Name"
                        onChange={handleChange}
                    />
                    <Input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    <Input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                    />
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Register
                    </Button>
                </Stack>
            </Flex>
        </>
    );
};

export default Register;
