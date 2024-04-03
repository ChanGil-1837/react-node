const LocalStrategy = require('passport-local');
const { getDB } = require('../dbconnection');
const passport = require('passport');

// 전략 코드
module.exports = (db) => {
    passport.use('local2', new LocalStrategy({
        usernameField: 'username',  // 사용자 이름 필드를 'username'으로 설정
        },
        
        async (username, password, done) => {
        try {
            let result = await db.collection('user').findOne({ username });
            
            if (!result) {                
                return done(null, false, { message: '아이디 DB에 없음' });
            } else {
                return done(null, result);
            }
        } catch (err) {
            return done(err);
        }
        }
    ));
};