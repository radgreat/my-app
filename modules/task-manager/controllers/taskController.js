const Task = require('../models/task');

//show all tasks
exports.getAllTasks = async (req, res) => {
    //const tasks = await Task.find({ userid: req.session.userId }).sort({ createdAt: -1 });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ userid: req.session.userId }).skip(skip).limit(limit).sort({ createdAt: -1});
    const totalTasks = await Task.countDocuments({ userid: req.session.userId });
    const totalPages = Math.ceil(totalTasks / limit);

    let boolAdmin = false;
    
    if(req.session.role === "admin"){
        boolAdmin = true;
    }
    res.render('tasks/index', { tasks, 
        currentPage: page,
        totalPages: totalPages,
        boolAdmin
     });   
};

//show form to create new task
exports.newTaskForm = (req, res) => {
    let boolAdmin = false;

    if(req.session.role === "admin"){
        boolAdmin = true;
    }

    res.render('tasks/new', { boolAdmin });
};

//create new task
exports.createTask = async (req, res) => {
    const { title, details, dueDate } = req.body;

    try {
        const task = new Task({
            title: title,
            details: details,
            dueDate: dueDate,
            userid: req.session.userId
        });

        await task.save();

        res.redirect('/tasks/read');
    } catch (err) {
        console.error('Error saving new task: ', err);
        res.status(500).send('Error creating task');
    }
};

//show form to edit
exports.editTaskForm = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const currentPage = req.query.page;

        let boolAdmin = false;

        if(req.session.role === "admin"){
            boolAdmin = true;
        }
        res.render('tasks/edit', { task, currentPage, boolAdmin });
    } catch (err) {
        
    }
};


//update a task
exports.updateTask = async (req, res) => {
    const { title, details, dueDate, status } = req.body;
    const currentPage = req.query.page;

    try {
        await Task.findByIdAndUpdate(req.params.id, {
            title,
            details, 
            dueDate, 
            status
        });

        res.redirect(`/tasks/read?page=${currentPage}`);
    } catch (err) {
        res.status(500).send('Error updaing task.');
    }
};

//delete task
exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const currentPage = req.query.page;

        await Task.findByIdAndDelete(id);

        res.redirect(`/tasks/read?page=${currentPage}`);
    } catch (err) {
        res.status(500).send('Error deleting task.');
    }
};