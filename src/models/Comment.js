const {
    model,
    Schema,
    Types: { ObjectId },
} = require('mongoose');

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: ObjectId, required: true },
        blog: { type: ObjectId, required: true },
    },
    { timestamps: true },
);

const Comment = model('comment', CommentSchema);

module.exports = {
    Comment,
};
