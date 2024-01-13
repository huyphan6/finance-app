const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

app.use(cors());

// example express route
app.get("/api/home", (req, res) => {
    res.json({message: "Welcome to the home page!"})
})

app.listen(PORT, () => {
    console.log("server is running on port ${PORT}")
})