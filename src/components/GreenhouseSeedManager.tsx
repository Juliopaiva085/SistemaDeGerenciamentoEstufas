import React, { useState } from 'react';
import { Greenhouse, Seed, SeedType, Substrate } from '../types/greenhouse';
import { X } from 'lucide-react';
import { calculatePhases } from '../utils/dateCalculations';

interface Props {
  greenhouse: Greenhouse;
  seedTypes: SeedType[];
  substrates: Substrate[];
  onClose: () => void;
  onUpdate: (greenhouse: Greenhouse) => void;
}

export const GreenhouseSeedManager: React.FC<Props> = ({
  greenhouse,
  seedTypes,
  substrates,
  onClose,
  onUpdate,
}) => {
  const [selectedSeedType, setSelectedSeedType] = useState<string>('');
  const [selectedSubstrate, setSelectedSubstrate] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddSeeds = () => {
    const seedType = seedTypes.find(st => st.id === selectedSeedType);
    const substrate = substrates.find(s => s.id === selectedSubstrate);

    if (!seedType || !substrate) return;

    const startDate = new Date();
    const { germinationEnd } = calculatePhases(startDate);

    const newSeeds: Seed[] = Array.from({ length: quantity }, () => ({
      id: crypto.randomUUID(),
      name: seedType.name,
      typeId: seedType.id,
      substrateId: substrate.id,
      startDate,
      germinationEndDate: germinationEnd,
      status: 'germination',
      germinationSuccess: 0,
      profit: 0,
      phaseFeedback: {},
    }));

    const updatedGreenhouse = {
      ...greenhouse,
      seeds: [...greenhouse.seeds, ...newSeeds],
    };

    onUpdate(updatedGreenhouse);
    setSelectedSeedType('');
    setSelectedSubstrate('');
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Adicionar Sementes - {greenhouse.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Semente</label>
            <select
              value={selectedSeedType}
              onChange={(e) => setSelectedSeedType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Selecione um tipo</option>
              {seedTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Substrato</label>
            <select
              value={selectedSubstrate}
              onChange={(e) => setSelectedSubstrate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Selecione um substrato</option>
              {substrates.map((substrate) => (
                <option key={substrate.id} value={substrate.id}>
                  {substrate.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              min="1"
              max={greenhouse.capacity - greenhouse.seeds.length}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddSeeds}
              disabled={!selectedSeedType || !selectedSubstrate || quantity < 1}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};