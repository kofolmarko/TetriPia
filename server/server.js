const express = require('express');
const app = express();
const port = process.env.port || 1337;

const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser')
app.use(express.json());
const spawn = require('child_process').spawn;

app.get("/frame", (req, res) => {
    res.sendFile(path.join(__dirname, './', 'frame.json'));
});

app.post("/frame", (req, res) => {
    frame = req.body;
    try {
        let pythonProcess = spawn('python', ['../pico_scripts/draw_frame.py', JSON.stringify(frame)]);
        pythonProcess.stdout.on('data', function(data) {
            res.send(data.toString());
        });
    } catch (error) {
        console.log(error)
    }
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});