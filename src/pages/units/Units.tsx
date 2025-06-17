import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Eye, ChevronRight, Search } from 'lucide-react';
import { unitService, Unit } from '../../services/unitService';
import UnitDetails from './UnitDetails';
import { useNavigate } from 'react-router-dom';

const getRandomColor = () => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-yellow-100 text-yellow-700',
    'bg-indigo-100 text-indigo-700',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', description: '' });
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchUnits = async (page: number) => {
    try {
      setLoading(true);
      const response = await unitService.getUnits(page);
      setUnits(response.content);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch units');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits(currentPage);
  }, [currentPage]);

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await unitService.createUnit(newUnit);
      setNewUnit({ name: '', description: '' });
      setIsCreateModalOpen(false);
      fetchUnits(currentPage);
    } catch (err) {
      setError('Failed to create unit');
      console.error(err);
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

  // Progress bar uchun max so'zlar soni (demo uchun 100 deb olamiz)
  const maxWords = 100;

  // Search filter
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Bo'lim nomi bo'yicha qidiring..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-end md:self-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yangi bo'lim
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Bo'limlar topilmadi</div>
        ) : (
          filteredUnits.map((unit) => {
            const progress = Math.min(100, Math.round((unit.wordCount / maxWords) * 100));
            const color = getRandomColor();
            return (
              <div 
                key={unit.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
                onClick={() => navigate(`/units/${unit.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${color}`}>
                      {unit.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{unit.name}</div>
                      <div className="text-xs text-gray-500">{formatDate(unit.createdAt)}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{unit.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {unit.wordCount} so'z
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    created
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bo'lim</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tavsif</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Yaratilgan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Bo'limlar topilmadi</td>
              </tr>
            ) : (
              filteredUnits.map((unit) => {
                const progress = Math.min(100, Math.round((unit.wordCount / maxWords) * 100));
                const color = getRandomColor();
                return (
                  <tr key={unit.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${color}`}>
                        {unit.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{unit.name}</div>
                        <div className="text-xs text-gray-400">{unit.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        created
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{unit.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(unit.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-blue-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => navigate(`/units/${unit.id}`)}
                        title="Ko'rish"
                      >
                        <Eye className="w-5 h-5 text-blue-500" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Oldingi
          </button>
          <span className="px-4 py-2">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Yangi bo'lim</h2>
            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomi
                </label>
                <input
                  type="text"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tavsif
                </label>
                <textarea
                  value={newUnit.description}
                  onChange={(e) => setNewUnit(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUnitId && (
        <UnitDetails
          unitId={selectedUnitId}
          onClose={() => setSelectedUnitId(null)}
        />
      )}
    </div>
  );
};

export default Units; 