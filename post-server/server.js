const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const cookieParser = require('cookie-parser')
const bcrypt = require("bcrypt")
const MongoStore = require("connect-mongo")

app.use(cookieParser());
app.use(express.json())
app.use(cors({
  origin :"http://localhost:3000",
  credentials:true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));


app.use(bodyParser.json()); 

app.use(session({
  secret: 'EbJ0HJsgJcxVYcmE',
  resave : false,
  saveUninitialized : false,
  cookie : {
    maxAge : 1000*60
  },
  store : MongoStore.create({
    mongoUrl : 'mongodb+srv://dbsenr0:EbJ0HJsgJcxVYcmE@post-db.ji4ajgj.mongodb.net/?retryWrites=true&w=majority&appName=post-db',
    dbName : "post-db"
  })
}))
app.use(passport.initialize())
app.use(passport.session()) 


const {MongoClient, ObjectId} = require("mongodb");



passport.use(new LocalStrategy({
  usernameField: 'username',  // 사용자 이름 필드를 'username'으로 설정
  passwordField: 'password'   // 비밀번호 필드를 'password'로 설정
},

async (username, password, done) => {
  try {
    let result = await db.collection('user').findOne({ username });
    
    if (!result) {
      return done(null, false, { message: '아이디 DB에 없음' });
    }
    
    if (await bcrypt.compare(password,result.password)) {
      return done(null, result);
    } else {
      return done(null, false, { message: '비번 불일치' });
    }
  } catch (err) {
    return done(err);
  }
}
));

passport.serializeUser((user,done) => {
  process.nextTick( () => {
    done(null,{id : user._id , username : user.username, nickname : user.nickname})
  })
})

passport.deserializeUser(async (user, done) => {
  let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
  delete result.password
  process.nextTick(() => {
    return done(null, result)
  })
})


let db
const url = 'mongodb+srv://dbsenr0:EbJ0HJsgJcxVYcmE@post-db.ji4ajgj.mongodb.net/?retryWrites=true&w=majority&appName=post-db'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('post-db')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})




app.get('/', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray();
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
  await db.collection('user').insertOne({username: req.body.username, password : password, nickname:req.body.nickname})
  res.redirect("/")

})