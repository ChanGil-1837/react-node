const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid4');
const dotenv = require("dotenv");
dotenv.config()

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AWS_KEY_ID,//accessKeyId의 경우는 공개되지 않도록 환경변수로 설정
  secretAccessKey: process.env.AWS_ACCESS_KEY,//secretAccessKey도 공개되지 않도록 환경변수 설정
});

const s3 = new AWS.S3();

// AWS S3 업로드 설정
const storage = multerS3({
  s3, // AWS S3 연결
  acl: 'public-read', // S3 Bucket의 객체에 대한 읽기 권한
  bucket: process.env.AWS_NAME, // S3 Bucket의 이름
  contentType: multerS3.AUTO_CONTENT_TYPE, // 파일 MIME 타입 자동 지정
  key: (req, file, cb) => {
    // 파일 이름 생성 및 반환
    cb(null, Date.now().toString() + uuid() + file.originalname);
  },
});

// 파일 업로드 객체 생성
const upload = multer({
  storage,
});

// S3에서 이미지 삭제
const deleteImage = (fileKey) => {
  s3.deleteObject(
    {
      Bucket: process.env.AWS_NAME, // S3 Bucket의 이름
      Key: fileKey, // 삭제할 파일의 키 (경로 및 파일 이름)
    },
    (err, data) => {
      if (err) {
        throw err; // 삭제 실패 시 에러 발생
      } else {
        console.log('Image Deleted'); // 삭제 성공 시 로그 출력
      }
    }
  );
};

module.exports = { upload, deleteImage };