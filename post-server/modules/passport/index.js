const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const google = require("./GoogleStrategy")

const Init = async (db, ObjectId) => {
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

    passport.use("local",new LocalStrategy({
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
    google(db)
}

module.exports = { Init, passport, };