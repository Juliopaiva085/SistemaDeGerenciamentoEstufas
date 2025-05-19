import React, { useState } from 'react';
import { Substrate } from '../types/greenhouse';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  substrates: Substrate[];
  onAdd: (substrate: Substrate) => void;
  onRemove: (id: string) => void;
}

export const SubstrateManager: React.FC<Props> = ({ substrates, onAdd, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubstrate, setNewSubstrate] = useState<Partial<Substrate>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      name: newSubstrate.name || '',
      ph: Number(newSubstrate.ph) || 0,
      organicMatter: Number(newSubstrate.organicMatter) || 0,
      moisture: Number(newSubstrate.moisture) || 0,
      cost: Number(newSubstrate.cost) || 0,
    });
    setIsAdding(false);
    setNewSubstrate({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Substratos</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} /> Adicionar Substrato
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={newSubstrate.name || ''}
              onChange={(e) => setNewSubstrate({ ...newSubstrate, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nível de pH</label>
              <input
                type="number"
                step="0.1"
                value={newSubstrate.ph || ''}
                onChange={(e) => setNewSubstrate({ ...newSubstrate, ph: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Matéria Orgânica (%)</label>
              <input
                type="number"
                value={newSubstrate.organicMatter || ''}
                onChange={(e) => setNewSubstrate({ ...newSubstrate, organicMatter: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Umidade (%)</label>
              <input
                type="number"
                value={newSubstrate.moisture || ''}
                onChange={(e) => setNewSubstrate({ ...newSubstrate, moisture: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Custo (R$)</label>
              <input
                type="number"
                value={newSubstrate.cost || ''}
                onChange={(e) => setNewSubstrate({ ...newSubstrate, cost: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {substrates.map((substrate) => (
          <div key={substrate.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{substrate.name}</h3>
              <button
                onClick={() => onRemove(substrate.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="text-sm space-y-2">
              <p>Nível de pH: {substrate.ph}</p>
              <p>Matéria Orgânica: {substrate.organicMatter}%</p>
              <p>Umidade: {substrate.moisture}%</p>
              <p>Custo: R$ {substrate.cost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};