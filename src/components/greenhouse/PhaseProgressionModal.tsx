import React, { useState } from 'react';
import { Seed, SeedType, PhaseFeedback } from '../../types/greenhouse';
import { X, ThermometerSun, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  seed: Seed;
  seedType: SeedType;
  onUpdate: (updatedSeed: Seed) => void;
  onClose: () => void;
}

const phaseMap = {
  germination: {
    next: 'nursery',
    label: 'Berçário',
    current: 'Germinação',
  },
  nursery: {
    next: 'greenhouse',
    label: 'Estufa',
    current: 'Berçário',
  },
  greenhouse: {
    next: 'harvest',
    label: 'Colheita',
    current: 'Estufa',
  },
  harvest: {
    next: 'completed',
    label: 'Concluído',
    current: 'Colheita',
  },
  completed: {
    next: null,
    label: null,
    current: 'Concluído',
  },
};

export const PhaseProgressionModal: React.FC<Props> = ({ seed, seedType, onUpdate, onClose }) => {
  const [feedback, setFeedback] = useState<Partial<PhaseFeedback>>({
    temperature: seedType.idealTemperature,
    humidity: seedType.idealHumidity,
    notes: '',
  });

  const handleProgressPhase = () => {
    const currentPhase = phaseMap[seed.status];
    if (!currentPhase.next) return;

    const newFeedback: PhaseFeedback = {
      temperature: feedback.temperature || seedType.idealTemperature,
      humidity: feedback.humidity || seedType.idealHumidity,
      notes: feedback.notes || '',
      timestamp: new Date(),
    };

    const updatedSeed: Seed = {
      ...seed,
      status: currentPhase.next as Seed['status'],
      phaseFeedback: {
        ...seed.phaseFeedback,
        [seed.status]: [...(seed.phaseFeedback[seed.status] || []), newFeedback],
      },
    };

    // Update success rate and profit based on conditions
    if (seed.status === 'germination') {
      const tempDiff = Math.abs(seedType.idealTemperature - (feedback.temperature || 0));
      const humidityDiff = Math.abs(seedType.idealHumidity - (feedback.humidity || 0));
      
      const successRate = Math.max(
        0,
        seedType.expectedGerminationRate - (tempDiff * 2) - (humidityDiff * 1.5)
      );
      
      updatedSeed.germinationSuccess = Math.min(100, Math.max(0, successRate));
      updatedSeed.profit = (updatedSeed.germinationSuccess / 100) * seedType.estimatedProfit;
    }

    onUpdate(updatedSeed);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Progresso da Fase - {phaseMap[seed.status].current}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Data de Início: {format(seed.startDate, 'PPP', { locale: ptBR })}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Fase Atual: {phaseMap[seed.status].current}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <ThermometerSun size={16} className="text-orange-500" />
                  Temperatura (°C)
                </div>
              </label>
              <input
                type="number"
                value={feedback.temperature || ''}
                onChange={(e) => setFeedback({ ...feedback, temperature: Number(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ideal: {seedType.idealTemperature}°C
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Droplets size={16} className="text-blue-500" />
                  Umidade (%)
                </div>
              </label>
              <input
                type="number"
                value={feedback.humidity || ''}
                onChange={(e) => setFeedback({ ...feedback, humidity: Number(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ideal: {seedType.idealHumidity}%
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={feedback.notes || ''}
              onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows={3}
            />
          </div>

          {seed.status !== 'completed' && (
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleProgressPhase}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Avançar para {phaseMap[seed.status].label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};