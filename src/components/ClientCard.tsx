import { Client } from "@/types";
import { useNavigate } from "react-router-dom";

interface ClientCardProps {
  client: Client;
  onUpdate: (client: Client) => void;
  onDelete: (id: string) => void;
}

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
    </div>
  );
} 