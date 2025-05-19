import React, { useState } from 'react';
import { Greenhouse, SeedType } from '../types/greenhouse';
import { X, Thermometer, Flower, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PhaseProgressionModal } from './greenhouse/PhaseProgressionModal';

interface Props {
  greenhouse: Greenhouse;
  seedTypes: SeedType[];
  onClose: () => void;
  onUpdateGreenhouse: (greenhouse: Greenhouse) => void;
}

export const GreenhouseMonitor: React.FC<Props> = ({ 
  greenhouse, 
  seedTypes, 
  onClose,
  onUpdateGreenhouse
}) => {
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);

  const getPhaseTemperature = (seedTypeId: string, phase: string): number => {
    const seedType = seedTypes.find(st => st.id === seedTypeId);
    if (!seedType) return 0;

    const baseTemp = seedType.idealTemperature;
    switch (phase) {
      case 'germination': return baseTemp + 2;
      case 'nursery': return baseTemp;
      case 'greenhouse': return baseTemp - 1;
      case 'harvest': return baseTemp - 2;
      default: return baseTemp;
    }
  };

  const getPhaseDisplay = (phase: string): string => {
    const phases: Record<string, string> = {
      germination: 'Germinação',
      nursery: 'Berçário',
      greenhouse: 'Crescimento',
      harvest: 'Colheita',
      completed: 'Concluído'
    };
    return phases[phase] || phase;
  };

  const handleUpdateSeed = (updatedSeed: any) => {
    const updatedGreenhouse = {
      ...greenhouse,
      seeds: greenhouse.seeds.map(seed =>
        seed.id === updatedSeed.id ? updatedSeed : seed
      ),
    };
    onUpdateGreenhouse(updatedGreenhouse);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Monitoramento - {greenhouse.name}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {greenhouse.seeds.map((seed) => {
              const seedType = seedTypes.find(st => st.id === seed.typeId);
              if (!seedType) return null;

              const lastFeedback = seed.phaseFeedback[seed.status]?.slice(-1)[0];

              return (
                <div key={seed.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flower className="text-green-500" size={20} />
                      <h4 className="font-semibold">{seed.name}</h4>
                    </div>
                    {seed.status !== 'completed' && (
                      <button
                        onClick={() => setSelectedSeedId(seed.id)}
                        className="text-green-500 hover:text-green-600"
                        title="Avançar Fase"
                      >
                        <ArrowRight size={20} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p>Fase Atual: {getPhaseDisplay(seed.status)}</p>
                    <p>Início: {format(seed.startDate, 'PPP', { locale: ptBR })}</p>
                    <p>Fim Germinação: {format(seed.germinationEndDate, 'PPP', { locale: ptBR })}</p>
                    
                    <div className="flex items-center gap-2 text-orange-500">
                      <Thermometer size={16} />
                      <span>Temperatura Ideal: {getPhaseTemperature(seed.typeId, seed.status)}°C</span>
                    </div>

                    {lastFeedback && (
                      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                        <p className="text-sm text-gray-600">Último Feedback:</p>
                        <p>Temperatura: {lastFeedback.temperature}°C</p>
                        <p>Umidade: {lastFeedback.humidity}%</p>
                        {lastFeedback.notes && (
                          <p className="text-gray-600 italic">{lastFeedback.notes}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-green-600">
                        Taxa de Germinação: {seed.germinationSuccess}%
                      </p>
                      {seed.profit > 0 && (
                        <p className="text-blue-600">
                          Lucro Atual: R$ {seed.profit.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {greenhouse.seeds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma semente plantada nesta estufa.
            </div>
          )}

          {selectedSeedId && (
            <PhaseProgressionModal
              seed={greenhouse.seeds.find(s => s.id === selectedSeedId)!}
              seedType={seedTypes.find(st => st.id === greenhouse.seeds.find(s => s.id === selectedSeedId)?.typeId)!}
              onUpdate={handleUpdateSeed}
              onClose={() => setSelectedSeedId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};