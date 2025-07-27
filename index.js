const express = require('express');
const port = 4000;
const path = require('path');

// require the mongoose file
const db = require('./config/mongoose');
const User = require('./models/register');
const Login = require('./models/login');
const Dashboard = require('./models/dashboard');

const app = express();

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded());
app.use(express.static('assets'));

// use routes file
const routes = require('./routes');
app.use('/', routes);

// ✅ تعديل تسجيل مستخدم (كان فيه خطأ في اسم الموديل Register)
app.post('/register', (req, res) => {
    User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
    })
    .then(user => {
        console.log("✅ User created:", user);
        res.redirect('/dashboard');
    })
    .catch(err => {
        console.log("❌ Error creating user:", err);
        res.status(500).send("Error creating user");
    });
});

// ✅ تعديل /addtask: ربط المهام بالمستخدم ali.wazeer2000@gmail.com
app.post('/addtask', async function(req, res) {
    try {
        const user = await User.findOne({ email: "ali.wazeer2000@gmail.com" });
        if (!user) {
            console.warn("⚠️ User not found for task creation");
            return res.status(404).send("User not found");
        }

        const newTask = await Dashboard.create({
            task: req.body.task,
            date: req.body.date,
            description: req.body.description,
            time: req.body.time,
            categoryChoosed: req.body.categoryChoosed,
            userId: user._id  // 👈 أهم تعديل
        });

        console.log("✅ Task created:", newTask);
        return res.redirect('back');
    } catch (err) {
        console.log("❌ Error creating task:", err);
        return res.redirect('back');
    }
});

// ✅ Completion handler
app.get('/complete-task', function(req, res) {
    const id = req.query.id;
    Dashboard.findByIdAndUpdate(id, { completed: true })
        .then(task => {
            console.log("✅ Task marked as completed:", task);
            res.redirect('back');
        })
        .catch(err => {
            console.log("❌ Error marking task as completed:", err);
            res.redirect('back');
        });
});

// ✅ Delete task handler
app.get('/delete-task', function(req, res) {
    const id = req.query.id;
    Dashboard.findByIdAndDelete(id)
        .then(task => {
            console.log("✅ Task deleted:", task);
            res.redirect('back');
        })
        .catch(err => {
            console.log("❌ Error deleting task:", err);
            res.redirect('back');
        });
});

// Start server
app.listen(port, err => {
    if (err) {
        console.log(`❌ Error starting server: ${err}`);
    } else {
        console.log(`✅ Server is running on port ${port}`);
    }
});
