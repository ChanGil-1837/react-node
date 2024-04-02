const {MongoClient, ObjectId} = require("mongodb");
let db;

const connectDB = async () => {
  try {
    const url = 'mongodb+srv://dbsenr0:EbJ0HJsgJcxVYcmE@post-db.ji4ajgj.mongodb.net/?retryWrites=true&w=majority&appName=post-db';
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('DB연결성공');
    db = client.db('post-db');
    return db;
  } catch (error) {
    console.error('DB 연결 중 오류 발생:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('데이터베이스에 연결되어 있지 않습니다.');
  }
  
  return db;
  
};


module.exports = { connectDB, getDB, ObjectId };
