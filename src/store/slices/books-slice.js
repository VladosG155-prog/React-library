import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  activeCategory: 'all',
  categoriesList: [],
  filteredBooks: [],
  ratingSort: 'down',
};

export const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks(state, action) {
      state.books = action.payload;
    },
    filterBooksByCategory(state, action) {
      if (state.activeCategory !== 'all') {
        state.filteredBooks = state.books?.filter((book) => book.categories?.includes(action.payload.type));
      } else {
        state.filteredBooks = state.books;
      }
      if (action.payload.ratingSort === 'down') {
        state.filteredBooks = state.filteredBooks?.sort((a, b) => (a.rating < b.rating ? 1 : -1));
      } else {
        state.filteredBooks = state.filteredBooks?.sort((a, b) => (a.rating > b.rating ? 1 : -1));
      }
      state.filteredBooks = state.filteredBooks?.filter((book) =>
        book.title.toLowerCase().includes(action.payload.search.toLowerCase())
      );
    },
    setCategoriesList(state, action) {
      state.categoriesList = action.payload;
    },
    setCategory(state, action) {
      state.activeCategory = action.payload;
    },
  },
});

export const { setBooks, setCategory, setCategoriesList, filterBooksByCategory } = bookSlice.actions;

export const { reducer } = bookSlice;
