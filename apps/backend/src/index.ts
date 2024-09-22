import express from 'express';


const app = express();


app.get("/", (_, res) =>  {
    return res.json({message: "hello world"})
});


app.listen(3000)