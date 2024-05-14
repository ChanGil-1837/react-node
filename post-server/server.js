const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require("connect-mongo")(session)
const { upload,deleteImage } = require('./modules/imageUploader');
const { connectDB,ObjectId,getDB } = require('./modules/dbconnection');
const {Init, passport } = require("./modules/passport")
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")

const mongoose = require("mongoose")

mongoose.connect(process.env.DB_ACCESS)

dotenv.config()

app.use(cookieParser())
app.use(express.json())


app.use(cors({
	origin :"http://localhost:3000",
  credentials:true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD','DELETE'],
}));
connectDB().then(()=>{
  app.listen(8080, () => {
    console.log(process.env.REACT_SERVER + '')
  })
  Init(getDB(),ObjectId)
});

app.use(session({
  secret: process.env.SECRET_KEY,
  resave : false,
  saveUninitialized : false,
  cookie : {
    maxAge : 1000*60*60
  },
  store :new MongoStore({
          mongooseConnection:mongoose.connection,
          dbName : process.env.DB_NAME
  })
}))

app.use(passport.initialize())
app.use(passport.session()) 

app.get('/', async (요청, 응답) => {
  let data = {
    username : "",
  }
  if(요청.isAuthenticated()) {
    data.username = 요청.user.nickname
    data._id = 요청.user._id
  }
  응답.send(data)
}) 

app.get('/main', async (요청, 응답) => {
  
  let posts = await getDB().collection('post').aggregate([
    {
        $lookup: {
            from: 'user', // 참조할 컬렉션
            localField: 'userId', // 현재 컬렉션의 필드
            foreignField: '_id', // 참조할 컬렉션의 필드
            as: 'user' // 결과를 저장할 필드명
        }
    },
    {
        $unwind: '$user' // 배열을 풀어서 각 요소에 대해 작업할 수 있도록 함
    },
    {
        $project: {
            _id: 1,
            title: 1,
            content: 1,
            date: 1,
            fileUrl:1,
            userId: "$user._id",
            nickname: '$user.nickname', // 유저의 닉네임을 가져옴
            filekey :1
        }
    },
    {
      $sort: { _id: -1 } // 날짜 필드를 기준으로 내림차순으로 정렬
    }
  ]).toArray();

  let data = {
    result :posts,
  }
  응답.send(data)
}) 

app.get('/myposts/:id', async (req, res) => {
  var o_id = new ObjectId(req.params.id) // Express.js 라우트 핸들러에서 사용자 아이디 가져오기
  let posts = await getDB().collection("post").aggregate([
      { $match: { userId: o_id } }
  ]).toArray();
  let data = {
    result : posts
  }
  res.send(data)

}) 


app.post('/login', async (요청, 응답, next) => {

  passport.authenticate('local', (error, user, info) => {
    if (error) return 응답.status(500).json(error)
    if (!user) return 응답.status(401).json(info.message)
    요청.logIn(user, (err) => {
      if (err) return next(err)
      return 응답.redirect('/')
    })
  })(요청, 응답, next)

}) 

app.post('/login/google', async (req, res, next) => {
  let email = jwt.decode(req.body.credentialResponse.credential).email
  req.body = {username: email, password:'0'}

  passport.authenticate('local2', (error, user, info) => {
    if (error) {
        return res.status(500).json(error)
    }
    if (!user) { 
      res.send({"email":email,"page":"register"})
      return res.status(200)
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.send({"page":"login","username":req.user.nickname})
      return res.status(200)
    })
  })(req, res, next)

}) 

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/register", async (req, res) => {
  
  if(req.body.nickname=="" || req.body.nickname== null) {
    res.status(403).send("Please enter a nickname.")
    return
  }
  if(req.body.password.length < 6) {
    res.status(403).send("The password length must exceed 6 characters.")
    return
  }

  let one = await getDB().collection('user').findOne({nickname:req.body.nickname})
  if(one == null) {
    let password = await bcrypt.hash(req.body.password, 10)
    await getDB().collection('user').insertOne({username: req.body.username, password : password, nickname:req.body.nickname})
    res.redirect("/")
  }else {
    res.status(409).send("This nickname is already taken.")
  }
})

app.post("/post", upload.single('file'), async (req, res) => {
  try {
    const fileUrl = req.file.location;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}`;

    await getDB().collection('post').insertOne({
      title: req.body.title,
      content: req.body.content,
      fileUrl: fileUrl,
      userId: req.user._id,
      date: formattedDate,
      filekey : req.file.key
    });
    
    res.status(200).send("File Upload Complete");
  } catch(error) {
    console.error(error);
    res.status(500).send("Error Uploading file");
  }
});

app.delete("/delete/:id",async(req,res) => {
  var o_id = new ObjectId(req.params.id)
  let result = await getDB().collection('post').findOne({_id: o_id})
  filekey = result.filekey
  deleteImage(filekey)
  getDB().collection('post').deleteOne({_id: o_id})
  // deleteImage(req.params.key)
  res.status(200).send("delete")
})
