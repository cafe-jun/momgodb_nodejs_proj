const express = require("express")
const app = express()

const mongoose = require("mongoose")
const { userRouter, blogRouter } = require("./routes")
// const { generateFakeData } = require('./generateFaker');
const { generateFakeData } = require("./generateFaker2")

const server = async () => {
  //mongoose.set('debug', true);
  try {
    const { MONGO_URL, PORT } = process.env
    if (!MONGO_URL) throw new Error("MONGO_URL is required!! ")
    if (!PORT) throw new Error("PORT is required!! ")

    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    app.use(express.json())
    app.use("/user", userRouter)
    app.use("/blog", blogRouter)
    app.listen(PORT, async () => {
      console.log(`Listen Express Server ${PORT} Port`)
      // for (let i = 0; i < 20; i++) {
      //     await generateFakeData(10, 1, 10);
      // }
      //await generateFakeData(10, 2, 10)

      //   for (let i = 0; i < 10; i++) {
      //     await generateFakeData(10000, 5, 20)
      //   }
    })
  } catch (err) {
    console.error(err)
  }
}

server()
