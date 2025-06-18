import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Clock, Target, TrendingUp, Award, Star, ArrowLeft } from 'lucide-react';
import { quizService, QuizResult } from '../../services/quizService';

const QuizResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizResults();
      setResults(data.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()));
    } catch (err) {
      setError('Natijalarni yuklashda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 70) return '🥈';
    if (score >= 50) return '🥉';
    return '📝';
  };

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;

  const totalQuizzes = results.length;
  const perfectScores = results.filter(r => r.score === 100).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-purple-100 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Bosh sahifaga qaytish</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Quiz natijalari</h1>
              <p className="text-purple-100 text-lg">Sizning o'rganish jarayoningiz va yutuqlaringiz</p>
              
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalQuizzes}</p>
                    <p className="text-purple-100 text-sm">Jami quizlar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{averageScore}%</p>
                    <p className="text-purple-100 text-sm">O'rtacha ball</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{perfectScores}</p>
                    <p className="text-purple-100 text-sm">Mukammal natija</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-700">{totalQuizzes}</span>
          </div>
          <h3 className="font-semibold text-blue-800 mb-1">Jami quizlar</h3>
          <p className="text-sm text-blue-600">Tugatilgan</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-green-700">{averageScore}%</span>
          </div>
          <h3 className="font-semibold text-green-800 mb-1">O'rtacha ball</h3>
          <p className="text-sm text-green-600">Barcha quizlar</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-yellow-700">{perfectScores}</span>
          </div>
          <h3 className="font-semibold text-yellow-800 mb-1">Mukammal natija</h3>
          <p className="text-sm text-yellow-600">100% ball</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-purple-700">
              {results.length > 0 ? Math.max(...results.map(r => r.score)) : 0}%
            </span>
          </div>
          <h3 className="font-semibold text-purple-800 mb-1">Eng yuqori ball</h3>
          <p className="text-sm text-purple-600">Rekord</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
          {error}
        </div>
      )}

      {/* Results List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz tarixi</h2>
          <p className="text-gray-600">Barcha quiz natijalaringiz</p>
        </div>

        <div className="p-8">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hali quiz topshirmadingiz</h3>
              <p className="text-gray-600 mb-6">Birinchi quizni boshlash uchun bo'limlar yoki kategoriyalardan birini tanlang</p>
              <button
                onClick={() => navigate('/units')}
                className="px-6 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors"
              >
                Quiz boshlash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/quiz/result/${result.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getScoreColor(result.score).replace('text-', 'bg-').replace('bg-', 'bg-').split(' ')[1]}`}>
                        {getScoreIcon(result.score)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                          Quiz #{result.quizId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.quizType} Quiz
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold border ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-600">{result.correctAnswers}</p>
                      <p className="text-xs text-blue-600">To'g'ri javoblar</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-600">{result.totalQuestions}</p>
                      <p className="text-xs text-gray-600">Jami savollar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(result.completedAt)}</span>
                    </div>
                    {result.timeTaken && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(result.timeTaken / 60)} daqiqa</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;