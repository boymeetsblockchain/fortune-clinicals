import React, { useState, useEffect } from "react";
import Input from "./Input";
import {
  collection,
  where,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import ComponentLoader from "./ComponentLoader";
import toast from "react-hot-toast";

function InitialReview({ patientId }) {
  const [comment, setComment] = useState("");
  const [reviews, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  // Function to fetch session details based on patientId
  const reviewDetails = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("patientId", "==", patientId)
      );
      const querySnapshot = await getDocs(reviewsQuery);

      // Use map to directly transform querySnapshot to an array of reviewDetails
      const reviewDetails = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      reviewDetails.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      // Update the payments state with fetched session details
      setReview(reviewDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  useEffect(() => {
    // Call the reviewDetails function when the component mounts or when patientId changes
    reviewDetails();
  }, [patientId]);

  const addNewPayment = async (e) => {
    e.preventDefault();

    const paymentData = {
      comment,
      patientId,
      date,
    };

    try {
      const data = await addDoc(collection(db, "reviews"), paymentData);
      console.log("Session added with ID:", data.id);

      // After adding a new session, refetch the session details to include the new one
      reviewDetails();

      // Clear the input fields
      setComment("");
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  const deleteReview = async (reviewId) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!isConfirmed) {
      return; // If the user clicks "Cancel" in the confirmation dialog, do nothing
    }

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      toast.success("Review deleted successfully");

      reviewDetails();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex item-center justify-center">
        <ComponentLoader />
      </div>
    );
  }

  return (
    <div className="flex justify-center my-2 gap-y-3 flex-col px-3">
      <h1 className="text-center font-bold">Review Info</h1>

      <form className="space-y-2 flex flex-col" onSubmit={addNewPayment}>
        <Input
          type={"text"}
          label={"Comment"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Input
          label={"Date Registered"}
          type={"date"}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" className="bg-[#FF5162] text-white py-1.5">
          Submit
        </button>
      </form>

      <div className="session-details-container">
        <div className="session-details">
          {reviews.map((session) => (
            <div
              key={session.id}
              className="flex space-y-2 justify-between bg-white rounded-lg p-3 shadow-md mb-3"
            >
              <div className="flex flex-col">
                <p className="text-gray-700 text-lg">{session?.comment}</p>
                <p className="text-green-600 text-sm font-semibold">
                  {" "}
                  Date: {session?.date}
                </p>
              </div>
              <button
                onClick={() => deleteReview(session.id)}
                className="bg-red-500 text-white py-1 px-2 ml-3 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InitialReview;
