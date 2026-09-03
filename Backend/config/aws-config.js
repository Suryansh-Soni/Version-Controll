const AWS=require('aws-sdk');
AWS.config.update({"region":"ap-south-1"});
const s3=new AWS.S3();
const s3_BUCKET="samplebucket050205";
module.exports={
    s3,
    s3_BUCKET
}