console.log('Clietn Code Running ');
const axios = require('axios');
const apiURL = 'http://localhost:3000';

// 비효율적인 방법 : 6초 초반
//  - BlogLimit  20 일때 6초 초반
//  - BlogLimit  50 일때 15초 초반
// populate 사용하는 방법
//  - BlogLimit  20 일때 0.8초
//  - BlogLimit  50 일때 0.7초

const blogData = async () => {
    console.time('API loading Time: ');
    try {
        let {
            data: { blogs },
        } = await axios.get(`${apiURL}/blog`);
        console.dir(blogs[0], { depth: 10 });
        // const customBlogData = await Promise.all(
        //     blogs.map(async (blog) => {
        //         let [userInfo, commentInfo] = await Promise.all([
        //             axios.get(`${apiURL}/user/${blog.user}`),
        //             axios.get(`${apiURL}/blog/${blog._id}/comment`),
        //         ]);
        //         blog.user = userInfo.data.user;
        //         blog.comment = await Promise.all(
        //             commentInfo.data.comment.map(async (comment) => {
        //                 const {
        //                     data: { user },
        //                 } = await axios.get(`${apiURL}/user/${comment.user}`);
        //                 comment.user = user;
        //                 return comment;
        //             }),
        //         );

        //         return blog;
        //     }),
        // );
        //console.dir(customBlogData[0], { depth: 10 });
    } catch (err) {
        console.error(err);
    }
    console.timeEnd('API loading Time: ');
};

const blogTestGroup = async () => {
    await blogData();
    //     await blogData();
    //     await blogData();
    //     await blogData();
    //     await blogData();
};

//blogData();
blogTestGroup();
