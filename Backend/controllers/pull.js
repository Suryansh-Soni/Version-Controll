const fs=require('fs');
const path=require('path');
const {s3,s3_BUCKET}=require('../config/aws-config');


async function pullRepo(){
    const repoPath=path.resolve(process.cwd(),'.myvcs');
    const commitsPath=path.join(repoPath,'commits');
    try{
        const data=await s3.listObjectsV2({Bucket:s3_BUCKET,Prefix:"commits/"}).promise();
        const Objects=data.Contents;
        for(const obj of Objects){
            const key=obj.Key;
            const commitDir=path.join(commitsPath,path.dirname(key).split('/').pop());
        await fs.mkdir(commitDir,{recursive:true});
        const params={
            Bucket:s3_BUCKET,
            Key:key
        };
        const fileContent=await s3.getObject(params).promise();
        await fs.promises.writeFile(path.join(commitDir,path.basename(key)),fileContent.Body);
        console.log(`File ${path.basename(key)} from commit ${path.dirname(key).split('/').pop()} pulled from S3 successfully.`);
        }
    } catch (err) {
        console.error("Error reading commits directory:", err);
    }
}
module.exports = {
    pullRepo
}