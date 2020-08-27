const express = require('express');
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;

module.exports = {
    apiPost : (action, callback) => { return app.post(action,callback) },
    apiGet : (action, callback) => { return app.get(action,callback) },
    parseJson : ()=> {return app.use(express.json())} ,
    start : ()=> {
        return app.listen(SERVER_PORT, () => console.log('Listening on port 3000...'));
    }
}