const {MongoClient, ObjectId} = require("mongodb");
const dotenv = require("dotenv");
dotenv.config()
let db;

const connectDB = async () => {
  try {
    const url = process.env.DB_ACCESS;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('DB연결성공');
    db = client.db(process.env.DB_NAME);
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
