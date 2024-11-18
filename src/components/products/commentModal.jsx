import React, { useState } from 'react';

function CommentModal({ productId, onSave, onClose }) {
  const [commentData, setCommentData] = useState({
    comment: '',
    date: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(productId, commentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="bg-white p-8 rounded-lg w-2/3 shadow-lg transform scale-100 transition-transform duration-300 ease-in-out">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Comment</h2>
        <textarea
          name="comment"
          value={commentData.comment}
          onChange={handleChange}
          placeholder="Enter your comment"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out"
          rows="4"
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
