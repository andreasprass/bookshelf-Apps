let books = [];
const STORAGE_KEY = "BOOKSHELF_APPS";
const submitForm = document.getElementById('inputBook');
const searchForm = document.getElementById("searchBook");

document.addEventListener('DOMContentLoaded', function(){
  if(isStorageExist()){
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      const getDataBook = pullBookList();
      renderBookElement(getDataBook);
    } 
  } 
  else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

function generateId() {
  return +new Date();
}

function pullBookList(){
  //get book list from storage
  if (isStorageExist) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
  return [];
}

function isStorageExist() /*boolean*/{
  //check storage exist and pass the return to pullBookList() function
  if(typeof(Storage) == undefined){
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function generateId() {
  //generate ID function using javscript timestamp
  return +new Date();
}

function generateBookObject(id, title, author, bookYear, isCompleted){
  return{
    id,
    title,
    author,
    bookYear,
    isCompleted
  }
}

// --------------------

submitForm.addEventListener('submit', function (event){
  const textTitle = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const textBookYear = parseInt(document.getElementById('inputBookYear').value);
  const textIsCompleted = document.getElementById('inputBookIsComplete').checked ;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textBookYear, textIsCompleted);
  
  event.preventDefault();

  saveData(bookObject);
  resetForm();

  const getDataBook = pullBookList();
  renderBookElement(getDataBook);

});

function saveData(data){
  //save data to array and get data from array
  if(isStorageExist()){
    if(localStorage.getItem(STORAGE_KEY) !== null){
      books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }
    books.push(data);
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function renderBookElement(getDataBook) {
  if (getDataBook === null) {
    return;
  }

  const incompleteContainer = document.getElementById("incompleteBookshelfList");
  const completeContainer = document.getElementById("completeBookshelfList");

  incompleteContainer.innerHTML = "";
  completeContainer.innerHTML = "";
  for (let book of getDataBook) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.bookYear;
    const isComplete = book.isCompleted;

    //create isi item
    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    //container action item
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    //green button
    const greenButton = createGreenButtonFunction(book, function (event) {
      isCompletedHandler(event.target.parentElement.parentElement);

      const getBook = pullBookList();
      resetForm();
      renderBookElement(getBook);
    });

    //red button
    const redButton = createRedButtonFunction(function (event) {
      deleteBook(event.target.parentElement.parentElement);

      const getBook = pullBookList();
      resetForm();
      renderBookElement(getBook);
    });

    containerActionItem.append(greenButton, redButton);

    bookItem.append(containerActionItem);

    // incomplete book
    if (isComplete === false) {
      incompleteContainer.append(bookItem);

      continue;
    }

    //complete book
    completeContainer.append(bookItem);
  }
}

function createGreenButtonFunction(item , eventListener){
  const complete = item.isCompleted ? "Belum selesai" : "Selesai";

  const greenButton = document.createElement('button');
  greenButton.classList.add('green');
  greenButton.innerText = complete + " di baca";
  greenButton.addEventListener('click', function (event){
    eventListener(event);
  });
  return greenButton;
}

function createRedButtonFunction(eventListener){

  const redButton = document.createElement('button');
  redButton.classList.add('red');
  redButton.innerText = "Hapus Buku";
  redButton.addEventListener('click', function (event){
    eventListener(event);
  });
  return redButton;
}

function isCompletedHandler(bookItemElement){
  const getBook = pullBookList();

  const title = bookItemElement.childNodes[0].innerText;
  const titleNameAttribute = bookItemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < getBook.length; index++) {
    if (getBook[index].title === title && getBook[index].id == titleNameAttribute) {
      getBook[index].isCompleted = !getBook[index].isCompleted;
      break;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getBook));
}

function greenButtonHandler(bookParentElement) {
  let book = isCompletedHandler(bookParentElement);
  book.isCompleted = !book.isCompleted;
}

function deleteBook(itemElement) {
  const getBook = pullBookList();
  if (getBook.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < getBook.length; index++) {
    if (getBook[index].id == titleNameAttribut) {
      getBook.splice(index, 1);
      break;
    }
  }
  inputBookIsComplete
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getBook));
}

searchForm.addEventListener("submit", function (event) {
  
  event.preventDefault();
  const getBook = pullBookList();
  if (getBook.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    renderBookElement(getBook);
    return;
  }
  const bookList = SearchBookList(title);
  renderBookElement(bookList);
});

function SearchBookList(title) {
  const getBook = pullBookList();
  if (getBook.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < getBook.length; index++) {
    const tempTitle = getBook[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (getBook[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(getBook[index]);
    }
  }
  return bookList;
}

function resetForm() {
  // reset all form in the html file
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  document.getElementById("searchBookTitle").value = "";
}

