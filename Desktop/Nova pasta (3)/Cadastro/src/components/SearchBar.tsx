const handleSearch = (searchTerm: string) => {
  // Converte o termo de busca e o número do serviço para números
  // para comparação numérica, ou mantém como string para outros casos
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return services.filter(service => {
    const serviceNumber = service.number.toString().padStart(2, '0');
    return serviceNumber.includes(normalizedSearchTerm) ||
           service.description.toLowerCase().includes(normalizedSearchTerm);
  });
}; 
