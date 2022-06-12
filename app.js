const dotenv = require("dotenv");
const express=require("express");
const app=express();
const socket=require("socket.io");
const router=require("./routers/router");
const cors=require("cors");
const path=require('path');


require("./db/conn");

dotenv.config({ path: './config.env' });
app.use(express.json());
app.use("/api/v1",router);

const port=process.env.PORT;
console.log(port);
const server=app.listen(port,()=>{
    console.log(`connection is done successfully on port ${port}`);
})


const __dirname1=path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}
const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credential:true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});