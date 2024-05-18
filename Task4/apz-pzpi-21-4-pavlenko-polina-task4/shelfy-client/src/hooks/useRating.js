import { useEffect } from "react";

const useRating = (userRating, user) => {
  useEffect(() => {
    async function changeRating() {
      try {
        if (!user || !userRating) return; // Check if user or userRating is not defined
        const response = await fetch(
          `http://127.0.0.1:3001/api/v1/shelf/${userRating.bookId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user}`,
            },
            body: JSON.stringify({ rating: userRating.rating }),
          }
        );
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    }

    changeRating();
  }, [userRating, user]);
};

export default useRating;
