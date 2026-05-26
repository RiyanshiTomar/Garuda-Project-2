const express = require("express")
const { main } = require("./config/db")
const app = express()
const cookieParser = require("cookie-parser")
const { User } = require("./models/user.model")
app.use(cookieParser())


async function start() {

    await main();
    console.log("Connected to MongoDB")

    app.get("/set", (req, res) => {
        res.cookie("username", "udhay");
        res.send("Cookie has been set")
    })



    app.get("/get", (req, res) => {
        console.log(req.cookies)
        res.send(req.cookies);
    })

    app.listen(7000, () => {
        console.log("Server is running on port 7000")
    })

}




start();
