import { useState, useEffect } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

const useInitialReview = () => {
    const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
        try {
            const reviewQuery = query(collection(db, 'reviews'));
            const reviewSnapShot = await getDocs(reviewQuery);
            const reviewDetails = reviewSnapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setReviews(reviewDetails);
        } catch (error) {
            console.error("Error fetching reviews: ", error);
        }
    };

    useEffect(() => {
        getReviews();
    }, []);

    const months = [
        { name: 'January' },
        { name: 'February' },
        { name: 'March' },
        { name: 'April' },
        { name: 'May' },
        { name: 'June' },
        { name: 'July' },
        { name: 'August' },
        { name: 'September' },
        { name: 'October' },
        { name: 'November' },
        { name: 'December' },
    ];

    const monthsData = months.map((month, index) => {
        const filteredReviews = reviews.filter((session) => {
            const reviewsDate = new Date(session.date);
            return reviewsDate.getMonth() === index;
        });

        const dailyReviews = [];
        for (let day = 1; day <= 31; day++) {
            const reviewsForDay = filteredReviews.filter((rev) => {
                const sessionDate = new Date(rev.date);
                return sessionDate.getDate() === day;
            });
            dailyReviews.push({
                day,
                Reviews: reviewsForDay,
            });
        }

        return {
            ...month,
            rev: filteredReviews.length,
            dailyReviews,
            totalReviews: reviews.length,
        };
    });

    const filteredMonthsData = monthsData.filter((month) => month.rev > 0);

    return {
        filteredMonthsData,
    };
};

export default useInitialReview;
