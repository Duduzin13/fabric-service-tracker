export async function uploadImage(file: File): Promise<string> {
  const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Erro ao fazer upload');
    }
    
    // Retorna a URL direta da imagem
    return data.data.display_url;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
}

export async function deleteImage(imageUrl: string) {
  const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  
  try {
    // Extrai o ID da imagem da URL
    const imageId = imageUrl.split('/').pop()?.split('.')[0];
    
    if (!imageId) {
      throw new Error('ID da imagem não encontrado');
    }

    const response = await fetch(`https://api.imgbb.com/1/delete/${imageId}?key=${API_KEY}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar imagem');
    }

    console.log('Imagem deletada com sucesso:', imageId);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
  }
} 