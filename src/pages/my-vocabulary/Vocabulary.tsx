import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Search, Filter, BookOpen, Volume2, Check, X, ChevronDown } from 'lucide-react';
import  wordService  from './../../services/wordService';
import { categoryService } from '../../services/categoryService';
import { unitService } from '../../services/unitService';

interface Word {
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

interface Category {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
}

const masteryLevels = [
  { value: 'NEW', label: 'Yangi', color: 'bg-gray-100 text-gray-800' },
  { value: 'LEARNING', label: 'O\'rganilmoqda', color: 'bg-blue-100 text-blue-800' },
  { value: 'MASTERED', label: 'O\'zlashtirildi', color: 'bg-green-100 text-green-800' },
];

const Vocabulary: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedMastery, setSelectedMastery] = useState<string | null>(null);
  const [isMasteryDropdownOpen, setIsMasteryDropdownOpen] = useState(false);

  const fetchWords = async (page: number) => {
    try {
      setLoading(true);
      const response = await wordService.getWords(page, 10);
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
      const response = await categoryService.getCategories(0);
      setCategories(response.content);
    } catch (err) {
      console.error('Kategoriyalarni yuklashda xatolik:', err);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await unitService.getUnits(0);
      setUnits(response.content);
    } catch (err) {
      console.error('Unitlarni yuklashda xatolik:', err);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredWords = words.filter(word =>
    word.englishWord.toLowerCase().includes(search.toLowerCase()) ||
    word.uzbekWord.toLowerCase().includes(search.toLowerCase()) ||
    word.example.toLowerCase().includes(search.toLowerCase()) ||
    (selectedMastery ? word.masteryLevel === selectedMastery : true)
  );

  const playAudio = (audioPath: string) => {
    if (audioPath) {
      const audio = new Audio(audioPath);
      audio.play().catch(err => console.error('Audio playback failed:', err));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">So'zlar</h1>
              <p className="text-blue-100 text-lg">Inglizcha-o'zbekcha so'zlar bazasi</p>
              
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{words.length}</p>
                    <p className="text-blue-100 text-sm">So'zlar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {words.filter(w => w.masteryLevel === 'MASTERED').length}
                    </p>
                    <p className="text-blue-100 text-sm">O'zlashtirilgan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {words.filter(w => w.audioPath).length}
                    </p>
                    <p className="text-blue-100 text-sm">Audio bilan</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi so'z</span>
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
              placeholder="So'z bo'yicha qidiring..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-80 pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMasteryDropdownOpen(!isMasteryDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <span>Holati: {selectedMastery ? masteryLevels.find(l => l.value === selectedMastery)?.label || 'Tanlang' : 'Barchasi'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMasteryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMasteryDropdownOpen && (
              <div className="absolute z-10 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedMastery(null);
                    setIsMasteryDropdownOpen(false);
                  }}
                >
                  Barchasi
                </div>
                {masteryLevels.map(level => (
                  <div 
                    key={level.value}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedMastery(level.value);
                      setIsMasteryDropdownOpen(false);
                    }}
                  >
                    {level.label}
                  </div>
                ))}
              </div>
            )}
          </div>
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
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* Words Table */}
      {!loading && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inglizcha</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">O'zbekcha</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Namuna</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Audio</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Holati</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategoriya</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Yaratilgan</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-8 py-16 text-center">
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
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {word.englishWord}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-gray-600">{word.uzbekWord}</div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-600 max-w-xs">{word.example}</p>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {word.audioPath ? (
                          <button
                            onClick={() => playAudio(word.audioPath)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          masteryLevels.find(l => l.value === word.masteryLevel)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {masteryLevels.find(l => l.value === word.masteryLevel)?.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-xl text-xs font-medium bg-purple-50 text-purple-700">
                          {word.categoryName}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-xl text-xs font-medium bg-indigo-50 text-indigo-700">
                          {word.unitName}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <span className="text-sm">{formatDate(word.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center space-x-2 justify-end">
                          <button
                            className="p-2 rounded-xl hover:bg-blue-50 transition-colors group/btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingWord(word);
                              setIsEditModalOpen(true);
                            }}
                            title="Tahrirlash"
                          >
                            <Edit className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-500" />
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
                      ? 'bg-blue-500 text-white shadow-lg'
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Yangi so'z qo'shish</h2>
              <p className="text-gray-600">So'zlaringizni boshqarish uchun yangi so'z qo'shing</p>
            </div>
            
            <form onSubmit={handleCreateWord} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inglizcha so'z
                </label>
                <input
                  type="text"
                  value={newWord.englishWord}
                  onChange={(e) => setNewWord(prev => ({ ...prev, englishWord: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masalan: Apple"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masalan: Olma"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Namuna gap
                </label>
                <textarea
                  value={newWord.example}
                  onChange={(e) => setNewWord(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Masalan: I eat an apple every morning."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Audio manzili (URL)
                </label>
                <input
                  type="text"
                  value={newWord.audioPath}
                  onChange={(e) => setNewWord(prev => ({ ...prev, audioPath: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    value={newWord.categoryId}
                    onChange={(e) => setNewWord(prev => ({ ...prev, categoryId: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Tanlang</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={newWord.unitId}
                    onChange={(e) => setNewWord(prev => ({ ...prev, unitId: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Tanlang</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">So'zni tahrirlash</h2>
              <p className="text-gray-600">So'z ma'lumotlarini yangilang</p>
            </div>
            
            <form onSubmit={handleEditWord} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inglizcha so'z
                </label>
                <input
                  type="text"
                  value={editingWord.englishWord}
                  onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, englishWord: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Namuna gap
                </label>
                <textarea
                  value={editingWord.example}
                  onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, example: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Audio manzili (URL)
                </label>
                <input
                  type="text"
                  value={editingWord.audioPath}
                  onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, audioPath: e.target.value }) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    value={editingWord.categoryId}
                    onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, categoryId: parseInt(e.target.value) }) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={editingWord.unitId}
                    onChange={(e) => setEditingWord(prev => prev ? ({ ...prev, unitId: parseInt(e.target.value) }) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                  Holati
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {masteryLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setEditingWord(prev => prev ? ({ ...prev, masteryLevel: level.value as 'NEW' | 'LEARNING' | 'MASTERED' }) : null)}
                      className={`p-2 rounded-xl border-2 transition-all duration-200 ${
                        editingWord.masteryLevel === level.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={level.color}>{level.label}</span>
                    </button>
                  ))}
                </div>
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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