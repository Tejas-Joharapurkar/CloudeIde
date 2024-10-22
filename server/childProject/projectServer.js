import express from "express"

const childserver = express();
childserver.use(express.json());

childserver.get('/childProcess', (req, res) => {
    console.log("hi from second server");
    res.json({ msg: "flsjfjsfl" })
})

childserver.listen(8001, () => {
    console.log("server running on port 8001");
})