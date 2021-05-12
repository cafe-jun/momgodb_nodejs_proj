const { Router } = require('express');
const commentRouter = Router({ mergeParams: true });
const { Blog, Comment, User } = require('../models');
const { isValidObjectId } = require('mongoose');

commentRouter.get('/', async (req, res) => {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status(400).send({ err: 'blog is invalid' });
    const comment = await Comment.find({ blog: blogId });
    return res.status(200).send({ comment });
});

commentRouter.post('/', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({ err: 'blog is invalid' });
        const { userId, content } = req.body;
        if (!isValidObjectId(userId)) res.status(400).send({ err: 'user is invalid' });
        if (typeof content !== 'string') res.status(400).send({ err: 'comment must be string' });

        // const user = await User.findById(userId);
        // const blog = await Blog.findById(blogId);
        // 응답시간 개선하기
        const [blog, user] = await Promise.all([Blog.findById(blogId), User.findById(userId)]);
        console.log(`${user}  : ${blog}`);

        if (!user || !blog) res.status(404).send({ err: 'blog or user is not exist' });
        if (!blog.islive) res.status(400).send({ err: 'blog is not available ' });
        const comment = new Comment({ blog, user, content });
        await comment.save();
        return res.status(200).send({ comment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = { commentRouter };
