const { Router } = require('express');
const blogRouter = Router();
const { Blog, User } = require('../models');
const { isValidObjectId } = require('mongoose');
const { commentRouter } = require('./commentRouter');

blogRouter.use('/:blogId/comment', commentRouter);

blogRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).limit(200);
        //.populate([{ path: 'user' }, { path: 'comments', populate: { path: 'user' } }]);
        return res.status(200).send({ blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.post('/', async (req, res) => {
    try {
        const { title, content, islive, userId } = req.body;
        if (typeof title !== 'string') return res.status(400).send({ err: 'title must be string' });
        if (typeof content !== 'string') return res.status(400).send({ err: 'content must be string' });
        if (islive && typeof islive !== 'boolean') return res.status(400).send({ err: 'live must be boolean' });
        if (!isValidObjectId(userId)) return res.status(400).send({ err: 'user is invaild ' });

        let user = await User.findById(userId);
        //console.log(user); // 유저가 없으면 null 을 return 한다 -> Javascript 에서는 null 은 거짓값
        if (!user) res.status(404).send({ err: 'user does not exist' });
        // 참조가 되는 path 을 반드시 객체 형식으로 작성을 해줘야 합
        let blog = new Blog({ ...req.body, user });
        await blog.save();
        return res.status(200).send({ blog });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({ err: 'blog is invaild ' });
        const blog = await Blog.findOne({ _id: blogId });
        return res.status(200).send({ blog });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.put('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({ err: 'blog is invaild ' });
        const { title, content } = req.body;
        if (typeof title !== 'string') res.status(400).send({ err: 'title must be string' });
        if (typeof content !== 'string') res.status(400).send({ err: 'content must be string' });

        const updateBlog = await Blog.findByIdAndUpdate(blogId, { title, content }, { new: true });
        return res.status(200).send({ updateBlog });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.patch('/:blogId/live', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({ err: 'blog is invaild ' });
        const { islive } = req.body;
        console.log(islive);
        if (islive && typeof islive !== 'boolean') res.status(400).send({ err: 'live must be boolean' });
        const updateLive = await Blog.findOneAndUpdate(blogId, { islive }, { new: true });
        return res.status(200).send({ updateLive });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.delete('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({ err: 'Blog is valid' });
        const blog = await Blog.findById({ _id: blogId });
        if (!blog) res.status(404).send({ err: 'blog id not Found ' });
        await Blog.deleteOne({ _id: blogId });
        return res.status(200).send({ msg: 'delete Blog' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

module.exports = {
    blogRouter,
};
