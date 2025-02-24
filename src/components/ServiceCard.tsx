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
import ServiceForm from "./ServiceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ServiceCardProps {
  service: Service;
  onUpdate: (updatedService: Service) => void;
  onDelete: (serviceId: string) => void;
  onDownload: (service: Service) => Promise<void>;
  onPrint: (service: Service) => Promise<void>;
}

export function ServiceCard({ service, onUpdate, onDelete, onDownload, onPrint }: ServiceCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

<<<<<<< HEAD
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Impede que o clique se propague para o container
    action();
  };

=======
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
  const handleUpdate = (updatedService: Service) => {
    onUpdate(updatedService);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        {/* Número do Serviço */}
        <h3 className="font-medium text-sm">#{service.controlNumber}</h3>
        
        {/* Botões de Ação */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
<<<<<<< HEAD
            onClick={(e) => handleButtonClick(e, () => setIsEditDialogOpen(true))}
=======
            onClick={() => setIsEditDialogOpen(true)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
            className="h-6 w-6"
          >
            <Edit className="h-3 w-3" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
<<<<<<< HEAD
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
=======
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este serviço? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
<<<<<<< HEAD
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(service.id);
                  }}
=======
                  onClick={() => onDelete(service.id)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="ghost"
            size="icon"
<<<<<<< HEAD
            onClick={(e) => handleButtonClick(e, () => onDownload(service))}
=======
            onClick={() => onDownload(service)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
            className="h-6 w-6"
          >
            <Download className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
<<<<<<< HEAD
            onClick={(e) => handleButtonClick(e, () => onPrint(service))}
=======
            onClick={() => onPrint(service)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
            className="h-6 w-6"
          >
            <Printer className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
<<<<<<< HEAD
        <DialogContent className="max-w-[600px]" onClick={(e) => e.stopPropagation()}>
=======
        <DialogContent className="max-w-[600px]">
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          <ServiceForm 
            clientId={service.clientId} 
            initialData={service}
            onSubmit={handleUpdate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 