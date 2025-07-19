import React, { useEffect, useState } from "react";
import { comments_data } from "../../assets/assets";
import CommentTableItem from "../../components/admin/CommentTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");
  const { axios } = useAppContext();
  // Approve and delete handlers are managed in CommentTableItem; not needed here
  const fetchComments = async () => {
    try {
      // Fetch all comments from the admin endpoint
      const { data } = await axios.get("/api/admin/comments");
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);
  // Group comments by blog._id
  const grouped = comments.reduce((acc, comment) => {
    const blogId = comment.blog?._id || comment.blog;
    if (!acc[blogId]) acc[blogId] = { blog: comment.blog, comments: [] };
    acc[blogId].comments.push(comment);
    return acc;
  }, {});

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1>Comments</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("Approved")}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Approved" ? "text-white bg-primary" : "text-gray-700"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("Not Approved")}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Not Approved" ? "text-white bg-primary" : "text-gray-700"
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>
      <div className="max-w-3xl mt-4">
        {Object.values(grouped)
          .map(({ blog, comments }) => {
            // Filter comments for this blog based on approval filter
            const filteredComments = comments.filter((comment) => {
              if (filter === "Approved") return comment.isApproved === true;
              return comment.isApproved === false;
            });
            if (filteredComments.length === 0) return null;
            return (
              <div key={blog?._id || blog} className="mb-8 bg-white shadow rounded-lg p-4">
                <h2 className="font-bold text-lg mb-2 text-primary">
                  {blog?.title || "Untitled Blog"}
                </h2>
                <table className="w-full text-sm text-gray-500">
                  <thead className="text-xs text-gray-700 text-left uppercase">
                    <tr>
                      <th className="px-6 py-3">Comment</th>
                      <th className="px-6 py-3 max-sm:hidden">Date</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.map((comment, index) => (
                      <CommentTableItem
                        key={comment._id}
                        comment={comment}
                        index={index + 1}
                        fetchComments={fetchComments}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Comments;
