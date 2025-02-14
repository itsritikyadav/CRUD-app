"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react"; // Add useEffect here


interface User {
  id: number;
  name: string;
}

export default function Home() {
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // State to control Add User modal visibility

  // Fetch users
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    onError: () => setAlert({ type: "error", message: "Failed to fetch users!" }),
  });

  // Add User
  const addUserMutation = useMutation({
    mutationFn: async (newUser: User) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to add user");
      return res.json();
    },
    onSuccess: (newUser) => {
      setAlert({ type: "success", message: "User added successfully!" });

      // Generate a unique ID
      const uniqueId = Date.now();

      // Update UI Optimistically
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
        oldUsers ? [...oldUsers, { ...newUser, id: uniqueId }] : [{ ...newUser, id: uniqueId }]
      );

      // Close the modal and reset input
      setIsAddUserModalOpen(false);
      setNewUserName("");
    },
    onError: () => setAlert({ type: "error", message: "Failed to add user!" }),
  });

  // Update User
  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      if (updatedUser.id > 10) { // JSONPlaceholder has only 10 users
        return updatedUser;
      }

      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("Failed to update user");

      return res.json();
    },
    onSuccess: (updatedUser) => {
      setAlert({ type: "success", message: "User updated successfully!" });

      // Update UI Optimistically
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
        oldUsers ? oldUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)) : []
      );

      // Reset edit state after updating
      setEditUser(null);
      setNewUserName("");
    },
    onError: () => setAlert({ type: "error", message: "Failed to update user!" }),
  });

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: (_, userId) => {
      setAlert({ type: "success", message: "User deleted successfully!" });
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
        oldUsers ? oldUsers.filter((user) => user.id !== userId) : []
      );
      setDeleteUserId(null);
    },
    onError: () => setAlert({ type: "error", message: "Failed to delete user!" }),
  });

  // Handle Add User Submission
  const handleAddUser = () => {
    if (!newUserName.trim()) {
      setAlert({ type: "error", message: "User name cannot be empty!" });
      return;
    }
    addUserMutation.mutate({ id: Date.now(), name: newUserName });
  };

  // Handle Update User Submission
  const handleUpdateUser = () => {
    if (!editUser || !editUser.name.trim()) {
      setAlert({ type: "error", message: "User name cannot be empty!" });
      return;
    }
    updateUserMutation.mutate(editUser);
  };

  // UseEffect to automatically dismiss the alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 2000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alert]);



  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-blue-600">User List</h2>
      <button onClick={() => setIsAddUserModalOpen(true)}className="btn btn-primary">Add User</button>
      </div>

{/* Alerts for success/error */}
{/* Alerts for success/error */}
{/* Alerts for success/error */}
{alert && (
  <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 p-4`}>
    <div
      className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"} 
                  inline-block bg-white text-black p-2 rounded-md shadow-lg 
                  animate-slideDown`}
    >
      <span>{alert.message}</span>
      <button onClick={() => setAlert(null)} className="btn btn-sm btn-circle btn-ghost ml-2">✕</button>
    </div>
  </div>
)}









      {isLoading && <p className="text-gray-600">Loading users...</p>}
      {error && <p className="text-red-500">Error fetching users!</p>}


      <ul className="space-y-2">
        {users?.map((user) => (
          <li key={user.id} className="p-3 bg-gray-200 rounded-md flex justify-between">
            <span className="text-gray-800">{user.name}</span>
            <div>
              <button onClick={() => setEditUser(user)} className="btn btn-sm btn-warning mr-2">Update</button>
              <button onClick={() => setDeleteUserId(user.id)} className="btn btn-sm btn-error">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold">Add New User</h2>
            <input
              type="text"
              placeholder="Enter user name"
              className="input input-bordered w-full mb-2"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <div className="modal-action">
              <button onClick={handleAddUser} className="btn btn-success">Save</button>
              <button onClick={() => setIsAddUserModalOpen(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold">Edit User</h2>
            <input
              type="text"
              className="input input-bordered w-full mt-2"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <div className="modal-action">
              <button onClick={handleUpdateUser} className="btn btn-success">Save</button>
              <button onClick={() => setEditUser(null)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-action">
              <button onClick={() => deleteUserMutation.mutate(deleteUserId)} className="btn btn-error">Yes, Delete</button>
              <button onClick={() => setDeleteUserId(null)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
