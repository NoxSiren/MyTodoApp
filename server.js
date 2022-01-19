const express = require('express');
const connection = require('./config');

// NEVER use 3306, you can make your own
const PORT = process.env.PORT || 3001;

const app = express();

// turn on body-parser
// makes req.body exist
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// POST - create todo
// async await
// declaring a function as 'async' allows us to use 'await'
// syntax inside of 
app.post('/api/todos', async (req, res) =>{
    //{task: 'Sleep'}
    const {task} = req.body;
// if user does not provide a task, respond with error
    if(!task){
        return res.status(400).json ({error : 'You must provide a task'});
    }
// if there is a task, save it to database
// JS will try to run every line of code inside the task
// of "try" block
// if any lines thro an err JS will take the err and put err 
// into "catch" block and run in "catch" block
    try {
// many lines of code....
        const insertQuery = 'INSERT INTO todos(task) VALUES(?);';
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
        const [result] = await connection.query(insertQuery, [task]);
// Whenever we INSERT, UPDATE, or DELETE query in mysql2 or my sql npm pkg
// it doesnt use the data that was interacted with, it instead or updateID of reguarding data
// It also gives arra with 2 elements. 1st one is an objects where we have the info we need
// 2nd one is null or info about the fields of that row
    const [todosResult] = await connection.query(getTodoById, [result.insertId]);
        res.json(todosResult[0]);

    }catch(e) {
        res.status(400).json(e);

    }


});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
