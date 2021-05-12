const { Router } = require('express');
const { User } = require('../models');
const userRouter = Router();
const mongoose = require('mongoose');

userRouter.get('/', async (req, res) => {
    const users = await User.find({}); // Array Return
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
        if (name) user.name = name;
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
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: 'Invaild User Id' });
        await User.deleteOne({ _id: userId });
        return res.status(200).send({ msg: 'clear' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter,
};
