export async function uploadImage(file: File): Promise<string> {
  const CLOUD_NAME = 'di9rvuoun';
  const UPLOAD_PRESET = 'stanza_preset';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Erro no upload');
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('URL não encontrada na resposta');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
}

export async function deleteImage(imageUrl: string) {
  const CLOUD_NAME = 'di9rvuoun';
  const API_KEY = '263712131713479';

  try {
    if (!imageUrl) {
      console.warn('URL da imagem não fornecida');
      return;
    }

    // Verifica se é uma URL do Cloudinary
    if (!imageUrl.includes('cloudinary.com')) {
      console.warn('URL não é do Cloudinary:', imageUrl);
      return;
    }

    // Extrai o public_id da URL do Cloudinary de forma mais segura
    const matches = imageUrl.match(/upload\/(?:v\d+\/)?([^\.]+)/);
    const publicId = matches?.[1];
    
    if (!publicId) {
      console.warn('Não foi possível extrair o public_id da URL:', imageUrl);
      return;
    }

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', API_KEY);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao deletar imagem');
    }

    console.log('Imagem deletada com sucesso:', publicId);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    // Não propaga o erro para não interromper a deleção do serviço
  }
} 