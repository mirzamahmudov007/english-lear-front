import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Search, Filter, Grid3X3, Sparkles, TrendingUp, Users, Calendar } from 'lucide-react';
import { categoryService, Category } from '../../services/categoryService';

const getRandomGradient = () => {
  const gradients = [
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
    'bg-gradient-to-br from-cyan-400 to-cyan-600',
    'bg-gradient-to-br from-emerald-400 to-emerald-600',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const getIconComponent = (iconPath: string) => {
  // Simple icon mapping - you can expand this based on your needs
  const iconMap: { [key: string]: JSX.Element } = {
    'food': <span className="text-2xl">🍕</span>,
    'travel': <span className="text-2xl">✈️</span>,
    'business': <span className="text-2xl">💼</span>,
    'education': <span className="text-2xl">📚</span>,
    'health': <span className="text-2xl">🏥</span>,
    'technology': <span className="text-2xl">💻</span>,
    'sports': <span className="text-2xl">⚽</span>,
    'music': <span className="text-2xl">🎵</span>,
    'art': <span className="text-2xl">🎨</span>,
    'nature': <span className="text-2xl">🌿</span>,
  };
  
  return iconMap[iconPath.toLowerCase()] || <Grid3X3 className="w-6 h-6 text-white" />;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', iconPath: '' });
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchCategories = async (page: number) => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories(page);
      setCategories(response.content);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Kategoriyalarni yuklashda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.createCategory(newCategory);
      setNewCategory({ name: '', description: '', iconPath: '' });
      setIsCreateModalOpen(false);
      fetchCategories(currentPage);
    } catch (err) {
      setError('Kategoriya yaratishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      await categoryService.updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
        iconPath: editingCategory.iconPath
      });
      setIsEditModalOpen(false);
      setEditingCategory(null);
      fetchCategories(currentPage);
    } catch (err) {
      setError('Kategoriyani yangilashda xatolik yuz berdi');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kategoriyani o\'chirishni xohlaysizmi?')) return;
    
    try {
      await categoryService.deleteCategory(id);
      fetchCategories(currentPage);
    } catch (err) {
      setError('Kategoriyani o\'chirishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.description.toLowerCase().includes(search.toLowerCase())
  );

  const iconOptions = [
    { value: 'food', label: '🍕 Oziq-ovqat', emoji: '🍕' },
    { value: 'travel', label: '✈️ Sayohat', emoji: '✈️' },
    { value: 'business', label: '💼 Biznes', emoji: '💼' },
    { value: 'education', label: '📚 Ta\'lim', emoji: '📚' },
    { value: 'health', label: '🏥 Sog\'liq', emoji: '🏥' },
    { value: 'technology', label: '💻 Texnologiya', emoji: '💻' },
    { value: 'sports', label: '⚽ Sport', emoji: '⚽' },
    { value: 'music', label: '🎵 Musiqa', emoji: '🎵' },
    { value: 'art', label: '🎨 San\'at', emoji: '🎨' },
    { value: 'nature', label: '🌿 Tabiat', emoji: '🌿' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Kategoriyalar</h1>
              <p className="text-purple-100 text-lg">So'zlarni kategoriyalar bo'yicha tartibga soling</p>
              
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Grid3X3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{categories.length}</p>
                    <p className="text-purple-100 text-sm">Kategoriyalar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-purple-100 text-sm">So'zlar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-purple-100 text-sm">Faollik</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi kategoriya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Kategoriya nomi bo'yicha qidiring..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-80 pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          <button className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kategoriyalar topilmadi</h3>
              <p className="text-gray-600">Yangi kategoriya yaratish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            filteredCategories.map((category) => {
              const gradient = getRandomGradient();
              
              return (
                <div 
                  key={category.id} 
                  className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        {getIconComponent(category.iconPath)}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button 
                            className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(category.createdAt)}</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
                        Faol
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Kategoriya
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategoriya</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tavsif</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Yaratilgan</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Yangilangan</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Grid3X3 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Kategoriyalar topilmadi</h3>
                      <p className="text-gray-600">Yangi kategoriya yaratish uchun yuqoridagi tugmani bosing</p>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => {
                    const gradient = getRandomGradient();
                    
                    return (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center shadow-md`}>
                              {getIconComponent(category.iconPath)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {category.name}
                              </div>
                              <div className="text-xs text-gray-500">ID: {category.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-gray-600 max-w-xs truncate">{category.description}</p>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(category.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(category.updatedAt)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <div className="flex items-center space-x-2 justify-end">
                            <button
                              className="p-2 rounded-xl hover:bg-purple-50 transition-colors group/btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(category);
                                setIsEditModalOpen(true);
                              }}
                              title="Tahrirlash"
                            >
                              <Edit className="w-5 h-5 text-gray-400 group-hover/btn:text-purple-500" />
                            </button>
                            <button 
                              className="p-2 rounded-xl hover:bg-red-50 transition-colors group/btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category.id);
                              }}
                              title="O'chirish"
                            >
                              <Trash2 className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-6 py-3 border border-gray-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Oldingi
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + Math.max(0, currentPage - 2);
              if (pageNum >= totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-12 h-12 rounded-2xl font-medium transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-6 py-3 border border-gray-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Keyingi
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Yangi kategoriya yaratish</h2>
              <p className="text-gray-600">So'zlar uchun yangi kategoriya qo'shing</p>
            </div>
            
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategoriya nomi
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masalan: Oziq-ovqat"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Kategoriya haqida qisqacha ma'lumot..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, iconPath: option.value }))}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        newCategory.iconPath === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={option.label}
                    >
                      <span className="text-xl">{option.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kategoriyani tahrirlash</h2>
              <p className="text-gray-600">Kategoriya ma'lumotlarini yangilang</p>
            </div>
            
            <form onSubmit={handleEditCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategoriya nomi
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEditingCategory(prev => prev ? ({ ...prev, iconPath: option.value }) : null)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        editingCategory.iconPath === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={option.label}
                    >
                      <span className="text-xl">{option.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;