import api from "./api";

export interface Word {
  id: number;
  englishWord: string;
  uzbekWord: string;
  example: string;
  audioPath: string;
  masteryLevel: 'NEW' | 'LEARNING' | 'PRACTICED' | 'MASTERED';
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  unitId: number;
  unitName: string;
}

export interface WordResponse {
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

export interface CreateWordRequest {
  englishWord: string;
  uzbekWord: string;
  example: string;
  audioPath: string;
  categoryId: number;
  unitId: number;
}

export const wordService = {
  getWords: async (page: number = 0, size: number = 10): Promise<WordResponse> => {
    const response = await api.get(`/words?page=${page}&size=${size}`);
    return response.data;
  },

  getWordById: async (id: number): Promise<Word> => {
    const response = await api.get(`/words/${id}`);
    return response.data;
  },

  createWord: async (word: CreateWordRequest): Promise<Word> => {
    const response = await api.post(`/words`, word);
    return response.data;
  },

  updateWord: async (id: number, word: CreateWordRequest): Promise<Word> => {
    const response = await api.put(`/words/${id}`, word);
    return response.data;
  },

  deleteWord: async (id: number): Promise<void> => {
    await api.delete(`/words/${id}`);
  }
};