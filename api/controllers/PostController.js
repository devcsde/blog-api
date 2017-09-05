/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /**
   * `PostController.create()`
   */
  create: function (req, res) {
    // extract category name from request object
    const categoryName = req.param('category_name'),
      title = req.param('title'),
      content = req.param('content'),
      userId = req.param('user_id');

    // validate category name
    if (!categoryName) {
      return res.badRequest({err: 'invalid category name'});
    }
    if (!title) {
      return res.badRequest({err: 'invalid title'});
    }
    if (!content) {
      return res.badRequest({err: 'invalid content'});
    }
    if (!userId) {
      return res.badRequest({err: 'invalid user id'});
    }
    // create a new Category if it does not exist

   const makeRequest = async () => {

     try {
       // check if Category name exists
       const catExists = await Category.findOne({
         name: categoryName
       });
       if (catExists){          // create new post in existing Category
         const post = await Post.create({
           title, content,
           _user: userId,
           _category: catExists.id
         });
         return {post, catExists};
       } else {      // create Category, then create post
         const category = await Category.create({
           name: categoryName
         });
         const post = await Post.create({
           title, content,
           _user: userId,
           _category: category.id
         });
         return {post, category};
       }
     } catch (e) {
      throw e;
     }
   };
    makeRequest()
      .then(result => res.ok(result))
      .catch(e => res.serverError(e));
  },


  /**
   * `PostController.findOne()`
   */
  findOne: function (req, res) {

    const findOnePost = async () => {
      try {
        let postId = req.params.id;
        if (!postId){
          return res.badRequest({err: 'invalid post ID'});
        }
        const post = await Post.findOne({
          id: postId
        }).populate('_category');

        if(post){
          return {post};
        } else {
          return new Error("cannot find post");
        }
      } catch (e) {
        throw e;
      }
    };

    findOnePost()
      .then(result => res.ok(result))
      .catch(e => res.notFound(e));
  },


  /**
   * `PostController.findAll()`
   */
  findAll: function (req, res) {

    const findAllPosts = async () => {
      try {
        const posts = await Post.find().populate('_category');
        if (posts) {
          return {posts};
        } else {
          return new Error("There are no posts");
        }
      } catch (e) {
        throw e;
      }
    };
    findAllPosts()
      .then(result => res.ok(result))
      .catch(e => res.notFound(e));
  },


  /**
   * `PostController.update()`
   */
  update: function (req, res) {
    const updatePost = async () => {
      try {
        const postId = req.params.id;
        let post =  {};
        const title = req.param('title'),
          content = req.param('content'),
          userId = req.param('user_id'),
          categoryId = req.param('category_id');
        if (title){
          post.title = title;
        }
        if (content) {
          post.content = content;
        }
        if (userId) {
          post._user = userId;
        }
        if (categoryId){
          post._category = categoryId;
        }
        let updatePost = await Post.update({id: postId}, post);
        return({updatePost});
      } catch (e) {
        throw e;
      }
    };
    updatePost().then(result => res.ok(result))
  },

  /**
   * `PostController.delete()`
   */
  delete: function (req, res) {
    const delOne = async () => {
      try {
        let postId = req.params.id;
        if (!postId){
          return res.badRequest({err: 'invalid post ID'});
        }
        const post = await Post.destroy({
          id: postId
        });

        if (post.length > 0) {
          return {post};
        } else {
          return new Error("Post not found");
        }
      } catch (e) {
        throw e;
      }
    };
    delOne()
      .then(result => res.ok(`Post has been deleted.`))
      .catch(e => res.notFound(e));
  }
};

