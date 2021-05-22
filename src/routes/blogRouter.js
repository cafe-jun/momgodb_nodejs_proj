const { Router } = require("express")
const blogRouter = Router()
const { Blog, User } = require("../models")
const { isValidObjectId } = require("mongoose")
const { commentRouter } = require("./commentRouter")

blogRouter.use("/:blogId/comment", commentRouter)

<<<<<<< HEAD
blogRouter.get('/', async (req, res) => {
    try {
        let { page } = req.query;
        page = parseInt(page);
        // pageNation
        let blogs = await Blog.find({})
            .sort({ updatedAt: -1 })
            .skip(page * 3)
            .limit(3);
        // N+1 Problem 을 해결하기위한 poplutae 사용
        //.populate([{ path: 'user' }, { path: 'comments', populate: { path: 'user' } }]);
        // example
        // .populate([
        //     { path: "user", select: "name fullName"},
        //     {
        //         path: "comments",
        //         select : "content",
        //         match : { user : "lkadsnfalskdnf"},
        //         populate: { path: "user", select : "name fullName"}
        //     }
        // ])
        return res.status(200).send({ blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send({ err: err.message });
    }
});
=======
blogRouter.get("/", async (req, res) => {
  try {
    let { page } = req.query
    page = parseInt(page)
    let blogs = await Blog.find({})
      .sort({ updatedAt: -1 })
      .skip(page * 3)
      .limit(3)
    // N+1 Problem 을 해결하기위한 poplutae 사용
    //.populate([{ path: 'user' }, { path: 'comments', populate: { path: 'user' } }]);
    // example
    // .populate([
    //     { path: "user", select: "name fullName"},
    //     {
    //         path: "comments",
    //         select : "content",
    //         match : { user : "lkadsnfalskdnf"},
    //         populate: { path: "user", select : "name fullName"}
    //     }
    // ])
    return res.status(200).send({ blogs })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err: err.message })
  }
})
>>>>>>> e7efece6cf1ebdf1ae7359591e10229d942d3ec7

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body
    if (typeof title !== "string") return res.status(400).send({ err: "title must be string" })
    if (typeof content !== "string") return res.status(400).send({ err: "content must be string" })
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({ err: "live must be boolean" })
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "user is invaild " })

    let user = await User.findById(userId)
    //console.log(user); // 유저가 없으면 null 을 return 한다 -> Javascript 에서는 null 은 거짓값
    if (!user) res.status(404).send({ err: "user does not exist" })
    // 참조가 되는 path 을 반드시 객체 형식으로 작성을 해줘야 합
    let blog = new Blog({ ...req.body, user })
    await blog.save()
    return res.status(200).send({ blog })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err: err.message })
  }
})

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "blog is invaild " })
    const blog = await Blog.findOne({ _id: blogId })
    const commentCount = await Comment.find({ blog: blogId }).countDocuments()
    return res.status(200).send({ blog, commentCount })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err: err.message })
  }
})

blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "blog is invaild " })
    const { title, content } = req.body
    if (typeof title !== "string") res.status(400).send({ err: "title must be string" })
    if (typeof content !== "string") res.status(400).send({ err: "content must be string" })

    const updateBlog = await Blog.findByIdAndUpdate(blogId, { title, content }, { new: true })
    return res.status(200).send({ updateBlog })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err: err.message })
  }
})

blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "blog is invaild " })
    const { islive } = req.body
    console.log(islive)
    if (islive && typeof islive !== "boolean") res.status(400).send({ err: "live must be boolean" })
    const updateLive = await Blog.findOneAndUpdate(blogId, { islive }, { new: true })
    return res.status(200).send({ updateLive })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err: err.message })
  }
})

blogRouter.delete("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "Blog is valid" })
    const blog = await Blog.findById({ _id: blogId })
    if (!blog) res.status(404).send({ err: "blog id not Found " })
    await Blog.deleteOne({ _id: blogId })
    return res.status(200).send({ msg: "delete Blog" })
  } catch (err) {
    console.error(err)
    res.status(500).send({ err: err.message })
  }
})

module.exports = {
  blogRouter,
}
