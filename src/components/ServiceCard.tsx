import { Service } from "@/types";
import { Button } from "./ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreVertical, Pencil, Trash, Printer, Download } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import ServiceForm from "./ServiceForm";
import { Edit, Trash2 } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  onUpdate: (service: Service) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDownload: (service: Service) => Promise<void>;
  onPrint: (service: Service) => Promise<void>;
}

export function ServiceCard({ service, onUpdate, onDelete, onDownload, onPrint }: ServiceCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleUpdate = async (updatedService: Service) => {
    try {
      await onUpdate({
        ...updatedService,
        id: service.id,
        clientId: service.clientId,
        createdAt: service.createdAt
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  return (
    <>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
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

      <div className="mt-2 flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(service.id);
          }}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(service);
          }}
        >
          <Download className="h-3 w-3" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onPrint(service);
          }}
        >
          <Printer className="h-3 w-3" />
        </Button>
      </div>
    </>
  );
} 
