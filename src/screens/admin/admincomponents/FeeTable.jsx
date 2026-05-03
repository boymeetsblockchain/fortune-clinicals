import React, { useEffect, useState } from "react";
import { fetchFeeTable, updateFee } from "../../../hooks/feeTables";
import { HiOutlinePencilAlt, HiOutlineCheck } from "react-icons/hi";

function FeeTable({ tableName, label }) {
  const [fees, setFees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedFee, setEditedFee] = useState("");

  useEffect(() => {
    fetchFeeTable(tableName).then(setFees);
  }, [tableName]);

  const handleEdit = (id, fee) => {
    setEditingId(id);
    setEditedFee(fee);
  };

  const handleSave = async (id) => {
    try {
      await updateFee(tableName, id, editedFee);
      setEditingId(null);
      setEditedFee("");
      const updatedFees = await fetchFeeTable(tableName);
      setFees(updatedFees);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">{label}</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">
          Fees
        </span>
      </div>
      <div className="p-4">
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {fees.map((feeItem) => (
              <tr key={feeItem.id} className="group transition-colors hover:bg-slate-50/30">
                <td className="py-4 pl-2">
                  {editingId === feeItem.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₦</span>
                      <input
                        type="number"
                        value={editedFee}
                        onChange={(e) => setEditedFee(e.target.value)}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FF5162] focus:ring-4 focus:ring-[#FF5162]/5 transition-all"
                      />
                    </div>
                  ) : (
                    <span className="text-lg font-extrabold text-slate-700 tracking-tight">
                      ₦{parseFloat(feeItem.fee || 0).toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="py-4 text-right pr-2">
                  {editingId === feeItem.id ? (
                    <button
                      className="bg-emerald-500 hover:bg-emerald-600 p-2.5 rounded-xl text-white transition-all shadow-lg shadow-emerald-100 active:scale-95"
                      onClick={() => handleSave(feeItem.id)}
                    >
                      <HiOutlineCheck size={18} />
                    </button>
                  ) : (
                    <button
                      className="opacity-0 group-hover:opacity-100 p-2.5 text-[#FF5162] hover:bg-[#FF5162]/10 rounded-xl transition-all"
                      onClick={() => handleEdit(feeItem.id, feeItem.fee)}
                    >
                      <HiOutlinePencilAlt size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeeTable;
