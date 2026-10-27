const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
var ObjectId = require('mongodb').ObjectId;
dotenv.config();

const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log("MongoDB connected");
    }
}

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        await connectClient();

        const db = client.db("virsonControl");
        const usersCollection = db.collection("users");

        // Check if username already exists
        const user = await usersCollection.findOne({ username });

        if (user) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: []
        };

        // Insert user into MongoDB
        const result = await usersCollection.insertOne(newUser);

        // Create JWT
        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({token,userId:result.inserId});

    } catch (err) {
        console.error(err);

        return res.status(500).send(err.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await connectClient();

        const db = client.db("virsonControl");
        const usersCollection = db.collection("users");

        // Find user by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        } 

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({token,userId:user._id});

    } catch (err) {
        console.error(err);

        return res.status(500).send(err.message);
    }
};

const getAllUser = async (req, res) => {
    try{
        await connectClient();

        const db = client.db("virsonControl");
        const usersCollection = db.collection("users");
        const users = await usersCollection.find({}).toArray();
        return res.status(200).json(users);
    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
    }
};

const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        await connectClient();

        const db = client.db("virsonControl");
        const usersCollection = db.collection("users");

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await usersCollection.findOne({
            _id: new ObjectId(userId)
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { password, ...userWithoutPassword } = user;

        return res.status(200).json(userWithoutPassword);

    } catch (err) {
        console.error("Error fetching user profile:", err);

        return res.status(500).json({
            message: err.message
        });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    try {
        let updatedFields={email};
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedFields.password=hashedPassword;
        }
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedFields },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(result.value);        
    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
       }
    

};

const deleteUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        await connectClient();
        const db = client.db("virsonControl");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User profile deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getAllUser,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};