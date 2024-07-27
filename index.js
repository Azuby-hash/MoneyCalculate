import express from "express"
import { spawnSync } from "child_process"

const app = express()

app.use(express.static("web"))

app.get("/", async (req, res) => {
    res.send("This is server")
})

app.get("/8af78f8f-6cc2-43e2-ac53-573b3c4cb247", async (req, res) => {
    spawnSync("bash", ["update.sh"])
    res.send("Update success")
})

app.listen(3000, async () => {
    console.log("Listen at port http://localhost:3000/");
})