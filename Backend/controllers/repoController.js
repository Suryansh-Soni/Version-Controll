const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

async function createRepository(req, res) {
    const {
        owner,
        name,
        description,
        content,
        issues = [],
        visibility
    } = req.body;

    try {
        if (!owner || !name) {
            return res.status(400).json({
                message: "Owner and name are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({
                message: "Invalid owner ID"
            });
        }

        const newRepository = new Repository({
            owner,
            name,
            description,
            content,
            issues,
            visibility
        });

        const result = await newRepository.save();

        return res.status(201).json({
            message: "Repository created successfully",
            repository: result
        });

    } catch (err) {
        console.error("Error creating repository:", err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function getAllRepositories(req, res) {
    try {
        const repositories = await Repository.find({});
        return res.status(200).json(repositories);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
}

async function fetchRepositoryById(req, res) {
    try {
        const repository = await Repository.findById(req.params.id)
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        return res.status(200).json(repository);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
}

async function fetchRepositoryByName(req, res) {
    try {
        const repository = await Repository.findOne({
            name: req.params.name
        });

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        return res.status(200).json(repository);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
}

async function fetchRepositoryForCurrentUser(req, res) {
    const { userID } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const repositories = await Repository.find({
            owner: userID
        });

        return res.status(200).json(repositories);

    } catch (err) {
        console.error("Error fetching user repositories:", err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function updateRepositoryById(req, res) {
    const {id}=req.params;
    const {  description, content } = req.body;    
    try{
        const repository=await Repository.findById(req.params.id);
        if(!repository){
            return res.status(404).json({
                message:"Repository not found"
            });
        }
        repository.content.push(content);
        repository.description=description;
        const updatedRepository=await repository.save();     
        res.json({message:"Repository updated successfully", repository:updatedRepository});
        return res.status(200).json(repository);
    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
    }
}

async function deleteRepositoryById(req, res) {
    const {id}=req.params;
    try{
        const repository =await Repository.findOneAndDelete({_id:id});
        if(!repository){
            return res.status(404).json({
                message:"Repository not found"
            });
        }
        return res.status(200).json({message:"Repository deleted successfully"}); 
    }catch(err){
        console.error(err);
        return res.status(500).send({message:"Error in deleting repository."});
    }
}

async function toggleVisibilityById(req, res) {
     const {id}=req.params;
    const {  description, content } = req.body;    
    try{
        const repository=await Repository.findById(req.params.id);
        if(!repository){
            return res.status(404).json({
                message:"Repository not found"
            });
        }
        repository.visibility=!repository.visibility;
        const updatedRepository=await repository.save();     
        res.json({message:"Repository visibility toggled successfully", repository:updatedRepository});
        return res.status(200).json(repository);
    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
    }
}

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    deleteRepositoryById,
    toggleVisibilityById
};