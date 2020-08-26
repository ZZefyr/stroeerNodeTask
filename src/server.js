const express = require('express');
const app = express();
module.exports = {
    apiPost : (action, callback) => { return app.post(action,callback) },
    apiGet : (action, callback) => { return app.get(action,callback) },
    parseJson : ()=> {return app.use(express.json())} ,
    start : ()=> {
        return app.listen(3000, () => console.log('Listening on port 3000...'));
    }
}