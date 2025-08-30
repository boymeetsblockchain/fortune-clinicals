import React, { useEffect, useState } from "react";
import { fetchFeeTable, updateFee } from "../../../hooks/feeTables";
import Input from "../../../components/Input";

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
    await updateFee(tableName, id, editedFee);
    setEditingId(null);
    setEditedFee("");
    fetchFeeTable(tableName).then(setFees);
  };

  return (
    <div className="mb-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">{label}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className=" text-gray-700 text-sm uppercase">
              <th className="px-6 py-3 text-left font-medium">Fee</th>
              <th className="px-6 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((feeItem, idx) => (
              <tr
                key={feeItem.id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} `}
              >
                <td className="px-6 py-3">
                  {editingId === feeItem.id ? (
                    <Input
                      type="number"
                      value={editedFee}
                      onChange={(e) => setEditedFee(e.target.value)}
                      className="w-28 rounded-lg  focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <span className="text-gray-700 font-medium">
                      ₦{feeItem.fee}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  {editingId === feeItem.id ? (
                    <button
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition"
                      onClick={() => handleSave(feeItem.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition"
                      onClick={() => handleEdit(feeItem.id, feeItem.fee)}
                    >
                      Edit
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
