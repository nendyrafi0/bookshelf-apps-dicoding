document.addEventListener("DOMContentLoaded", function () {
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const editBookForm = document.getElementById("editBookForm");
    const overlay = document.getElementById("overlay");

    inputBookForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

    searchBookForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchBook();
    });

    editBookForm.addEventListener("submit", function (e) {
        e.preventDefault();
        saveEditedBook();
    });

    const closeEditFormButton = document.getElementById("closeEditForm");
    closeEditFormButton.addEventListener("click", function () {
        closeEditForm();
    });

    displayBooks();

    function addBook() {
        const id = generateUniqueId();
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = parseInt(document.getElementById("inputBookYear").value);
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const book = {
            id: id,
            title: title,
            author: author,
            year: year,
            isComplete: isComplete,
        };

        let books = getBooksFromStorage();

        books.push(book);
        saveBooksToStorage(books);
        displayBooks();
        inputBookForm.reset();
    }

    function generateUniqueId() {
        return new Date().getTime(); 
    }

    function searchBook() {
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        let books = getBooksFromStorage();
        const searchResult = books.filter((book) =>
            book.title.toLowerCase().includes(searchTitle)
        );
        displayBooks(searchResult);
    }

    function displayBooks(booksToShow = null) {
        const books = booksToShow || getBooksFromStorage();

        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        books.forEach(function (book, index) {
            const newBook = createBookElement(book, index);
            if (book.isComplete) {
                completeBookshelfList.appendChild(newBook);
            } else {
                incompleteBookshelfList.appendChild(newBook);
            }
        });
    }

    function createBookElement(book, index) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");

        const bookTitle = document.createElement("h3");
        bookTitle.innerText = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerText = `Penulis: ${book.author}`;

        const bookYear = document.createElement("p");
        bookYear.innerText = `Tahun: ${book.year}`;

        const actionContainer = document.createElement("div");
        actionContainer.classList.add("action");

        const toggleButton = document.createElement("button");
        toggleButton.classList.add("green");
        toggleButton.innerText = book.isComplete
            ? "Belum selesai di Baca"
            : "Selesai dibaca";
        toggleButton.addEventListener("click", function () {
            toggleBookStatus(index);
        });

        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.addEventListener("click", function () {
            openEditForm(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click", function () {
            confirmDeleteBook(index);
        });

        actionContainer.appendChild(toggleButton);
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);

        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);
        bookItem.appendChild(actionContainer);

        return bookItem;
    }

    function toggleBookStatus(index) {
        let books = getBooksFromStorage();
        books[index].isComplete = !books[index].isComplete;
        saveBooksToStorage(books);
        displayBooks();
    }

    function openEditForm(index) {
        const books = getBooksFromStorage();
        const book = books[index];

        const editFormTitle = document.getElementById("editFormTitle");
        const editFormAuthor = document.getElementById("editFormAuthor");
        const editFormYear = document.getElementById("editFormYear");
        const editFormIsComplete = document.getElementById("editFormIsComplete");

        editFormTitle.value = book.title;
        editFormAuthor.value = book.author;
        editFormYear.value = book.year;
        editFormIsComplete.checked = book.isComplete;

        overlay.dataset.selectedIndex = index;

        overlay.style.display = "flex";
    }

    function saveEditedBook() {
        const editFormTitle = document.getElementById("editFormTitle").value;
        const editFormAuthor = document.getElementById("editFormAuthor").value;
        const editFormYear = parseInt(document.getElementById("editFormYear").value);
        const editFormIsComplete =
            document.getElementById("editFormIsComplete").checked;

        const editedBook = {
            title: editFormTitle,
            author: editFormAuthor,
            year: editFormYear,
            isComplete: editFormIsComplete,
        };

        const selectedIndex = overlay.dataset.selectedIndex;
        let books = getBooksFromStorage();
        books[selectedIndex] = editedBook;
        saveBooksToStorage(books);
        displayBooks();
        closeEditForm();
    }

    function confirmDeleteBook(index) {
        const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
        if (confirmation) {
            deleteBook(index);
        }
    }

    function deleteBook(index) {
        let books = getBooksFromStorage();
        books.splice(index, 1);
        saveBooksToStorage(books);
        displayBooks();
    }

    function saveBooksToStorage(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function getBooksFromStorage() {
        return JSON.parse(localStorage.getItem("books")) || [];
    }

    function closeEditForm() {
        overlay.style.display = "none";
    }
});
