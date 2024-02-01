const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(6).toString('hex');
    const { title } = req.body;

    // return 400 if no title
    if (!title) {
        return res.status(400).send('Title is required');
    }

    posts[id] = {
        id, title
    };

    // send event to event bus
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
});



app.listen(4000, () => {
    console.log('Listening on 4000');
});