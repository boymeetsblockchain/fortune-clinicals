import { useState, useEffect } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

const useInitialReview = () => {
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      const reviewQuery = query(collection(db, "reviews"));
      const reviewSnapShot = await getDocs(reviewQuery);
      const reviewDetails = reviewSnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewDetails);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const months = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];

  // Safeguard against empty `reviews`
  if (!reviews || reviews.length === 0) {
    return { yearsData: [] };
  }

  // Group reviews by year and month
  const yearsData = reviews.reduce((acc, review) => {
    const reviewDate = new Date(review.date);
    const year = reviewDate.getFullYear();
    const monthIndex = reviewDate.getMonth();
    const day = reviewDate.getDate();

    if (isNaN(year)) return acc; // Exclude invalid years

    if (!acc[year]) {
      acc[year] = months.map((month) => ({
        name: month.name,
        rev: 0,
        dailyReviews: Array.from({ length: 31 }, () => ({
          day: null,
          reviews: [],
        })),
      }));
    }

    const monthData = acc[year][monthIndex];

    // Ensure `monthData` is valid
    if (monthData) {
      monthData.rev += 1;

      const dayReviews = monthData.dailyReviews[day - 1];
      dayReviews.day = day;
      dayReviews.reviews.push(review);
    }

    return acc;
  }, {});

  // Convert yearsData object into an array and exclude NaN years
  const structuredYearsData = Object.entries(yearsData)
    .filter(([year]) => !isNaN(year)) // Exclude invalid years
    .map(([year, monthsData]) => ({
      year,
      monthsData: monthsData.filter((month) => month.rev > 0),
    }));

  return {
    yearsData: structuredYearsData,
  };
};

export default useInitialReview;
