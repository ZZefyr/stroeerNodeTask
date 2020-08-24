const express = require('express');
const app = express();
const fs = require('fs');



app.use(express.json());

app.post('/track', (req, res) => {
    fs.appendFile('log.txt', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        res.send('Saved!');
        if (req.body.hasOwnProperty('count')) {
            console.log("Zde zavolat redis, aby zvýšil hodnotu klíče o 1.");
        }
    });
});

app.get('/count', (req, res) => {
    /*Zde je třeba zavolat redis, aby vrátil hodnotu klíče count*/
    res.send([10, 20, 30]);
});
app.listen(3000, () => console.log('Listening on port 3000...'));