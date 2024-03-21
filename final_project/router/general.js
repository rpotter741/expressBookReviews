const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
    let userswithsamename = users.filter((user) => user.username === username)
    if(userswithsamename.length > 0) {
        return true;
    } else {
        return false
    }

    }

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

    if(!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered! You may now login."})
    } else {
        return res.status(404).json({message:"User already exists!"});
    } 
    }
  
);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookPromise = new Promise((resolve,reject) => {
        resolve(JSON.stringify(books,null,4));
        reject("Unable to parse book list. Try again later.")
    });
     bookPromise.then((bookList) => {
        res.send(bookList)
     })
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let bookPromise = new Promise((resolve,reject) => {
        resolve(JSON.stringify(books[isbn],null,4));
        reject(`Unable to locate ISBN ${isbn}`)
    })

    bookPromise.then((message) => {
        res.send(message);
    })
  
 });
  

function authorList(author) {
    let keys = Object.keys(books);
    let filteredBooks = [];
    for(let i = 0; i < keys.length; i++) {
      let book = books[keys[i]];
      if(book.author === author) {
          filteredBooks.push(book)
      }
    }
    if(filteredBooks.length > 0) {
      return(JSON.stringify(filteredBooks,null,4))
    } else {
      return(`No books by ${author} found.`)
    }
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authorPromise = new Promise((resolve,reject) => {
    resolve(authorList(author))
  })
  authorPromise.then((message) => {
    res.send(message)
  })
  }

);

function titleList(title) {
    let keys = Object.keys(books);
    let filteredBooks = [];
    for(let i = 0; i < keys.length; i++) {
      let book = books[keys[i]];
      if(book.title === title) {
          filteredBooks.push(book);
      }
    }
    if(filteredBooks.length > 0) {
      return(JSON.stringify(filteredBooks,null,4))
    } else {
      return(`No books named ${title} found.`)
    }
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let titlePromise = new Promise((resolve,reject) => {
    resolve(titleList(title))
  })
  titlePromise.then((message) => {
    res.send(message);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn].reviews.length > 0) {
    res.send(JSON.stringify(books[isbn].reviews,null,4))
  } else {
    res.send(`No reviews found for ISBN ${isbn}.`)
  }

});

module.exports.general = public_users;
