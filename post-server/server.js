const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require("connect-mongo")
const { upload } = require('./modules/imageUploader');
const { connectDB,ObjectId,getDB } = require('./modules/dbconnection'); 
const {Init, passport } = require("./modules/passport")
const dotenv = require("dotenv");
dotenv.config()

app.use(cookieParser())
app.use(express.json())


app.use(cors({
  origin :process.env.REACT_SERVER,
  credentials:true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));

connectDB().then(()=>{
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
  Init(getDB(),ObjectId)
});

app.use(bodyParser.json()); 

app.use(session({
  secret: process.env.SECRET_KEY,
  resave : false,
  saveUninitialized : false,
  cookie : {
    maxAge : 1000*60*60
  },
  store : MongoStore.create({
    mongoUrl : process.env.DB_ACCESS,
    dbName : process.env.DB_NAME
  })
}))

app.use(passport.initialize())
app.use(passport.session()) 

app.get('/', async (요청, 응답) => {
  let result = await getDB().collection('post').find().toArray();
  let data = {
    result :result,
    username : "",
  }
  if(요청.isAuthenticated()) {
    data.username = 요청.user.nickname
  }
  응답.send(data)

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
app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/register", async (req, res) => {
  let password = await bcrypt.hash(req.body.password, 10)
  await getDB().collection('user').insertOne({username: req.body.username, password : password, nickname:req.body.nickname})
  res.redirect("/")

})

app.post("/post", upload.single('file'), async (req, res) => {
  console.log(req.body)
  console.log(req.file);
});