import fs from "fs"
import express from "express"
import bodyParser from "body-parser"
import { spawnSync } from "child_process"

const app = express()

app.use(express.static("web"))
app.use(bodyParser.json())

app.get("/", async (req, res) => {
    res.sendFile("web.html", { root: "web" })
})

app.post("/8af78f8f-6cc2-43e2-ac53-573b3c4cb247", async (req, res) => {
    console.log(req.body);
    fs.writeFileSync("index.json", JSON.stringify(req.body, null, 4))
    spawnSync("bash", ["update.sh"])
    res.send("Update success")
})

app.listen(3000, async () => {
    console.log("Listen at port http://localhost:3000/");
})