import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../../firebase.config";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  addDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import Loader from "../../../components/Loader";
import { Link } from "react-router-dom";
import { BsFillCartPlusFill } from "react-icons/bs";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineChatAlt2, HiOutlineEye } from "react-icons/hi";
import Input from "../../../components/Input";
import CommentModal from "../../../components/products/commentModal";
import { ViewCommentModal } from "../../../components/products/viewCommentModal";

function EshProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCommentViewModalOpen, setIsViewCommentModalOpen] = useState(false);
  const [commentProductId, setCommentProductId] = useState(null);
  const [comments, setComments] = useState([]);

  const getProducts = useCallback(async () => {
    try {
      const data = await getDocs(collection(db, "eshgoods"));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleEdit = (id, field, value) => {
    setEditingId(id);
    setEditedData((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    try {
      const oldProduct = products.find((product) => product.id === id);
      const updatedFields = {
        ...editedData[id],
        editedDate: new Date().toISOString(),
      };

      const oldQuantity = parseFloat(oldProduct.quantity) || 0;
      const added = parseFloat(updatedFields.added) || 0;
      const sold = parseFloat(updatedFields.sold) || 0;

      if (added !== 0) {
        updatedFields.quantity = oldQuantity + added;
      } else if (sold !== 0) {
        updatedFields.quantity = oldQuantity - sold;
      }

      // Reset added/sold fields
      updatedFields.added = 0;
      updatedFields.sold = 0;

      await updateDoc(doc(db, "eshgoods", id), updatedFields);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedFields } : product
        )
      );

      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "eshgoods", id));
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const viewComment = async (id) => {
    try {
      const q = query(
        collection(db, "productcomments"),
        where("productId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
      setIsViewCommentModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  const openCommentModal = (id) => {
    setCommentProductId(id);
    setIsCommentModalOpen(true);
  };

  const openViewCommentModal = (id) => {
    setCommentProductId(id);
    viewComment(id);
  };

  const saveComment = async (productId, commentData) => {
    try {
      await addDoc(collection(db, "productcomments"), {
        productId: productId,
        comment: commentData.comment,
        date: commentData.date,
      });
    } catch (error) {
      console.error("Error saving comment: ", error);
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">ESH Inventory</h2>
          <p className="text-slate-500 text-sm">Manage stock levels for ESH-specific products</p>
        </div>
        <div className="w-full md:w-80">
          <Input
            placeholder="Search ESH products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Update Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts?.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    {editingId === product.id ? (
                      <input
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5162]"
                        value={editedData[product.id]?.name ?? product.name}
                        onChange={(e) => handleEdit(product.id, "name", e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-slate-700">{product.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      (product.quantity || 0) < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {product.quantity || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center focus:outline-none focus:border-[#FF5162]"
                        value={editedData[product.id]?.price ?? product.price}
                        onChange={(e) => handleEdit(product.id, "price", e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-slate-600">₦{parseFloat(product.price || 0).toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase">Add</span>
                        <input
                          type="number"
                          placeholder="+"
                          className="w-16 px-2 py-1.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-center focus:outline-none focus:border-emerald-500"
                          value={editedData[product.id]?.added ?? ""}
                          onChange={(e) => handleEdit(product.id, "added", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-rose-500 uppercase">Sold</span>
                        <input
                          type="number"
                          placeholder="-"
                          className="w-16 px-2 py-1.5 bg-rose-50/50 border border-rose-100 rounded-lg text-xs text-center focus:outline-none focus:border-rose-500"
                          value={editedData[product.id]?.sold ?? ""}
                          onChange={(e) => handleEdit(product.id, "sold", e.target.value)}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === product.id || editedData[product.id] ? (
                        <button
                          className="bg-[#FF5162] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-100 hover:bg-[#E64858] transition-all"
                          onClick={() => handleSave(product.id)}
                        >
                          Save
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingId(product.id)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Edit Name/Price"
                          >
                            <HiOutlinePencilAlt size={18} />
                          </button>
                          <button
                            onClick={() => openCommentModal(product.id)}
                            className="p-2 text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                            title="Add Comment"
                          >
                            <HiOutlineChatAlt2 size={18} />
                          </button>
                          <button
                            onClick={() => openViewCommentModal(product.id)}
                            className="p-2 text-purple-500 hover:bg-purple-50 rounded-xl transition-colors"
                            title="View Comments"
                          >
                            <HiOutlineEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCommentModalOpen && (
        <CommentModal
          productId={commentProductId}
          onSave={saveComment}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}

      {isCommentViewModalOpen && (
        <ViewCommentModal
          productId={commentProductId}
          comments={comments}
          onClose={() => setIsViewCommentModalOpen(false)}
        />
      )}

      <Link
        to="/esh/add-new-product"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#FF5162] text-white rounded-2xl shadow-2xl shadow-red-200 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-50 group"
      >
        <BsFillCartPlusFill size={32} />
        <span className="absolute right-20 bg-slate-800 text-white text-xs py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Add New ESH Product
        </span>
      </Link>
    </div>
  );
}

export default EshProducts;
