// ClothesService.js

import axios from "axios";

const CLOTHES_API_BASE_URL = "http://localhost:8080/clothes";

class ClothesService {
  getClothes() {
    return axios.get(CLOTHES_API_BASE_URL);
  }
}

export default new ClothesService(); // Export an instance of the class
