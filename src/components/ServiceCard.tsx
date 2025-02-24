import { useState } from 'react';
import { Service } from '@/types';
import { Download, Edit, Trash2, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  onUpdate: (service: Service) => void;
  onDelete: (id: string) => void;
  onDownload: (service: Service) => void;
  onPrint: (service: Service) => void;
}

export function ServiceCard({ service, onUpdate, onDelete, onDownload, onPrint }: ServiceCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedService, setEditedService] = useState(service);

  const handleUpdate = () => {
    onUpdate(editedService);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="mt-2 flex gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-6 w-6">
            <Edit className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Serviço
              </label>
              <input
                type="text"
                value={editedService.type}
                onChange={(e) =>
                  setEditedService({ ...editedService, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Controle
              </label>
              <input
                type="text"
                value={editedService.controlNumber}
                onChange={(e) =>
                  setEditedService({
                    ...editedService,
                    controlNumber: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                value={editedService.description}
                onChange={(e) =>
                  setEditedService({
                    ...editedService,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-6 w-6">
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline">Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(service.id)}
            >
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onDownload(service)}
      >
        <Download className="h-3 w-3" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onPrint(service)}
      >
        <Printer className="h-3 w-3" />
      </Button>
    </div>
  );
} 
