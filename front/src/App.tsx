import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Edit, Trash } from "lucide-react";
import { useUsers } from "./hooks/useUsers";
import { initialFormData, useUsersForm } from "./hooks/useUsersForm";

function App() {
  const { users, fetchUsers } = useUsers();
  const {
    formData,
    handleChange,
    handleDelete,
    handleEdit,
    handleSubmit,
    setFormData,
    setEditingUser,
    isEditMode,
    editingUser,
  } = useUsersForm();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl font-bold">
            Liste des utilisateurs
          </CardTitle>
          <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          >
            <Button
              variant="outline"
              onClick={() => {
                setFormData(initialFormData);
                setEditingUser(null);
                setIsDialogOpen(true);
              }}
            >
              Ajouter un utilisateur
            </Button>
            <DialogContent className="sm:max-w-[425px]">
              {isDialogOpen && (
                <form
                  onSubmit={(e) =>
                    handleSubmit(e, () => {
                      setIsDialogOpen(false);
                      setEditingUser(null);
                      fetchUsers();
                    })
                  }
                >
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser
                        ? "Modifier"
                        : "Ajouter"}{" "}
                      un utilisateur
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 mt-6">
                    <div className="grid gap-3">
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        name="nom"
                        placeholder="John Doe"
                        value={formData.nom}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">
                        Adresse email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="utilisateur@exemple.fr"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="age">Âge</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="18"
                        min={0}
                        step={1}
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      onClick={() => {
                        setIsDialogOpen(false);
                      }}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      {isEditMode
                        ? "Modifier"
                        : "Ajouter"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Fonctionnalités</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user, () => setIsDialogOpen(true))}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDelete(user.id, () => {
                          fetchUsers();
                        })
                      }
                    >
                      <Trash color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
export default App;
