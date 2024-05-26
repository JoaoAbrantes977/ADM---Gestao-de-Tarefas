const express = require('express');
const Todo = require('./../models/Todo');

const router = express.Router();

// Home page route
router.get('/', async (req, res) => {

    const todos = await Todo.find()
    res.send(todos);
});

// Rota para retornar documentos com base no id_user
router.get('/:id', async (req, res) => {
    try {
        const id_user = parseInt(req.params.id); // Obtém o id_user do parâmetro da URL
        const todos = await TodoModel.find({ id_user }); // Encontra todos os documentos com o id_user correspondente

        if (!todos || todos.length === 0) {
            return res.status(404).json({ message: 'Nenhum documento encontrado para este id_user.' });
        }

        res.status(200).json(todos); // Retorna os documentos encontrados
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao processar a solicitação.' });
    }
});

// Rota para criar um novo todo
router.post('/', async (req, res) => {
    const { title, description, startDate, finishedDate, task } = req.body;
    console.log('Dados recebidos:', { title, description, startDate, finishedDate, task });

    try {
        const newTodo = new Todo({
            title,
            description,
            startDate,
            finishedDate,
            task
        });

        await newTodo.save();
        res.status(201).send(newTodo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST - Destroy todo item
router.post('/todo/destroy', async (req, res) => {
    const taskKey = req.body._key;
    const err = await Todo.findOneAndRemove({_id: taskKey})
    res.redirect('/');
});


module.exports = router;