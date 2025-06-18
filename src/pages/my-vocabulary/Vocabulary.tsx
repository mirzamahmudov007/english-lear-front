import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, BookOpen, Star, Volume2, Edit, Trash2, Calendar, TrendingUp, Users, Target, Play, Pause } from 'lucide-react';
import { wordService, Word } from '../../services/wordService';
import { categoryService, Category } from '../../services/categoryService';
import { unitService, Unit } from '../../services/unitService';

const getMasteryColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'learning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'practiced': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'mastered': return 'bg-green-50 text-green-700 border-green-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getMasteryIcon = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'new': return '🆕';
    case 'learning': return '📚';
    case 'practiced': return '💪';
    case 'mastered': return '🏆';
    default: return '📝';
  }
};

const Vocabulary: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [newWord, setNewWord] = useState({
    englishWord: '',
    uzbekWord: '',
    example: '',
    audioPath: '',
    categoryId: 0,
    unitId: 0
  });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [filterUnit, setFilterUnit] = useState<number | null>(null);
  const [filterMastery, setFilterMastery] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const fetchWords = async (page: number) => {
    try {
      setLoading(true);
      const response = await wordService.getWords(page, 12);
      setWords(response.content);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('So\'zlarni yuklashda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories(0, 100);
      setCategories(response.content);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await unitService.getUnits(0, 100);
      setUnits(response.content);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    }
  };

  useEffect(() => {
    fetchWords(currentPage);
    fetchCategories();
    fetchUnits();
  }, [currentPage]);

  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await wordService.createWord(newWord);
      setNewWord({
        englishWord: '',
        uzbekWord: '',
        example: '',
        audioPath: '',
        categoryId: 0,
        unitId: 0
      });
      setIsCreateModalOpen(false);
      fetchWords(currentPage);
    } catch (err) {
      setError('So\'z yaratishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const handleEditWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord) return;
    
    try {
      await wordService.updateWord(editingWord.id, {
        englishWord: editingWord.englishWord,
        uzbekWord: editingWord.uzbekWord,
        example: editingWord.example,
        audioPath: editingWord.audioPath,
        categoryId: editingWord.categoryId,
        unitId: editingWord.unitId
      });
      setIsEditModalOpen(false);
      setEditingWord(null);
      fetchWords(currentPage);
    } catch (err) {
      setError('So\'zni yangilashda xatolik yuz berdi');
      console.error(err);
    }
  };

  const handleDeleteWord = async (id: number) => {
    if (!confirm('Bu so\'zni o\'chirishni xohlaysizmi?')) return;
    
    try {
      await wordService.deleteWord(id);
      fetchWords(currentPage);
    } catch (err) {
      setError('So\'zni o\'chirishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const playAudio = (wordId: number, audioPath: string) => {
    if (playingAudio === wordId) {
      setPlayingAudio(null);
      return;
    }

    setPlayingAudio(wordId);
    // Simulate audio playing
    setTimeout(() => {
      setPlayingAudio(null);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = word.englishWord.toLowerCase().includes(search.toLowerCase()) ||
                         word.uzbekWord.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || word.categoryId === filterCategory;
    const matchesUnit = !filterUnit || word.unitId === filterUnit;
    const matchesMastery = !filterMastery || word.masteryLevel.toLowerCase() === filterMastery.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesUnit && matchesMastery;
  });

  const masteryStats = {
    new: words.filter(w => w.masteryLevel === 'NEW').length,
    learning: words.filter(w => w.masteryLevel === 'LEARNING').length,
    practiced: words.filter(w => w.masteryLevel === 'PRACTICED').length,
    mastered: words.filter(w => w.masteryLevel === 'MASTERED').length,
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mening so'zlarim</h1>
              <p className="text-emerald-100 text-lg">O'rganayotgan so'zlaringizni boshqaring va rivojlantiring</p>
              
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{words.length}</p>
                    <p className="text-emerald-100 text-sm">Jami so'zlar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{masteryStats.mastered}</p>
                    <p className="text-emerald-100 text-sm">O'rganilgan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round((masteryStats.mastered / Math.max(words.length, 1)) * 100)}%</p>
                    <p className="text-emerald-100 text-sm">Muvaffaqiyat</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi so'z</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
              🆕
            </div>
            <span className="text-3xl font-bold text-blue-700">{masteryStats.new}</span>
          </div>
          <h3 className="font-semibold text-blue-800 mb-1">Yangi so'zlar</h3>
          <p className="text-sm text-blue-600">Hali o'rganilmagan</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-2xl">
              📚
            </div>
            <span className="text-3xl font-bold text-yellow-700">{masteryStats.learning}</span>
          </div>
          <h3 className="font-semibold text-yellow-800 mb-1">O'rganilmoqda</h3>
          <p className="text-sm text-yellow-600">Jarayonda</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl">
              💪
            </div>
            <span className="text-3xl font-bold text-orange-700">{masteryStats.practiced}</span>
          </div>
          <h3 className="font-semibold text-orange-800 mb-1">Mashq qilingan</h3>
          <p className="text-sm text-orange-600">Takrorlash kerak</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <span className="text-3xl font-bold text-green-700">{masteryStats.mastered}</span>
          </div>
          <h3 className="font-semibold text-green-800 mb-1">O'rganilgan</h3>
          <p className="text-sm text-green-600">Mukammal</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="So'z qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-80 pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory || ''}
              onChange={e => setFilterCategory(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Barcha kategoriyalar</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <select
              value={filterUnit || ''}
              onChange={e => setFilterUnit(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Barcha bo'limlar</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>

            <select
              value={filterMastery || ''}
              onChange={e => setFilterMastery(e.target.value || null)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Barcha darajalar</option>
              <option value="NEW">Yangi</option>
              <option value="LEARNING">O'rganilmoqda</option>
              <option value="PRACTICED">Mashq qilingan</option>
              <option value="MASTERED">O'rganilgan</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-white text-emerald-600 shadow-sm' 
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
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWords.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">So'zlar topilmadi</h3>
              <p className="text-gray-600">Yangi so'z qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            filteredWords.map((word) => (
              <div 
                key={word.id} 
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${getMasteryColor(word.masteryLevel)}`}>
                      <span className="mr-1">{getMasteryIcon(word.masteryLevel)}</span>
                      {word.masteryLevel}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center space-x-1">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingWord(word);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWord(word.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                        {word.englishWord}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(word.id, word.audioPath);
                        }}
                        className="p-1 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        {playingAudio === word.id ? (
                          <Pause className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-gray-400 hover:text-emerald-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 font-medium mb-3">
                      {word.uzbekWord}
                    </p>
                  </div>
                  
                  {word.example && (
                    <div className="mb-4 p-3 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
                      <p className="text-sm text-gray-700 italic">
                        "{word.example}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(word.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Kategoriya</span>
                      <span className="text-sm font-medium text-gray-700">{word.categoryName}</span>
                    </div>
                    <div className="flex flex-col space-y-1 text-right">
                      <span className="text-xs text-gray-500">Bo'lim</span>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{word.unitName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
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
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">So'z</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarjima</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Misol</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Daraja</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategoriya</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bo'lim</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">So'zlar topilmadi</h3>
                      <p className="text-gray-600">Yangi so'z qo'shish uchun yuqoridagi tugmani bosing</p>
                    </td>
                  </tr>
                ) : (
                  filteredWords.map((word) => (
                    <tr key={word.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {word.englishWord}
                          </div>
                          <button
                            onClick={() => playAudio(word.id, word.audioPath)}
                            className="p-1 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            {playingAudio === word.id ? (
                              <Pause className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-gray-400 hover:text-emerald-600" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-600 font-medium">{word.uzbekWord}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-600 max-w-xs truncate italic">"{word.example}"</p>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${getMasteryColor(word.masteryLevel)}`}>
                          <span className="mr-1">{getMasteryIcon(word.masteryLevel)}</span>
                          {word.masteryLevel}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-gray-600">{word.categoryName}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-600 max-w-xs truncate block">{word.unitName}</span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center space-x-2 justify-end">
                          <button
                            className="p-2 rounded-xl hover:bg-emerald-50 transition-colors group/btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingWord(word);
                              setIsEditModalOpen(true);
                            }}
                            title="Tahrirlash"
                          >
                            <Edit className="w-5 h-5 text-gray-400 group-hover/btn:text-emerald-500" />
                          </button>
                          <button 
                            className="p-2 rounded-xl hover:bg-red-50 transition-colors group/btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWord(word.id);
                            }}
                            title="O'chirish"
                          >
                            <Trash2 className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
                      ? 'bg-emerald-500 text-white shadow-lg'
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
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Yangi so'z qo'shish</h2>
              <p className="text-gray-600">Lug'atingizga yangi so'z qo'shing</p>
            </div>
            
            <form onSubmit={handleCreateWord} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Inglizcha so'z
                  </label>
                  <input
                    type="text"
                    value={newWord.englishWord}
                    onChange={(e) => setNewWord(prev => ({ ...prev, englishWord: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masalan: apple"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    O'zbekcha tarjima
                  </label>
                  <input
                    type="text"
                    value={newWord.uzbekWord}
                    onChange={(e) => setNewWord(prev => ({ ...prev, uzbekWord: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masalan: olma"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Misol jumla
                </label>
                <textarea
                  value={newWord.example}
                  onChange={(e) => setNewWord(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Masalan: I eat an apple every day."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    value={newWord.categoryId}
                    onChange={(e) => setNewWord(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value={0}>Kategoriyani tanlang</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bo'lim
                  </label>
                  <select
                    value={newWord.unitId}
                    onChange={(e) => setNewWord(prev => ({ ...prev, unitId: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value={0}>Bo'limni tanlang</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Audio fayl yo'li (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={newWord.audioPath}
                  onChange={(e) => setNewWord(prev => ({ ...prev, audioPath: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Audio fayl yo'li"
                />
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingWord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">So'zni tahrirlash</h2>
              <p className="text-gray-600">So'z ma'lumotlarini yangilang</p>
            </div>
            
            <form onSubmit={handleEditWord} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Inglizcha so'z
                  </label>
                  <input
                    type="text"
                    value={editingWord.englishWord}
                    onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, englishWord: e.target.value }) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    O'zbekcha tarjima
                  </label>
                  <input
                    type="text"
                    value={editingWord.uzbekWord}
                    onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, uzbekWord: e.target.value }) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Misol jumla
                </label>
                <textarea
                  value={editingWord.example}
                  onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, example: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    value={editingWord.categoryId}
                    onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, categoryId: Number(e.target.value) }) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bo'lim
                  </label>
                  <select
                    value={editingWord.unitId}
                    onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, unitId: Number(e.target.value) }) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Audio fayl yo'li
                </label>
                <input
                  type="text"
                  value={editingWord.audioPath}
                  onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, audioPath: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingWord(null);
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

export default Vocabulary;