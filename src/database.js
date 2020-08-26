const redis = require("redis");

const client = redis.createClient({
    port      : 10547,               // replace with your port
    host      : 'redis-10547.c80.us-east-1-2.ec2.cloud.redislabs.com',        // replace with your hostanme or IP address
    password : 'P7XOZmP8pNU79AtJPWrHxTqzB2gsR1wi'
});