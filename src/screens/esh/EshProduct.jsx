import React, { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import EshNav from "../../components/EshNav";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { BsFillCartPlusFill } from "react-icons/bs";
import { AiOutlineSearch, AiOutlineEdit, AiOutlineMessage, AiOutlineEye } from "react-icons/ai";
import { HiOutlineCheck } from "react-icons/hi";
import Input from "../../components/Input";
import { ViewCommentModal } from "../../components/products/viewCommentModal";
import CommentModal from "../../components/products/commentModal";
import { toast } from "react-hot-toast";

function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCommentViewModalOpen, setIsViewCommentModalOpen] = useState(false);
  const [commentProductId, setCommentProductId] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
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
    };
    getProducts();
  }, []);

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
      const updatedData = {
        ...editedData[id],
        editedDate: new Date().toISOString(),
      };

      const oldQuantity = parseFloat(oldProduct.quantity || 0);
      const added = parseFloat(updatedData.added || 0);
      const sold = parseFloat(updatedData.sold || 0);

      if (!isNaN(added) && added !== 0) {
        updatedData.quantity = oldQuantity + added;
      } else if (!isNaN(sold) && sold !== 0) {
        updatedData.quantity = oldQuantity - sold;
      }

      updatedData.added = 0;
      updatedData.sold = 0;

      await updateDoc(doc(db, "eshgoods", id), updatedData);
      
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedData } : product
        )
      );

      setEditingId(null);
      setEditedData({});
      toast.success("Inventory updated");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      toast.success("Comment added");
    } catch (error) {
      console.error("Error saving comment: ", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50">
      <EshNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ESH Inventory</h1>
            <p className="text-slate-500 font-medium">Manage and track available products</p>
          </div>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <AiOutlineSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Info</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Level</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Price</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Stock</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts?.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-6">
                      {editingId === product.id ? (
                        <input
                          value={editedData[product.id]?.name || product.name}
                          onChange={(e) => handleEdit(product.id, "name", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-emerald-500 transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                            {product.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{product.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Ref: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {editingId === product.id ? (
                          <input
                            type="number"
                            value={editedData[product.id]?.quantity || product.quantity}
                            onChange={(e) => handleEdit(product.id, "quantity", e.target.value)}
                            className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                          />
                        ) : (
                          <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            parseFloat(product.quantity) < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {product.quantity} units
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={editedData[product.id]?.price || product.price}
                          onChange={(e) => handleEdit(product.id, "price", e.target.value)}
                          className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                        />
                      ) : (
                        <span className="font-extrabold text-slate-700 tracking-tight">₦{parseFloat(product.price || 0).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Add</span>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:bg-white focus:border-emerald-500 transition-all"
                            value={editedData[product.id]?.added || ""}
                            onChange={(e) => handleEdit(product.id, "added", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Sold</span>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:bg-white focus:border-red-400 transition-all"
                            value={editedData[product.id]?.sold || ""}
                            onChange={(e) => handleEdit(product.id, "sold", e.target.value)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {editingId === product.id ? (
                          <button
                            onClick={() => handleSave(product.id)}
                            className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
                          >
                            <HiOutlineCheck size={20} />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingId(product.id)}
                              className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                              title="Edit Info"
                            >
                              <AiOutlineEdit size={18} />
                            </button>
                            <button
                              onClick={() => openCommentModal(product.id)}
                              className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                              title="Add Comment"
                            >
                              <AiOutlineMessage size={18} />
                            </button>
                            <button
                              onClick={() => openViewCommentModal(product.id)}
                              className="p-2.5 text-slate-400 hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-all"
                              title="View Comments"
                            >
                              <AiOutlineEye size={18} />
                            </button>
                          </>
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
          className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] shadow-2xl shadow-emerald-200 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-50 border-4 border-white"
        >
          <BsFillCartPlusFill size={28} />
        </Link>
      </main>
    </div>
  );
}

export default Products;
