const express = require('express');
const app = express();
const port = process.env.port || 1337;

const fs = require('fs');
const path = require('path');

app.get("/frame", (req, res) => {
    res.sendFile(path.join(__dirname, './', 'frame.json'));
});

app.post("/frame", (req, res) => {
    fs.writeFile("./frame.json", req.body, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});