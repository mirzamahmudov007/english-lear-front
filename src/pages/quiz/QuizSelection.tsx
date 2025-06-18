import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Grid3X3, Shuffle, Play, Star, TrendingUp, Target } from 'lucide-react';
import { unitService, Unit } from '../../services/unitService';
import { categoryService, Category } from '../../services/categoryService';

const QuizSelection: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [unitsResponse, categoriesResponse] = await Promise.all([
        unitService.getUnits(0, 20),
        categoryService.getCategories(0, 20)
      ]);
      setUnits(unitsResponse.content);
      setCategories(categoriesResponse.content);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const getIconComponent = (iconPath: string) => {
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
    
    return iconMap[iconPath?.toLowerCase()] || <Grid3X3 className="w-6 h-6 text-white" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Quiz tanlash</h1>
          <p className="text-indigo-100 text-lg mb-8">Bilimingizni sinab ko'ring va o'rganish jarayonini kuzatib boring</p>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{units.length}</p>
              <p className="text-indigo-100">Bo'limlar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{categories.length}</p>
              <p className="text-indigo-100">Kategoriyalar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">∞</p>
              <p className="text-indigo-100">Random</p>
            </div>
          </div>
        </div>
      </div>

      {/* Random Quiz */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shuffle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Random Quiz</h2>
          <p className="text-gray-600 mb-6">Barcha so'zlardan tasodifiy tanlanган savollar</p>
          <button
            onClick={() => navigate('/quiz/random/0')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Random Quiz boshlash</span>
          </button>
        </div>
      </div>

      {/* Units Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bo'limlar bo'yicha quiz</h2>
              <p className="text-gray-600">Muayyan bo'limdagi so'zlarni sinab ko'ring</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {units.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bo'limlar mavjud emas</h3>
              <p className="text-gray-600">Avval bo'lim yarating</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map((unit) => {
                const gradient = getRandomGradient();
                
                return (
                  <div 
                    key={unit.id} 
                    className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/quiz/unit/${unit.id}`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {unit.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {unit.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {unit.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700">
                        {unit.wordCount} so'z
                      </span>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium">
                        Quiz boshlash
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Kategoriyalar bo'yicha quiz</h2>
              <p className="text-gray-600">Muayyan kategoriyaga oid so'zlarni sinab ko'ring</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Kategoriyalar mavjud emas</h3>
              <p className="text-gray-600">Avval kategoriya yarating</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const gradient = getRandomGradient();
                
                return (
                  <div 
                    key={category.id} 
                    className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/quiz/category/${category.id}`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
                        {getIconComponent(category.iconPath)}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700">
                        Kategoriya
                      </span>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium">
                        Quiz boshlash
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Natijalarni ko'rish</h3>
              <p className="text-sm text-green-600">Quiz tarixingiz</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/quiz/results')}
            className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
          >
            Natijalar
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">So'zlarim</h3>
              <p className="text-sm text-blue-600">Lug'atingizni ko'ring</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/my-vocabulary')}
            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            So'zlar
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">Statistika</h3>
              <p className="text-sm text-purple-600">O'rganish jarayoni</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSelection;