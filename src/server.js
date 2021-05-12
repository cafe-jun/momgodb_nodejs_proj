const express = require('express');
const app = express();

const mongoose = require('mongoose');
const { userRouter, blogRouter } = require('./routes');
const { generateFakeData } = require('./generateFaker');
const server = async () => {
    const MONGODB_URL = 'mongodb+srv://jsshin:b3PL4Hz99AgAFvN@cluster0.i5taf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    mongoose.set('debug', true);
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        //generateFakeData(100, 10, 30);
        app.use(express.json());
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);
        app.listen(3000, () => {
            console.log('Listen Express Server 3000 Port');
        });
    } catch (err) {
        console.error(err);
    }
};

server();
