import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import AdminNav from "../../components/AdminNav";
import { AiOutlineArrowRight, AiOutlinePlus, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { HiOutlineLogout, HiOutlineCash } from "react-icons/hi";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import FeeTable from "./admincomponents/FeeTable";

function Profile() {
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  const onLogOut = async () => {
    try {
      await auth.signOut();
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const saveNote = async (e) => {
    e.preventDefault();
    if (!note || !date) {
      toast.error("Please fill in both fields");
      return;
    }
    const noteCopy = {
      note,
      date,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
    };

    try {
      await addDoc(collection(db, "notes"), noteCopy);
      toast.success("Note saved");
      setNote("");
      setDate("");
      getNotes(); // Refresh notes list
    } catch (error) {
      console.log(error);
      toast.error("Failed to save note");
    }
  };

  const getNotes = async () => {
    try {
      const data = await getDocs(collection(db, "notes"));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      setNotes(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleNoteExpansion = (noteId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  useEffect(() => {
    getNotes();
  }, []);

  const filteredNotes = notes.filter((noteItem) => {
    const noteText = noteItem.note.toLowerCase();
    const query = searchQuery.toLowerCase();
    return noteText.includes(query);
  });

  const deleteNote = async (noteId) => {
    if (window.confirm("Delete this note?")) {
      try {
        await deleteDoc(doc(db, "notes", noteId));
        toast.success("Note deleted");
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete note");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-[#FF5162] shadow-inner border border-slate-100">
              <AiOutlineUser size={40} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Profile</h1>
              <p className="text-slate-500 font-medium italic">
                {auth?.currentUser?.displayName || auth?.currentUser?.email}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/daily")}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <HiOutlineCash size={20} className="text-emerald-500" />
              Expenditures
            </button>
            <button
              onClick={onLogOut}
              className="flex items-center gap-2 px-6 py-3 bg-[#FF5162] text-white rounded-2xl font-bold text-sm hover:bg-[#E64858] transition-all active:scale-95 shadow-lg shadow-red-100"
            >
              <HiOutlineLogout size={20} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Fees & Note Form */}
          <div className="lg:col-span-1 space-y-12">
            
            <section className="space-y-6">
              <div className="flex items-center gap-2 px-2">
                <div className="w-1.5 h-6 bg-[#FF5162] rounded-full"></div>
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Fee Management</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <FeeTable tableName="inpatientfee" label="Inpatient" />
                <FeeTable tableName="outpatientfee" label="Outpatient" />
                <FeeTable tableName="initialreviewfee" label="Initial Review" />
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Add Clinical Note</h2>
                <p className="text-slate-500 text-xs font-medium">Internal observations and reminders</p>
              </div>
              <form onSubmit={saveNote} className="space-y-6">
                <Input
                  label="Content"
                  placeholder="Type your note here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button 
                  type="submit"
                  className="w-full bg-[#FF5162] py-4 flex items-center justify-center gap-2 text-white font-bold rounded-2xl shadow-xl shadow-red-50 hover:bg-[#E64858] transition-all active:scale-[0.98]"
                >
                  <AiOutlinePlus /> Save Note
                </button>
              </form>
            </section>
          </div>

          {/* Right Column: Notes List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Note History</h2>
              </div>
              <div className="relative w-full md:w-72">
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <AiOutlineSearch size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((item) => {
                  const isExpanded = expandedNotes[item.id];
                  return (
                    <div
                      key={item.id}
                      className="group bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="space-y-1 flex-1">
                          <p className={`text-slate-700 leading-relaxed font-medium ${!isExpanded && 'line-clamp-3'}`}>
                            {item.note}
                          </p>
                          {item.note.length > 150 && (
                            <button
                              className="text-xs font-bold text-[#FF5162] hover:underline"
                              onClick={() => toggleNoteExpansion(item.id)}
                            >
                              {isExpanded ? "Show Less" : "Read Full Note"}
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => deleteNote(item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-slate-300 font-medium italic">
                          Ref: {item.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium">No notes found matching your search.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Profile;
