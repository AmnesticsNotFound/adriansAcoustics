const express = require('express');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require("path");

const app = express(),
            bodyParser = require("body-parser");
dotenv.config();
process.env.TZ;
const MONGOURL = process.env.MONGO_URL;

const Bird = require("./models/bird");
const User = require("./models/user");
const Session = require("./models/session");
const Album = require("./models/album");
const Comment = require("./models/comment");
const birdComment = Comment.birdComment;
const albumComment = Comment.albumComment;

var store = new MongoDBStore({
  uri: MONGOURL,
  collection: 'sessions'
});

app.use(bodyParser.json());
app.use(express.static(
    path.join(__dirname,"./dist")));
    
app.use(session({
    secret: 'some secret',
    cookie: {maxAge: 1000*60*60*24},
    store:store,
    resave:false,
    saveUninitialized: false  
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.listen(8080, () => {
    console.log('server listening on port 8080')
    
})


//console.log(birdComment)

mongoose.connect(MONGOURL).then(()=> {
    console.log("DB connected");
})

app.post("/submitComment", async(req,res)=> {
    console.log(req.body);
    let newComment;
    if (req.body.album == "false") {
            newComment = new birdComment({
            name:req.body.user.name,
            email:req.body.user.email,
            text:req.body.comment,
            picture:req.body.user.picture,
            entryID:req.body.entryID
        })
    }
    else {
            newComment = new albumComment({
            name:req.body.user.name,
            email:req.body.user.email,
            text:req.body.comment,
            picture:req.body.user.picture,
            entryID:req.body.entryID
        })
    }
        try {
            await newComment.save()
            
            res.json("Saved");
            
        } catch(error) {
            console.log(error)
            res.json(error)
        }
    })

app.post("/getComments", async(req,res) => {
    let comments;
    console.log(req.body.entryID)
    if (req.body.album == "false") {
        comments = await birdComment.find({ entryID: req.body.entryID }).exec();
        //console.log("birds")
    }
    else {
        comments = await albumComment.find({ entryID: req.body.entryID }).exec();
        //console.log("albums")
    }
    //console.log(comments);
    res.json(comments)

})

app.post("/robotCheck", async(req,res)=> {
    //console.log(req.body.token);
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?&secret=${'6LdcHcYpAAAAAOcI8_a61eBQ4hxNmN2U8MMMaC1b'}&response=${req.body.token}`)
    if(response.data.success == true) {
        //req.session.authenticated = true;
        req.session.sessionID = req.sessionID;

        //console.log(req.session);

        res.json(req.session);

    }
    else {
        req.session.sessionID = "test failed";
        res.json(req.session);
    }
    
    
})

app.post("/validateID", async(req,res) => {
    console.log(req.body.sessionID)
    if (await Session.findOne({ _id: req.body.sessionID }).exec() == null) {
        res.send("Invalid");
    }
    else {
        res.send("Valid");
    }
    
})

app.post("/pullAllData", async(req,res)=> {
    //console.log(req.body.entryID)
    const response = await Bird.find().exec();
    const response2 = await Album.find().exec();
    if (response) {
       //console.log("Data found: " + response + response2);
        res.json([response, response2])

    }
    else {
       console.log("Nothing found") 
    }
        
    }
)

app.post("/pullData", async(req,res)=> {
    //console.log(req.body.entryID);
    let response;
    if (req.body.album == "true") {
         response = await Album.findOne({ _id: req.body.entryID }).exec();
    }
    else {
         response = await Bird.findOne({ _id: req.body.entryID }).exec();
          
    }
    
    if (response) {
        //console.log("Data found: " + response);
        res.json(response)

    }
    else {
       console.log("Requested Entry Not found") 
    }
        
    }
)


/*
if(await User.findById(req.body.sessionID).exec()) {
        console.log("Client Session ID found. Verification complete.");
    }
    else {
        console.log("Client Session ID could not be verified")
    }
    
    */
app.get("/test", async(req,res)=> {
    //console.log(req.body.token);
    //const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?&secret=${'6LdcHcYpAAAAAOcI8_a61eBQ4hxNmN2U8MMMaC1b'}&response=${req.body.token}`)
    
    //console.log(response.data);
    

    res.json({message:"cool"});
})

/*app.get('/', (req, res) => {
    console.log("hi")
      res.send('Hello from our server!')
})*/


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

  app.get(`/entry/bird/:id`, (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

  app.get(`/entry/album/:id`, (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });
app.get('/users', async(req,res) => {
    const userData = await User.find();
    res.json(userData);
})
