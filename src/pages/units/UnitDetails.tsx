import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { unitService, Unit } from '../../services/unitService';

const UnitDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center h-96">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!unit) return <div className="text-center text-gray-500 mt-10">Bo'lim topilmadi</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Orqaga
      </button>
      <h2 className="text-2xl font-semibold mb-2">{unit.name}</h2>
      <p className="mb-2 text-gray-600">{unit.description}</p>
      <div className="mb-2 text-sm text-gray-500">Yaratilgan: {new Date(unit.createdAt).toLocaleString()}</div>
      <div className="mb-4 text-sm text-gray-500">So'zlar soni: {unit.wordCount}</div>
      <h3 className="font-semibold mb-2">So'zlar:</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {unit.words && unit.words.length > 0 ? (
          unit.words.map((word: any) => (
            <div key={word.id} className="p-2 border rounded flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <span className="font-semibold">{word.englishWord}</span>
                <span className="text-gray-500">- {word.uzbekWord}</span>
                <span className="ml-auto text-xs text-gray-400">{word.masteryLevel}</span>
              </div>
              {word.example && <div className="text-xs text-gray-600 italic">"{word.example}"</div>}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">So'zlar yo'q</div>
        )}
      </div>
    </div>
  );
};

export default UnitDetails;
