const express = require('express');
const app = express();
module.exports = {
    apiPost : function(action, callback) { return app.post(action,callback) },
    apiGet : function(action, callback) { return app.get(action,callback) },
    parseJson : function(){ return app.use(express.json()) },
    start : function(){
        return app.listen(3000, () => console.log('Listening on port 3000...'));
    }
}