const express = require("express");
const router = express.Router();
const playlist = require("../model/Schema");
const bcrypt = require("bcryptjs");
const mac= require("../model/messageModel");
router.get("/product", (req, res) => {
    res.send("hello world");
})

router.post("/register", async (req, res) => {
    const { name, email, pass, cpass, url } = req.body;
    try {
        const ans = await playlist.findOne({ email });
        if (ans) {
            return res.status(402).send({ msg: "Invalid user credentials" });

        }
        else {
            if (pass === cpass) {
                const result = new playlist({ name: name, email: email, password: pass, url: url });

                //phele
                await result.save();
                return res.status(201).send({ msg: "User registration is done" });
            }
            else {
                res.status(402).send({ msg: "Invalid user credentials" });
            }

        }


    } catch (err) {
        console.log(err);
    }

})

router.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await playlist.findOne({ email });

        if (user) {
            if (bcrypt.compare(pass, user.password)) {

                return res.status(201).send(user);
            }
            else {
                return res.status(402).send({ msg: "Invalid user credentials" });
            }
        }
        else {
            return res.status(402).send({ msg: "Invalid user credentials" });
        }


    } catch (err) {
        console.log(err);
    }

})
router.post("/addmsg", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const msg = new mac({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        await msg.save();

        return res.status(201).send({ msg: "Message added successfully." })
    } catch (err) {
        console.log(err);
    }
});
router.post("/getmsg", async (req, res) => {
    try {
        const { from, to } = req.body;

        const messages = await mac.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });
 
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.send(projectedMessages);
    } catch (err) {
        console.log(err);
    }

})
router.get("/allusers/:id", async (req, res) => {
    try {
        // const { id } = req.params.id;
        // // const s = id.substr(1, id.length-1);

        const result = await playlist.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "name",
            "url",
            "_id"
        ]);
        return res.status(201).send(result);
    }
    catch (err) {
        console.log(err);
    }
})
module.exports = router;