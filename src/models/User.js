const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: { type: String, require: true, unique: true },
        name: {
            first: { type: String, require: true },
            last: { type: String, require: true },
        },
        age: { type: Number, index: true },
        email: String,
        // 생성시간 수정시간 자동으로 생성
    },
    { timestamps: true },
);

const User = model('user', UserSchema);

module.exports = { User };
