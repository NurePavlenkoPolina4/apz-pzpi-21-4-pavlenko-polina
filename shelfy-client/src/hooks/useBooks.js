import { useState, useEffect } from 'react';
import noCover from "./../assets/no-cover.jpg";


export function useBooks(fetchLink, user, setIsLoading) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const response = await fetch(fetchLink, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        const data = await response.json();
    
        let booksData
        if(data.data.books){
          booksData = data.data.books;
        }
        else if(data.data.book){
          booksData = data.data.book;
        }
        // Fetching book covers for each book
        const booksWithCovers = await Promise.all(
          booksData.map(async (book) => {
            const cover = await fetchBookCover(book.isbn);
            return { ...book, cover };
          })
        );
        setBooks(booksWithCovers);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [fetchLink, setIsLoading, user]);

  async function fetchBookCover(isbn) {
    try {
      const response = await fetch(
        `http://bookcover.longitood.com/bookcover/${isbn}`
      );
      const data = await response.json();
      const cover = data.url;
      return cover || noCover;
    } catch (error) {
      console.error("Error fetching book cover:", error);
      return "";
    }
  }

  return { books };
}

