const { Router } = require('express');
const { User, Blog, Comment } = require('../models');

const userRouter = Router();
const mongoose = require('mongoose');

userRouter.get('/', async (req, res) => {
    const users = await User.find({}); // Array Return
    // send({ }) => client 에 전달할 정보를 입력
    return res.status(200).send({ users });
});

userRouter.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: 'invalid User Id' });
        const user = await User.findOne({ _id: userId });
        return res.status(200).send({ user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

userRouter.post('/', async (req, res) => {
    try {
        let { username, name } = req.body;
        if (!username) return res.status(400).send({ err: 'username is required' });
        if (!name || !name.first || !name.last) return res, status(400).send({ err: 'name is required' });
        const user = new User(req.body);
        await user.save();
        return res.status(200).send({ user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

userRouter.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { age, name } = req.body;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: 'Invail User Id' });
        if (Number.isNaN(age)) return res.status(400).send({ err: 'age must by Number' });
        // Name 이 Object Check지 확인
        if (typeof name !== 'object') return res.status(400).send({ err: 'name must by Object' });
        if (typeof name.first !== 'string' || typeof name.last !== 'string')
            return res.status(400).send({ err: 'first or last must by String Type' });
        // let updateBody = {};
        // updateBody.age = age;
        // updateBody.name = { ...name };
        //const user = await User.findByIdAndUpdate(userId, updateBody, { new: true }); // new -> update 이후의 데이터
        const user = await User.findById(userId);
        console.log(`Before Edit User Info `, user);
        if (age) user.age = age;
        // 블로그에 유저 정보가 변경되었을때
        if (name) {
            user.name = name;
            await Promise.all([
                Blog.updateMany({ 'user._id': userId }, { 'user.name': name }),
                Blog.updateMany(
                    { 'comments.$[comment].userFullName': `${name.first} ${name.last}` },
                    { arrayFilters: [{ 'comment.user': userId }] },
                ),
            ]);
            //await Blog.updateMany({ 'user._id': userId }, { 'user.name': name });
            // comment 의 안에 여러개의 유저 데이터를 변형해야 한다
            // await Blog.updateMany(
            //     { 'comments.$[comment].userFullName': `${name.first} ${name.last}` },
            //     { arrayFilters: [{ 'comment.user': userId }] },
            // );
        }
        console.log(`After Edit User Info `, user);
        await user.save();
        return res.status(200).send({ user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

userRouter.delete('/:userId', async (req, res) => {
    try {
        // 유저가 작성한 블로그도 삭제해야하고 , 유저가 작성한 Comment 도 삭제를 해야한다
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: 'Invaild User Id' });
        const [user] = await Promise.all([
            User.findOneAndDelete({ _id: userId }),
            Blog.deleteMany({ 'user._id': userId }),
            Blog.updateMany({ 'comments.user': userId }, { $pull: { comments: { user: userId } } }),
            Comment.deleteMany({ user: userId }),
        ]);
        // await User.deleteOne({ _id: userId })
        return res.status(200).send({ msg: 'clear' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter,
};
