const userModel = require("../models/userModel");

const loginController = async (req, res) => {
    
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"

            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }}

const registerController =  (req, res) => {
    const newUser = new userModel(req.body);
    newUser.save()
        .then(() => {
            res.status(201).json({
                success: true,
                message: "User created successfully",
                newUser
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
}

module.exports = {loginController, registerController};
