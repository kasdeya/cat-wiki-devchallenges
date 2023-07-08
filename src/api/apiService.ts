import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api.thecatapi.com/v1';

interface Breed {
  id: string;
  name: string;
  description: string;
}

interface Image {
  id: string;
  url: string;
}

interface ApiService {
  getBreeds(): Promise<AxiosResponse<Breed[]>>;
  getImagesFromBreed(breed: string): Promise<AxiosResponse<Image[]>>;
  getSingleImage(breed: string): Promise<AxiosResponse<Image[]>>;
}

const apiService: ApiService = {
  getBreeds() {
    return axios.get<Breed[]>(`${API_BASE_URL}/breeds`);
  },
  getSingleImage(breed) {
    return axios.get<Image[]>(
      `${API_BASE_URL}/images/search?limit=1&breed_ids=${breed}&api_key=live_V5RPTPMFqqYGx89ovzKtR5i2o2gLp1LBS7CqkFpKt4uyRymOdaJTwAducW6Kc2er`
    );
  },
  getImagesFromBreed(breed) {
    return axios.get<Image[]>(
      `${API_BASE_URL}/images/search?limit=10&breed_ids=${breed}&api_key=live_V5RPTPMFqqYGx89ovzKtR5i2o2gLp1LBS7CqkFpKt4uyRymOdaJTwAducW6Kc2er`
    );
  },
};

export default apiService;