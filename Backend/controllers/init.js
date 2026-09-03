const fs = require('fs').promises;
const path = require('path');



async function initRepo(){
    const repoPath = path.resolve(process.cwd(), '.myvcs'); 
    const commitPath = path.join(repoPath, 'commits');
    try{
        await fs.mkdir(repoPath, { recursive: true }); //recursive: true allows creating nested directories
        await fs.mkdir(commitPath, { recursive: true });
        await fs.writeFile(path.join(repoPath, 'config.json'), JSON.stringify({bucket:process.env.S3_BUCKET})); // Initialize an empty index file
        console.log("Repository initialized successfully at: " + repoPath);
    }catch (err) {
        console.error("Error initializing repository: ", err);
    }  
}
module.exports = {
    initRepo
}