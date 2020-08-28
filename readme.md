# How to run it
### If you are windows user  
Run this following comand in terminal to start node server:  
```
npm run start-win
```

### If you are linux user  
Run this following comand in terminal to start node server:  
```
npm run start-linux
```

## API calls
I would recommend to use POSTMAN app


### 1) POST + JSON body
```
localhost:3000/track
```
This POST URL above, save data from request BODY, save them to file
called "data.json" and if data contains property "count" it increase
value of count key in redis database.

Example of JSON body, which you can send within POST command is:
```
{
 "something": "lorem ipsum",
 "count": 50,
 "something2": "ipsum lorem",
}
```
But you can post any JSON you want.


### 2) GET 
```
localhost:3000/count
```
This GET URL above, get data from REDIS db, it returns current value of
key "count". 

### 3) Clearing of count value (POST)
```
localhost:3000/clear/count
```
This POST URL above, set 0 value to key "count" in Redis DB. So key is cleared.

Moreover clearing of value "count" is executed automatically, when you terminate node server.



