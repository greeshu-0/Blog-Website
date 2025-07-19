import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

// Add Blog with Author Ownership
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      author: req.userId, // 👈 link blog to logged-in user
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Public Blogs Only
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Blogs for Logged-in User (Admin/Owner)
export const getUserBlogs = async (req, res) => {
  try {
    // req.userId should be set by auth middleware
    const blogs = await Blog.find({ author: req.userId });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate("author", "name");
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Blog (Scoped to Any User)
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle Blog Publish Status
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add Comment (With Optional Auth)
export const addComment = async (req, res) => {
  try {
    const { blog, content } = req.body;
    const userId = req.userId || null;
    let userName = null;
    let userEmail = null;


    // Always use logged-in user's name/email if available
    if (req.user && req.user.name) {
      userName = req.user.name;
      userEmail = req.user.email || null;
    } else {
      userName = req.body.name;
      userEmail = req.body.email;
    }

    // Debug logs
    console.log("[addComment] req.user:", req.user);
    console.log("[addComment] userName:", userName);

    if (!userName) {
      return res.json({ success: false, message: "Name is required" });
    }

    // Find the blog to get its author
    const blogDoc = await Blog.findById(blog);
    if (!blogDoc) {
      return res.json({ success: false, message: "Blog not found" });
    }
    const blogAuthor = blogDoc.author;

    // Save comment with blogAuthor, userName, userEmail, and isApproved: false
    await Comment.create({
      blog,
      blogAuthor,
      user: userId,
      userName,
      userEmail,
      content,
      isApproved: false,
    });
    res.json({ success: true, message: "Comment added for review. It will be visible after approval by the blog author." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Approved Comments for a Blog
// Get All Comments for Blogs Posted by the Logged-in User
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    if (blogId) {
      // If blogId is provided, return only approved comments for that blog
      const comments = await Comment.find({
        blog: blogId,
        isApproved: true,
      }).sort({ createdAt: -1 });
      return res.json({ success: true, comments });
    }
    // Otherwise, return all approved comments for blogs authored by the logged-in user (admin/owner view)
    const userId = req.userId;
    const blogs = await Blog.find({ author: userId }, "_id");
    const blogIds = blogs.map((b) => b._id);
    const comments = await Comment.find({
      blog: { $in: blogIds },
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Generate Blog Content using Gemini
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + "Generate a blog content for this topic"
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
