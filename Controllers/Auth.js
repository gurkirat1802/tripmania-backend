const bcrypt = require('bcrypt');
const User = require("../Models/User");
const Trip = require("../Models/Trip");
const jwt = require("jsonwebtoken");
const Admin = require('../Models/Admin');

require("dotenv").config();
exports.signup = async (req, res) => {
    try {
        // get data
        const { firstName, lastName, email, password, role } = req.body;
        //    console.log("sdf")
        // check if user already exist 
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }
        // Secured password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        // Create Entry for User
        let user = await User.create({
            firstName, lastName, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            })
        }

        // check for register user 
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };


        if (await bcrypt.compare(password, user.password)) {
            // password match

            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            console.log('JWT_SECRET:', process.env.JWT_SECRET);
            console.log(user);
            user = user.toObject();
            user.token = token;
            console.log(user);
            user.password = undefined;
            console.log(user);

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Login false"
        })
    }
}
exports.signupadmin = async (req, res) => {
    try {
        // get data
        const { firstName, lastName, email, password, role } = req.body;
        //    console.log("sdf")
        // check if user already exist 
        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }
        // Secured password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        // Create Entry for User
        let user = await Admin.create({
            firstName, lastName, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}
exports.loginadmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            })
        }

        // check for register user 
        let user = await Admin.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };


        if (await bcrypt.compare(password, user.password)) {
            // password match

            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            console.log('JWT_SECRET:', process.env.JWT_SECRET);
            console.log(user);
            user = user.toObject();
            user.token = token;
            console.log(user);
            user.password = undefined;
            console.log(user);

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Login false"
        })
    }
}

exports.createtrip = async (req, res) => {
    try {
        const { title, desc, hashtag1, hashtag2 } = req.body;
        const trip = await Trip.create({
            title, desc, hashtag1, hashtag2
        });
        return res.status(200).json({
            success: true,
            message: "Trip Created Successfully",
            data: trip
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Trip cannot be created,Please try again later",
        })
    }
}

exports.viewtrip = async (req, res) => {
    try {
        const trips = await Trip.find();
        return res.status(200).json({
            success: true,
            message: "Trips fetched successfully",
            data: trips
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching trips, please try again later",
        });
    }
}

exports.viewtripId = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Trip fetched successfully",
            data: trip
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching trip, please try again later",
        });
    }
}
exports.viewtripIdUser = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Trip fetched successfully",
            data: trip
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching trip, please try again later",
        });
    }
}
exports.updatetripId = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc, hashtag1, hashtag2 } = req.body;
        const trip = await Trip.findByIdAndUpdate(id, { title, desc, hashtag1, hashtag2 }, { new: true });
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            data: trip
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error updating trip, please try again later",
        });
    }
}
exports.deletetripId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Trip.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({
                success: true,
                message: 'Trip deleted successfully',
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting trip, please try again later',
        });
    }
}

exports.addcomment = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }
        if (!trip.comments) {
            trip.comments = [];
        }
        trip.comments.push({ comment, rating });
        await trip.save();
        res.status(200).json({ success: true, data: trip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}