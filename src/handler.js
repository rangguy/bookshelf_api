/* eslint-disable quotes */
const { nanoid } = require("nanoid");
const books = require("./book");

// add book
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  let response;
  if (name === " " || name === undefined) {
    response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  response = h.response({
    status: "fail",
    message: "Gagal menambahkan buku",
  });
  response.code(500);
  return response;
};

// get all books or by name or by reading or by finished
const getBooksHandler = (request) => {
  const { name, reading, finished } = request.query;
  let result = books;
  if (name !== undefined) {
    result = result.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading === "0") {
    result = result.filter((book) => book.reading === false);
  }
  if (reading === "1") {
    result = result.filter((book) => book.reading === true);
  }
  if (finished === "0") {
    result = result.filter((book) => book.finished === false);
  }
  if (finished === "1") {
    result = result.filter((book) => book.finished === true);
  }

  const resultBook = result.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return {
    status: "success",
    data: {
      books: resultBook,
    },
  };
};

// get specific books by Id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// edit book
const editBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  const isValidName = !name || name.trim() === "";

  if (index !== -1) {
    let response;
    if (isValidName) {
      response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
    } else if (pageCount < readPage) {
      response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
    } else {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
      response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
    }
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// delete book by id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookByIdHandler,
};
