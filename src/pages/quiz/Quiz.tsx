import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, Target, Brain, Zap } from 'lucide-react';
import { quizService, Quiz as QuizType, QuizAnswer } from '../../services/quizService';
import { unitService } from '../../services/unitService';
import { categoryService } from '../../services/categoryService';

const Quiz: React.FC = () => {
  const { type, sourceId } = useParams<{ type: string; sourceId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sourceName, setSourceName] = useState('');

  useEffect(() => {
    if (type && sourceId) {
      generateQuiz();
      fetchSourceName();
    }
  }, [type, sourceId]);

  useEffect(() => {
    if (quiz && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, quizCompleted]);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const quizType = type?.toUpperCase() as 'UNIT' | 'CATEGORY' | 'RANDOM';
      const response = await quizService.generateQuiz(quizType, Number(sourceId), 'uz-en');
      setQuiz(response);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSourceName = async () => {
    try {
      if (type === 'unit') {
        const unit = await unitService.getUnitById(Number(sourceId));
        setSourceName(unit.name);
      } else if (type === 'category') {
        const category = await categoryService.getCategoryById(Number(sourceId));
        setSourceName(category.name);
      } else {
        setSourceName('Random Quiz');
      }
    } catch (error) {
      console.error('Failed to fetch source name:', error);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!quiz) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [quiz.questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      const answers: QuizAnswer[] = quiz.questions.map(question => ({
        questionId: question.id,
        selectedAnswer: selectedAnswers[question.id] || '',
        correctAnswer: question.englishWord
      }));

      await quizService.submitQuiz(quiz.id, answers);
      setQuizCompleted(true);
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate('/quiz/results');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 120) return 'text-green-600';
    if (timeLeft > 60) return 'text-yellow-600';
    return 'text-red-600';
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

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Quiz yaratilmadi</h3>
        <p className="text-gray-600 mb-6">Kechirasiz, quiz yaratishda xatolik yuz berdi</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = quiz.questions.filter(q => 
      selectedAnswers[q.id] === q.englishWord
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Quiz yakunlandi!</h1>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold">{correctAnswers}</p>
              <p className="text-green-100">To'g'ri javoblar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{quiz.questions.length}</p>
              <p className="text-green-100">Jami savollar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{score}%</p>
              <p className="text-green-100">Ball</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Orqaga</span>
          </button>
          
          <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
            <Clock className="w-5 h-5" />
            <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{sourceName} - Quiz</h1>
            <p className="text-gray-600">
              Savol {currentQuestionIndex + 1} / {quiz.questions.length}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</p>
          </div>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {currentQuestion.questionText}
          </h2>
          <p className="text-gray-600">Inglizcha tarjimasini tanlang</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                selectedAnswers[currentQuestion.id] === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion.id] === option
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion.id] === option && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-lg font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-gray-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Oldingi
          </button>

          <div className="flex items-center space-x-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500'
                    : selectedAnswers[quiz.questions[index].id]
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id] || submitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Yuborilmoqda...</span>
              </div>
            ) : currentQuestionIndex === quiz.questions.length - 1 ? (
              'Yakunlash'
            ) : (
              'Keyingi'
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-800">
                {Object.keys(selectedAnswers).length}
              </p>
              <p className="text-blue-600 text-sm">Javob berilgan</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-800">
                {quiz.questions.length - Object.keys(selectedAnswers).length}
              </p>
              <p className="text-purple-600 text-sm">Qolgan savollar</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-800">
                {formatTime(300 - timeLeft)}
              </p>
              <p className="text-green-600 text-sm">O'tgan vaqt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;