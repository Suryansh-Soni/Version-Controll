const fs = require('fs');
const path = require('path');
const { s3, s3_BUCKET } = require('../config/aws-config');

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), '.myvcs');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        const commitDirs = await fs.promises.readdir(commitsPath);

        for (const commitDir of commitDirs) {
            const commitDirPath = path.join(commitsPath, commitDir);

            const files = await fs.promises.readdir(commitDirPath);

            for (const file of files) {
                const filePath = path.join(commitDirPath, file);

                const fileContent = await fs.promises.readFile(filePath);

                const params = {
                    Bucket: s3_BUCKET,
                    Key: `${commitDir}/${file}`,
                    Body: fileContent
                };

                await s3.upload(params).promise();

                console.log(
                    `File ${file} from commit ${commitDir} pushed to S3 successfully.`
                );
            }
        }

    } catch (err) {
        console.error("Error pushing changes to S3:", err);
    }
}

module.exports = {
    pushRepo
};