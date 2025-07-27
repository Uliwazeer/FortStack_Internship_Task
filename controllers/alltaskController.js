const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.alltask = async function (req, res) {
    try {
        const email = 'ali.wazeer2000@gmail.com'; // المستخدم المسجل فعلياً
        const user = await User.findOne({ email: email });

        if (!user) {
            console.warn(`⚠️ User not found: ${email}`);
            return res.status(404).send('User not found');
        }

        const data = await Dashboard.find({ userId: user._id }); // يفضل تربط المهام بالـ userId

        console.log(`✅ All tasks fetched for: ${user.name}`);
        return res.render('alltask', {
            title: 'All Tasks',
            name: user.name,
            dashboard: data
        });

    } catch (err) {
        console.error('❌ Error fetching all tasks:', err);
        return res.status(500).send('Internal Server Error');
    }
};


/*
// controllers/alltaskController.js

const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.alltask = function(req, res) {
    Dashboard.find({})
    .then(function(data) {
        User.findOne({ email: "ankitvis609@gmail.com" })
        .then(function(user) {
            if (!user) {
                console.log("⚠️ User not found: ankitvis609@gmail.com");
                return res.render('alltask', {
                    title: "Dashboard",
                    name: "Guest",
                    dashboard: data
                });
            }

            console.log(`✅ User found: ${user.name}`);
            return res.render('alltask', {
                title: "Dashboard",
                name: user.name,
                dashboard: data
            });
        })
        .catch(function(err) {
            console.error("❌ Error while finding user:", err);
            return res.status(500).send("Internal Server Error");
        });
    })
    .catch(function(err) {
        console.error("❌ Error while fetching dashboard:", err);
        return res.status(500).send("Internal Server Error");
    });
};
*/