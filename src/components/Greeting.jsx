import {useState,useEffect} from "react";



export const Greeting = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const currentHour = currentTime.getHours();
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, []);

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good night';
    }
  };