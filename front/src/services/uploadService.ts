const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface UploadImageResponse {
  url: string;
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('react-delicious-token');
  
  if (!token) {
    throw new Error('Token não encontrado. Faça login novamente.');
  }

  const response = await fetch(`${baseURL}/api/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao fazer upload da imagem';
    
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

