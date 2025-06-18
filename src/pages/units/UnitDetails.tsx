import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Clock, Star, TrendingUp, Plus, Search, Filter, Brain } from 'lucide-react';
import { unitService, Unit } from '../../services/unitService';

const UnitDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (id) {
      unitService.getUnitById(Number(id)).then(data => {
        setUnit(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bo'lim topilmadi</h3>
        <p className="text-gray-600 mb-6">Kechirasiz, bu bo'lim mavjud emas yoki o'chirilgan</p>
        <button
          onClick={() => navigate('/units')}
          className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
        >
          Bo'limlarga qaytish
        </button>
      </div>
    );
  }

  const maxWords = 100;
  const progress = Math.min(100, Math.round((unit.wordCount / maxWords) * 100));
  
  const filteredWords = unit.words?.filter(word => 
    word.englishWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.uzbekWord.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMasteryColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-red-50 text-red-700 border-red-200';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <button
            onClick={() => navigate('/units')}
            className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Bo'limlarga qaytish</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm">
                  {unit.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{unit.name}</h1>
                  <p className="text-blue-100 text-lg">{unit.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-blue-100 mb-6">
                <Calendar className="w-4 h-4" />
                <span>Yaratilgan: {formatDate(unit.createdAt)}</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[280px]">
              <h3 className="text-lg font-semibold mb-4">Statistika</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Jami so'zlar</span>
                  <span className="text-2xl font-bold">{unit.wordCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Progress</span>
                  <span className="text-2xl font-bold">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Words Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">So'zlar ro'yxati</h2>
              <p className="text-gray-600">Bu bo'limdagi barcha so'zlar va ularning tarjimalari</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="So'z qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <button className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
                <span>So'z qo'shish</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {filteredWords.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'So\'z topilmadi' : 'So\'zlar yo\'q'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Qidiruv bo\'yicha hech qanday so\'z topilmadi' 
                  : 'Bu bo\'limda hali so\'zlar qo\'shilmagan'
                }
              </p>
              {!searchTerm && (
                <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors">
                  Birinchi so'zni qo'shish
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((word: any) => (
                <div 
                  key={word.id} 
                  className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {word.englishWord}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {word.uzbekWord}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {word.example && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700 italic">
                        "{word.example}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${getMasteryColor(word.masteryLevel)}`}>
                      {word.masteryLevel || 'Beginner'}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">2 kun oldin</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">O'rganishni boshlash</h3>
              <p className="text-sm text-blue-600">So'zlarni o'rganishni boshlang</p>
            </div>
          </div>
          <button className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
            Boshlash
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-800">Quiz o'tkazish</h3>
              <p className="text-sm text-orange-600">Bilimingizni sinab ko'ring</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/quiz/unit/${unit.id}`)}
            className="w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
          >
            Quiz boshlash
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">Takrorlash</h3>
              <p className="text-sm text-purple-600">O'rganganlarni takrorlang</p>
            </div>
          </div>
          <button className="w-full py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium">
            Takrorlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitDetails;