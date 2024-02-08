/* eslint-disable quotes */
const {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookByIdHandler,
} = require("./handler");

const routes = [
  // add books
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  //   get books
  {
    method: "GET",
    path: "/books",
    handler: getBooksHandler,
  },
  //   get specific books
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  //   edit book by id
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: editBookHandler,
  },
  //   delete book by id
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
