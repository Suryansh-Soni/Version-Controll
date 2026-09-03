
const fs = require('fs');
const path = require('path');
const {v4:uuidv4} = require('uuid');

async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(), '.myvcs');
    const commitPath = path.join(repoPath, 'commits');
    const stagingPath = path.join(repoPath, 'staging');  
    try{
        const commitID = uuidv4(); // Generate a unique commit ID
        const commitDir = path.join(commitPath, commitID);
        await fs.promises.mkdir(commitDir, { recursive: true });
        const files=await fs.promises.readdir(stagingPath);
        for(const file of files){
            await fs.promises.copyFile(path.join(stagingPath, file), path.join(commitDir, file));
        }
        await fs.promises.writeFile(path.join(commitDir, 'commit.json'), JSON.stringify({ message, timestamp: new Date() }));
        console.log(`Changes committed successfully with ID: ${commitID}`);
    } catch (err) {
        console.error("Error committing changes: ", err);
    }
}
module.exports = {
    commitRepo
}