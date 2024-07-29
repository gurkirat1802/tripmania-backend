const express =  require('express');
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const cors= require("cors");
app.use(express.json());
app.use(cors({
    // origin: 'https://tutorfinderfrontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods if necessary
    credentials: true // If you need to include cookies or authentication headers
}));
require("./Config/database").connect()

// route import and mount 
const user = require("./Routes/user");
app.use("/api/v1",user);

// Activate 
app.listen(PORT,() => {
    console.log("Server Run at ",PORT);
})

app.get("/", (req,res) => {
    res.send("<h1>Auth App</h1>")
})