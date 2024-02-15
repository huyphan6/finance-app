import React, { useState } from "react";
import axios from "../app/util/axios";
import NextLink from "next/link";
import {
    Flex,
    Stack,
    Input,
    Button,
    Link,
    Text,
    Heading,
} from "@chakra-ui/react";

const Register = () => {
    const [regForm, setRegForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setRegForm({
            ...regForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            const res = await axios.post("/register", regForm);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
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
