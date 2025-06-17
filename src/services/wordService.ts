import axios from "axios";
import api from "./api";
export interface Word {
  id: number;
  englishWord: string;
  uzbekWord: string;
  example: string;
  audioPath: string;
  masteryLevel: 'NEW' | 'LEARNING' | 'MASTERED';
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  unitId: number;
  unitName: string;
}

interface WordResponse {
  content: Word[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface CreateWordRequest {
  englishWord: string;
  uzbekWord: string;
  example: string;
  audioPath: string;
  categoryId: number;
  unitId: number;
}

const API_BASE_URL = 'http://64.23.219.188:9090/api';

const wordService = {
  async getWords(page: number, size: number = 10): Promise<WordResponse> {
    try {
      const response = await api.get(`/words`, {
        params: {
          page,
          size
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching words:', error);
      throw error;
    }
  },

  async createWord(wordData: CreateWordRequest): Promise<Word> {
    try {
      const response = await api.post(`/words`, wordData);
      return response.data;
    } catch (error) {
      console.error('Error creating word:', error);
      throw error;
    }
  },

  async updateWord(id: number, wordData: Partial<CreateWordRequest>): Promise<Word> {
    try {
      const response = await api.put(`/words/${id}`, wordData);
      return response.data;
    } catch (error) {
      console.error('Error updating word:', error);
      throw error;
    }
  },

  async deleteWord(id: number): Promise<void> {
    try {
      await api.delete(`/words/${id}`);
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  },

  async getWordById(id: number): Promise<Word> {
    try {
      const response = await api.get(`/words/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching word by ID:', error);
      throw error;
    }
  }
};

export default wordService;