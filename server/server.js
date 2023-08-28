const express = require('express')
const app = express()

app.get("/ratings", (req, res) =>{
    res.json({"ratings": ["5", "4", "1"]});
});

app.listen(5000);