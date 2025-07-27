const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.completedtask = async function (req, res) {
    try {
        const email = 'ali.wazeer2000@gmail.com'; // المستخدم المسجل فعلياً
        const user = await User.findOne({ email: email });

        if (!user) {
            console.warn(`⚠️ User not found: ${email}`);
            return res.status(404).send('User not found');
        }

        const data = await Dashboard.find({ userId: user._id, completed: true });

        console.log(`✅ Completed tasks fetched for: ${user.name}`);
        return res.render('completedtask', {
            title: 'Completed Tasks',
            name: user.name,
            dashboard: data
        });

    } catch (err) {
        console.error('❌ Error fetching completed tasks:', err);
        return res.status(500).send('Internal Server Error');
    }
};


/*
const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.completedtask = async function(req, res) {
    try {
        const data = await Dashboard.find({});
        const user = await User.findOne({ email: "ankitvis609@gmail.com" });

        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        console.log(`********** user: ${user.name}`);
        return res.render('completedtask', {
            title: "Dashboard",
            name: user.name,
            dashboard: data
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
};
*/