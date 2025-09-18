import axios from "axios";
import { useState, useEffect } from "react";
import type { User } from "../types/type";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:4004/getUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs : ",
        error
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, fetchUsers };
};