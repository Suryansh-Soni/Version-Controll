const fs = require('fs');
const path = require('path');

async function add(filePath){
    const repoPath = path.resolve(process.cwd(), '.myvcs');
    const stagingPath = path.join(repoPath, 'staging');
    try{
        await fs.promises.mkdir(stagingPath, { recursive: true });
        const fileName=path.basename(filePath);
        await fs.promises.copyFile(filePath, path.join(stagingPath, fileName));
        console.log("File added to staging area: " + fileName);
    }catch (err) {
        console.error("Error adding file to staging area: ", err);
    }
}
module.exports = {
    addRepo: add
}   