const AWS = require("aws-sdk");
require("dotenv").config();

const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

module.exports = async (filename, body) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: filename,
    Body: body,
    ACL: "public-read",
  };
  try {
    const response = await s3bucket.upload(params).promise();
    console.log("SUCCESS:\n", response);
    return Promise.resolve(response.Location);
  } catch (err) {
    return Promise.reject(err);
    console.log(err);
  }
};
