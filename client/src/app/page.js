"use client";

import React, { useEffect, useState } from "react";
// import axios from "client/util/axios";
import axios from "axios";

const page = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/home").then((res) => {
      setData(res.data.message);
      console.log(res.data);
    });
  }, []);

  return <div>{data}</div>;
};

export default page;
