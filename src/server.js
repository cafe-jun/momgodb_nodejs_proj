const express = require("express")
const app = express()

const mongoose = require("mongoose")
const { userRouter, blogRouter } = require("./routes")
const { generateFakeData } = require("./generateFaker")
//const { generateFakeData } = require("./generateFaker2")

const server = async () => {
  const MONGODB_URL =
    "mongodb+srv://jsshin:b3PL4Hz99AgAFvN@cluster0.i5taf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  //mongoose.set('debug', true);
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    app.use(express.json())
    app.use("/user", userRouter)
    app.use("/blog", blogRouter)
    app.listen(3000, async () => {
      console.log("Listen Express Server 3000 Port")
      //   for (let i = 0; i < 20; i++) {
      //       await generateFakeData(10, 1, 10);
      //   }
      //   for (let i = 0; i < 10; i++) {
      //     await generateFakeData(10000, 5, 20)
      //   }
    })
  } catch (err) {
    console.error(err)
  }
}

server()
