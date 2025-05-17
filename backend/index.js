require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require('./Models/user_model');
const Notes = require('./Models/notes');

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const jwt = require("jsonwebtoken");
const { authenticateToken } = require('./utilities');

app.use(express.json());

app.use(
    cors({
        original: "*"
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" })
});

// Create Account
app.post('/create-account', async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const user = new User({
        fullName,
        email,
        password
    });

    await user.save();

    // token

    const accessToken = jwt.sign({ user: user }, process.env.ACESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });

});

//Login
app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "email is required" });
    }

    const userInfo = await User.findOne({ email: email });


    if (!userInfo) {
        return res.status(400).json({ error: true, message: "user not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        // const user = { user: userInfo };
        const accessToken = jwt.sign({ ...userInfo._doc }, process.env.ACESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });


        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken
        })
    } else {
        return res.json({
            error: false,
            message: "Invalid Credentials"
        })
    }
})

//Get user data
app.get("/get-user", authenticateToken, async (req, res) => {

    const userId=req.user._id;

    try{
        const user=await User.findOne({_id:userId})

        if(user){
            res.status(200).json({
                error:false,
                user:{fullName:user.fullName,email:user.email},
            });
        }

    }catch(error){
        console.log(error);
        res.status(401).json({
                error:true,
                message:"Internal server error"
        });
    }
})

// add notes
app.post('/addnotes', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.user._id; // Accessing the user ID properly

    if (!title || !content || !tags) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const note = new Notes({
            title,
            content,
            tags: tags || [],
            userId: userId, // Now passing the correct userId
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });

    } catch (error) {
        console.error("Error in /addnotes:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

//Edit
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {

    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const userId = req.user._id;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });

    }

    try {

        const note = await Notes.findOne({ _id: noteId, userId: userId });

        console.log(note)

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.status(200).json({ error: false, note, message: "Data is Updated" });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: true, message: "Internal error" });
    }


})

//get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {

    const userId = req.user._id;

    try {
        const note = await Notes.find({ userId: userId })

        return res.status(200).json({
            error: false,
            note,
            message: "All notes retrived successfully"
        })

    } catch (error) {
        return res.status(400).json({
            error: true,
            message: "Internal server error"
        })
    }
})

// delete notes
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {

    const userId = req.user._id;
    const noteId = req.params.noteId;

    try {
        const note = await Notes.findOneAndDelete({ _id: noteId, userId: userId });

        return res.status(200).json({
            error: false,
            note,
            message: "Note Deleted successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            error: true,
            message: "Internal server error"
        });
    }

});

// update isPinned value
app.put("/edit-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const userId = req.user._id;

    try {

        const note = await Notes.findOne({ _id: noteId, userId: userId });

        console.log(note)

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (isPinned) note.isPinned = isPinned || false;

        await note.save();

        return res.status(200).json({ error: false, note, message: "Pin is Updated" });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: true, message: "Internal error" });
    }


})

app.get("/search-notes/",authenticateToken,async(req,res)=>{

    const userId=req.user._id;
    const {query}=req.query;

    if(!query){
        return res.status(400).json({
            error:true,
            message:"Search query is required"
        })
    }
    try{

        const matchNotes=await Notes.find({
            userId:userId,
            $or:[
                {title:{$regex:new RegExp(query,"i")}},
                {content:{$regex:new RegExp(query,"i")}},
            ],
        });

        return res.json({
            error:false,
            notes:matchNotes,
            message:"Notes matching the search query retrived successfully",
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Unexpected error occured"
        })
    }
})


app.listen(port);

module.exports = app