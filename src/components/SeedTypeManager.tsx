import React, { useState } from 'react';
import { SeedType } from '../types/greenhouse';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  seedTypes: SeedType[];
  onAdd: (seedType: SeedType) => void;
  onRemove: (id: string) => void;
}

export const SeedTypeManager: React.FC<Props> = ({ seedTypes, onAdd, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSeedType, setNewSeedType] = useState<Partial<SeedType>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      name: newSeedType.name || '',
      expectedGerminationRate: Number(newSeedType.expectedGerminationRate) || 0,
      idealTemperature: Number(newSeedType.idealTemperature) || 0,
      idealHumidity: Number(newSeedType.idealHumidity) || 0,
      estimatedProfit: Number(newSeedType.estimatedProfit) || 0,
    });
    setIsAdding(false);
    setNewSeedType({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tipos de Sementes</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Plus size={20} /> Adicionar Tipo
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={newSeedType.name || ''}
              onChange={(e) => setNewSeedType({ ...newSeedType, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Taxa de Germinação Esperada (%)</label>
              <input
                type="number"
                value={newSeedType.expectedGerminationRate || ''}
                onChange={(e) => setNewSeedType({ ...newSeedType, expectedGerminationRate: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Temperatura Ideal (°C)</label>
              <input
                type="number"
                value={newSeedType.idealTemperature || ''}
                onChange={(e) => setNewSeedType({ ...newSeedType, idealTemperature: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Umidade Ideal (%)</label>
              <input
                type="number"
                value={newSeedType.idealHumidity || ''}
                onChange={(e) => setNewSeedType({ ...newSeedType, idealHumidity: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lucro Estimado (R$)</label>
              <input
                type="number"
                value={newSeedType.estimatedProfit || ''}
                onChange={(e) => setNewSeedType({ ...newSeedType, estimatedProfit: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seedTypes.map((type) => (
          <div key={type.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{type.name}</h3>
              <button
                onClick={() => onRemove(type.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="text-sm space-y-2">
              <p>Taxa de Germinação: {type.expectedGerminationRate}%</p>
              <p>Temperatura: {type.idealTemperature}°C</p>
              <p>Umidade: {type.idealHumidity}%</p>
              <p>Lucro Est.: R$ {type.estimatedProfit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};