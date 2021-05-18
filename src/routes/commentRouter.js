const { Router } = require("express")
const commentRouter = Router({ mergeParams: true })
const { Blog, Comment, User } = require("../models")
const { isValidObjectId } = require("mongoose")

commentRouter.get("/", async (req, res) => {
  const { blogId } = req.params
  if (!isValidObjectId(blogId)) res.status(400).send({ err: "blog is invalid" })
  const comment = await Comment.find({ blog: blogId })
  return res.status(200).send({ comment })
})

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId)) return res.status(400).send({ err: "blog is invalid" })
    const { userId, content } = req.body
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "user is invalid" })
    if (typeof content !== "string") return res.status(400).send({ err: "comment must be string" })

    // const user = await User.findById(userId);
    // const blog = await Blog.findById(blogId);
    // 응답시간 개선하기
    const [blog, user] = await Promise.all([Blog.findById(blogId), User.findById(userId)])
    console.log(`${user}  : ${blog}`)

    if (!user || !blog) return res.status(404).send({ err: "blog or user is not exist" })
    if (!blog.islive) return res.status(400).send({ err: "blog is not available " })
    const comment = new Comment({
      blog,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      content,
    })
    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ])
    return res.status(200).send({ comment })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ err: err.message })
  }
})

commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params
  const { content } = req.body
  if (typeof content !== "string") {
    return res.status(400).send({ err: "content is required" })
  }
  const [comment] = await Promise.all([
    Comment.findByIdAndUpdate({ _id: commentId }, { content }, { new: true }),
    Blog.updateOne({ "comments._id": commentId }, { "comments.$.content": content }),
  ]) // 복잡한 문서를 document를 수정 삭제가 쉽다
  return res.send({ comment })
})

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params
  const comment = await Comment.findOneAndDelete({ _id: commentId })
  await Blog.updateOne({ "comments._id": commentId }, { $pull: { comments: { _id: commentId } } })
  return res.send({ comment })
})

module.exports = { commentRouter }
