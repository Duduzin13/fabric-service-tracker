import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex gap-4 mb-6">
      <Button 
        variant={location.pathname === "/" ? "default" : "outline"}
        onClick={() => navigate("/")}
      >
        Clientes
      </Button>
      <Button 
        variant={location.pathname.includes("/services") ? "default" : "outline"}
        onClick={() => navigate("/services")}
      >
        Serviços
      </Button>
    </div>
  );
} 