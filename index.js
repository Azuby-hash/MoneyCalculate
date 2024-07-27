import express from "express"

const app = express()

app.use(express.static("web"))

app.get("/", async (req, res) => {
    res.send("This is server")
})

app.listen(3000, async () => {
    console.log("Listen at port http://localhost:3000/");
})