import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { UserFormData, User } from "../types/type";

export const initialFormData: UserFormData = {
  nom: "",
  email: "",
  age: 0,
};

export const useUsersForm = () => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const isEditMode = editingUser !== null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(
      (prev) =>
      ({
        ...prev,
        [name]: type == "number" ? parseInt(value) || 0 : value,
      } as UserFormData)
    );
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    onSubmit: () => void
  ) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:4004/editUser/${editingUser.id}`,
          formData
        );
        console.log("Utilisateur modifié avec succès !");
      } else {
        await axios.post("http://localhost:4004/addUser", formData);
        console.log("Utilisateur ajouté avec succès !");
      }

      setFormData(initialFormData);
      setEditingUser(null);
      onSubmit?.();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur: ", error);
    }
  };

  const handleEdit = (user: User, onEdit: () => void) => {
    setEditingUser(user);
    setFormData(user);
    onEdit?.();
  };

  const handleDelete = async (id: string, onDelete: () => void) => {
    try {
      await axios.delete(`http://localhost:4004/deleteUser/${id}`);
      console.log("Utilisateur supprimé avec succès !");
      onDelete?.();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'utilisateur : ",
        error
      );
    }
  };

  return {
    formData,
    handleChange,
    handleDelete,
    handleEdit,
    handleSubmit,
    setFormData,
    editingUser,
    setEditingUser,
    isEditMode,
  };
};
