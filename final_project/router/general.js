const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register user access
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        if (isValid) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn])
    }
    return res.status(404).json({message: "Invalid ISBN"})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const bookAuthor = Object.entries(books).filter(book => book.some(book => book.author === req.params.author));
    if (bookAuthor.length > 0) {
        const bookAuthorObject = Object.fromEntries(bookAuthor)
        return res.status(200).json(bookAuthorObject)
    }
    return res.status(404).json({message: "Invalid Author"})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle = Object.entries(books).filter(book => book.some(book => book.title === req.params.title));
    if (bookTitle > 0) {
        const bookTitleObject = Object.fromEntries(bookTitle);
        return res.status(200).json(bookTitleObject)
    }
    return res.status(404).json({message: "Invalid Title"})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;
  if (books[isbn]) {
    return res.status(200).json(review)
  }
  return res.status(404).json({message: "Invalid ISBN"})
});

module.exports.general = public_users;
