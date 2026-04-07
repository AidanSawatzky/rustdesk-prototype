"use client";
import { useState, useEffect } from "react";

export default function RolePage() {
  const [books, setBooks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("roles");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [newBookName, setNewBookName] = useState("");

  const selectedBook = books.find((b) => b.id === selectedBookId);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(books));
  }, [books]);

  const createBook = () => {
    if (!newBookName) return;

    setBooks([
      ...books,
      {
        id: Date.now(),
        name: newBookName,
        devices: [],
        users: [],
      },
    ]);

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
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Roles
        </h1>
        <p className="text-gray-500 text-sm">
          Manage device clusters and user access
        </p>
      </div>

      {/* CREATE */}
      <div className="flex gap-2 bg-[#0b0f14] border border-white/5 rounded-xl p-3">
        <input
          className="flex-1 bg-transparent text-sm outline-none px-2 text-gray-200"
          placeholder="New group..."
          value={newBookName}
          onChange={(e) => setNewBookName(e.target.value)}
        />
        <button
          onClick={createBook}
          className="px-3 py-1 text-xs rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* LEFT PANEL */}
        <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-500 uppercase mb-3">
            Groups
          </p>

          {books.length === 0 && (
            <p className="text-gray-500 text-xs">No groups</p>
          )}

          <div className="space-y-2">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBookId(book.id)}
                className={`p-3 rounded-lg cursor-pointer transition text-sm ${
                  selectedBookId === book.id
                    ? "bg-blue-600/20 border border-blue-500/40"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-200">{book.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {book.devices.length}D • {book.users.length}U
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBook(book.id);
                    }}
                    className="text-gray-500 hover:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-2">
          {selectedBook ? (
            <BookDetails book={selectedBook} updateBook={updateBook} />
          ) : (
            <div className="text-gray-500 text-sm">
              Select a group
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* DETAILS PANEL */
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
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">{book.name}</h2>
        <p className="text-xs text-gray-500">
          {book.devices.length} devices • {book.users.length} users
        </p>
      </div>

      {/* DEVICES */}
      <Panel title="Devices" accent="green">
        <InputRow
          value={deviceName}
          setValue={setDeviceName}
          onAdd={addDevice}
          placeholder="Add device..."
          color="green"
        />

        {book.devices.map((d) => (
          <Row key={d.id} label={d.name} onRemove={() => removeDevice(d.id)} />
        ))}
      </Panel>

      {/* USERS */}
      <Panel title="Users" accent="blue">
        <InputRow
          value={userName}
          setValue={setUserName}
          onAdd={addUser}
          placeholder="Add user..."
          color="blue"
        />

        {book.users.map((u) => (
          <Row key={u.id} label={u.name} onRemove={() => removeUser(u.id)} />
        ))}
      </Panel>
    </div>
  );
}

/* PANEL */
function Panel({ title, children }) {
  return (
    <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* INPUT ROW */
function InputRow({ value, setValue, onAdd, placeholder, color }) {
  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
  };

  return (
    <div className="flex gap-2 mb-2">
      <input
        className="flex-1 bg-transparent text-sm px-2 outline-none border border-white/10 rounded-md"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={onAdd}
        className={`px-3 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 ${colors[color]}`}
      >
        Add
      </button>
    </div>
  );
}

/* ROW */
function Row({ label, onRemove }) {
  return (
    <div className="flex justify-between items-center text-sm px-2 py-1 rounded-md hover:bg-white/5">
      <span className="text-gray-200">{label}</span>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-red-400 text-xs"
      >
        ✕
      </button>
    </div>
  );
}