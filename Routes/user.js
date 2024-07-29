const express = require('express');
const router = express.Router();
const { signup, login, loginadmin, signupadmin, createtrip, viewtrip, viewtripId, updatetripId, deletetripId, viewtripIdUser, addcomment } = require('../Controllers/Auth');
const { auth, isAdmin, isUser } = require('../Middleware/auth');

router.post("/signup", signup);
router.post("/login", login);
router.post("/signupadmin", signupadmin);
router.post("/loginadmin", loginadmin);
router.post("/createtrip", createtrip);
router.get("/viewtrip", viewtrip);
router.get("/viewtrip/:id", viewtripId);
router.get("/viewtripuser/:id", viewtripIdUser);
router.put("/updatetrip/:id", updatetripId);
router.delete("/deletetrip/:id", deletetripId);
router.post("/addcomment/:id", addcomment);

// Testing Route for Middleware
router.get("/test", auth, (req,res) => {
    res.json({
        success: true,
        message: "Test successful"
    })
})

// Protected Route for Admin 
router.get("/adminDashboard", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Admin"
    })
});

router.get("/user/dashboard", auth, isUser, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for User"
    })
});

module.exports = router;