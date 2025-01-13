import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

export const ViewCommentModal = ({ productId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, "productcomments"),
          where("productId", "==", productId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full text-center">
          <p>Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg font-semibold"
        >
          &times;
        </button>

        {comments.length > 0 ? (
          <ul className="space-y-4 overflow-auto">
            {comments.map((comment) => (
              <li key={comment.id} className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(comment.date).toLocaleDateString()}
                </p>
                <p className="mt-1 text-gray-800">{comment.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No comments available for this product.
          </p>
        )}
      </div>
    </div>
  );
};
