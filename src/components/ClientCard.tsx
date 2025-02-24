<<<<<<< HEAD
import { useState } from 'react';
import { Client } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
=======
import { Client } from "@/types";
import { useNavigate } from "react-router-dom";
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100

interface ClientCardProps {
  client: Client;
  onUpdate: (client: Client) => void;
  onDelete: (id: string) => void;
}

<<<<<<< HEAD
export function ClientCard({ client, onUpdate, onDelete }: ClientCardProps) {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: client.name,
    address: client.address,
    phone: client.phone,
  });

  const handleViewServices = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/client/${client.id}`);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...client,
      ...editForm,
      updatedAt: new Date().toISOString()
    });
    setIsEditDialogOpen(false);
  };

  return (
    <div className="p-4 rounded-lg border hover:border-primary transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{client.name}</h3>
          <p className="text-muted-foreground text-sm">{client.address}</p>
          <p className="text-muted-foreground text-sm">{client.phone}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este cliente? 
                  Esta ação não pode ser desfeita e todos os serviços associados serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(client.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleViewServices}
        className="mt-4 w-full"
      >
        Ver Serviços
      </Button>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <Button type="submit" className="w-full">Salvar Alterações</Button>
          </form>
        </DialogContent>
      </Dialog>
=======
export function ClientCard({ client }: ClientCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/client/${client.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-colors"
    >
      <h3 className="font-medium text-lg">{client.name}</h3>
      <p className="text-muted-foreground text-sm">{client.address}</p>
      <p className="text-muted-foreground text-sm">{client.phone}</p>
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
    </div>
  );
} 