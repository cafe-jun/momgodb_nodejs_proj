const { Types, model, Schema } = require('mongoose');

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        islive: { type: Boolean, required: true, default: false },
        user: {
            type: Types.ObjectId,
            required: true,
            ref: 'user',
        },
    },
    { timestamps: true },
);
BlogSchema.virtual('comments', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'blog',
});

BlogSchema.set('toObject', { virtual: true });
BlogSchema.set('toJSON', { virtual: true });

const Blog = model('blog', BlogSchema);

module.exports = { Blog };
