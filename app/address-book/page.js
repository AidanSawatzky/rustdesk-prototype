"use client";
import { useState, useEffect } from "react";

export default function AddressBookPage() {
  const [books, setBooks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("addressBooks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [newBookName, setNewBookName] = useState("");

  const selectedBook = books.find((b) => b.id === selectedBookId);

  useEffect(() => {
    localStorage.setItem("addressBooks", JSON.stringify(books));
  }, [books]);

  const createBook = () => {
    if (!newBookName) return;

    const newBook = {
      id: Date.now(),
      name: newBookName,
      devices: [],
      users: [],
    };

    setBooks([...books, newBook]);
    setNewBookName("");
  };

  const deleteBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
    if (selectedBookId === id) setSelectedBookId(null);
  };

  const updateBook = (updatedBook) => {
    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Address Books
      </h1>
      <p className="text-gray-400 mb-6">
        Organize devices and users into groups
      </p>

      {/* CREATE */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-6 flex gap-2 shadow-lg">
        <input
          className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New address book name..."
          value={newBookName}
          onChange={(e) => setNewBookName(e.target.value)}
        />
        <button
          onClick={createBook}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        
        {/* LEFT PANEL */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg mb-4">Your Address Books</h2>

          {books.length === 0 && (
            <p className="text-gray-500 text-sm">No address books yet</p>
          )}

          {books.map((book) => (
            <div
              key={book.id}
              className={`p-4 rounded-xl mb-3 cursor-pointer transition ${
                selectedBookId === book.id
                  ? "bg-blue-600/20 border border-blue-500"
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
              }`}
              onClick={() => setSelectedBookId(book.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{book.name}</p>
                  <p className="text-xs text-gray-400">
                    {book.devices.length} devices • {book.users.length} users
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBook(book.id);
                  }}
                  className="text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-2">
          {selectedBook ? (
            <BookDetails book={selectedBook} updateBook={updateBook} />
          ) : (
            <div className="text-gray-400">
              Select an address book to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookDetails({ book, updateBook }) {
  const [deviceName, setDeviceName] = useState("");
  const [userName, setUserName] = useState("");

  const addDevice = () => {
    if (!deviceName) return;

    updateBook({
      ...book,
      devices: [...book.devices, { id: Date.now(), name: deviceName }],
    });

    setDeviceName("");
  };

  const addUser = () => {
    if (!userName) return;

    updateBook({
      ...book,
      users: [...book.users, { id: Date.now(), name: userName }],
    });

    setUserName("");
  };

  const removeDevice = (id) => {
    updateBook({
      ...book,
      devices: book.devices.filter((d) => d.id !== id),
    });
  };

  const removeUser = (id) => {
    updateBook({
      ...book,
      users: book.users.filter((u) => u.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">{book.name}</h2>
        <p className="text-gray-400 text-sm">
          {book.devices.length} devices • {book.users.length} users
        </p>
      </div>

      {/* DEVICES */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg">
        <h3 className="text-lg mb-4">Devices</h3>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Device name..."
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <button
            onClick={addDevice}
            className="bg-green-600 hover:bg-green-700 transition px-3 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {book.devices.length === 0 ? (
          <p className="text-gray-500 text-sm">No devices added</p>
        ) : (
          book.devices.map((d) => (
            <div
              key={d.id}
              className="flex justify-between items-center bg-white/5 border border-white/10 px-3 py-2 rounded-lg mb-2 hover:bg-white/10 transition"
            >
              <span className="font-medium">{d.name}</span>
              <button
                onClick={() => removeDevice(d.id)}
                className="text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* USERS */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg">
        <h3 className="text-lg mb-4">Users</h3>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="User name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            onClick={addUser}
            className="bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {book.users.length === 0 ? (
          <p className="text-gray-500 text-sm">No users added</p>
        ) : (
          book.users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center bg-white/5 border border-white/10 px-3 py-2 rounded-lg mb-2 hover:bg-white/10 transition"
            >
              <span className="font-medium">{u.name}</span>
              <button
                onClick={() => removeUser(u.id)}
                className="text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}