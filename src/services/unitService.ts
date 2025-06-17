import api from "./api";


export interface Unit {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  wordCount: number;
  words: any[] | null;
}

export interface UnitResponse {
  content: Unit[];
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

export interface CreateUnitRequest {
  name: string;
  description: string;
}

export const unitService = {
  getUnits: async (page: number = 0, size: number = 10): Promise<UnitResponse> => {
    const response = await api.get(`/units?page=${page}&size=${size}`);
    return response.data;
  },

  getUnitById: async (id: number): Promise<Unit> => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  createUnit: async (unit: CreateUnitRequest): Promise<Unit> => {
    const response = await api.post(`/units`, unit);
    return response.data;
  },

  deleteUnit: async (id: number): Promise<void> => {
    await api.delete(`/units/${id}`);
  }
}; 