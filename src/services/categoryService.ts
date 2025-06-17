import api from "./api";

export interface Category {
  id: number;
  name: string;
  description: string;
  iconPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  content: Category[];
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

export interface CreateCategoryRequest {
  name: string;
  description: string;
  iconPath: string;
}

export const categoryService = {
  getCategories: async (page: number = 0, size: number = 10): Promise<CategoryResponse> => {
    const response = await api.get(`/categories?page=${page}&size=${size}`);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post(`/categories`, category);
    return response.data;
  },

  updateCategory: async (id: number, category: CreateCategoryRequest): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};