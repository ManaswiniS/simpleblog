const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    if (req.body.type === 'PostCreated') {
        const { id, title } = req.body.data;
        posts[id] = { id, title, comments: []};
    } else if (req.body.type === 'CommentCreated') {
        const { id, content, postId } = req.body.data;
        const post = posts[postId];
        post.comments.push({ id, content });
    }
    console.log(posts);
    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});