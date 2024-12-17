const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => { 
    const { fullName, email, password } = req.body;
    const isExisting = await User.IsThisEmailInUse(email)
    if (isExisting) {
        return res.json({
            success: "Failed",
            Message: "Email already exists, Try Signing In!"
        })
    }
    const user = await User({fullName, email, password});
    await user.save();
    return res.json(user);
}

exports.signInUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ success: "Failure", message: "User not found!"});
    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.json({ success: "Failure", message: "Could not verify credentials!"});

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d'});

    

    res.json({ success: "True", token, user });
}