import React from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineUsergroupDelete,
  AiFillDatabase,
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineUnorderedList,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { AiOutlineBorderlessTable } from "react-icons/ai";
import { BiMessageSquareCheck } from "react-icons/bi";
import { PiMoneyBold } from "react-icons/pi";
import Navbar from "../../components/Navbar";

const menuItems = [
  {
    to: "/admin/patients",
    text: "Patient Directory",
    subtext: "View and edit clinical data",
    icon: AiOutlineUnorderedList,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    to: "/admin/products",
    text: "Inventory Management",
    subtext: "Track available products",
    icon: AiOutlineShoppingCart,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    to: "/admin/profile",
    text: "My Profile",
    subtext: "Access your account details",
    icon: AiOutlineUser,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    to: "/admin/calender",
    text: "Monthly Reports",
    subtext: "Clinical performance summary",
    icon: AiTwotoneCalendar,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    to: "/admin/messages",
    text: "Messages",
    subtext: "Communication center",
    icon: AiOutlineMessage,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    to: "/admin/notes",
    text: "Clinical Notes",
    subtext: "Staff observations & logs",
    icon: BiMessageSquareCheck,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    to: "/admin/staff",
    text: "Staff Records",
    subtext: "Personnel & payroll data",
    icon: PiMoneyBold,
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
  {
    to: "/admin/user",
    text: "User Management",
    subtext: "System access controls",
    icon: AiOutlineUsergroupDelete,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    to: "/admin/eshdata",
    text: "ESH Database",
    subtext: "Secure ESH patient records",
    icon: AiFillDatabase,
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    to: "/admin/Initial",
    text: "Initial Reviews",
    subtext: "ESH preliminary assessments",
    icon: AiOutlineBorderlessTable,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-50",
  },
];

function Admin() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back. Manage your clinical operations and staff from one central hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start gap-4"
            >
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} transition-colors group-hover:bg-[#FF5162]/10 group-hover:text-[#FF5162]`}>
                <item.icon size={32} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-slate-900 group-hover:text-[#FF5162] transition-colors">
                  {item.text}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.subtext}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Admin;
