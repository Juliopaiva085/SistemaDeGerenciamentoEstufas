import React, { useState } from 'react';
import { Supply, Greenhouse } from '../../types/greenhouse';
import { Plus, X, Droplets, Zap } from 'lucide-react';

interface Props {
  greenhouse: Greenhouse;
  onUpdate: (updatedGreenhouse: Greenhouse) => void;
  onClose: () => void;
}

export const GreenhouseSupplyManager: React.FC<Props> = ({ greenhouse, onUpdate, onClose }) => {
  const [newSupply, setNewSupply] = useState<Partial<Supply>>({});

  const handleAddSupply = () => {
    if (!newSupply.name || !newSupply.unit || !newSupply.costPerUnit || !newSupply.quantity) return;

    const supply: Supply = {
      id: crypto.randomUUID(),
      name: newSupply.name,
      unit: newSupply.unit,
      costPerUnit: Number(newSupply.costPerUnit),
      quantity: Number(newSupply.quantity),
    };

    const updatedGreenhouse = {
      ...greenhouse,
      supplies: [...greenhouse.supplies, supply],
    };

    onUpdate(updatedGreenhouse);
    setNewSupply({});
  };

  const handleRemoveSupply = (supplyId: string) => {
    const updatedGreenhouse = {
      ...greenhouse,
      supplies: greenhouse.supplies.filter(s => s.id !== supplyId),
    };
    onUpdate(updatedGreenhouse);
  };

  const getTotalCost = () => {
    return greenhouse.supplies.reduce((total, supply) => {
      return total + (supply.costPerUnit * supply.quantity);
    }, 0);
  };

  const getSupplyIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'água':
      case 'agua':
        return <Droplets size={16} className="text-blue-500" />;
      case 'energia':
        return <Zap size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Gerenciar Insumos - {greenhouse.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Insumo</label>
              <input
                type="text"
                value={newSupply.name || ''}
                onChange={(e) => setNewSupply({ ...newSupply, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Ex: Água, Energia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidade</label>
              <input
                type="text"
                value={newSupply.unit || ''}
                onChange={(e) => setNewSupply({ ...newSupply, unit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Ex: kWh, L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Custo por Unidade</label>
              <input
                type="number"
                value={newSupply.costPerUnit || ''}
                onChange={(e) => setNewSupply({ ...newSupply, costPerUnit: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="R$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                type="number"
                value={newSupply.quantity || ''}
                onChange={(e) => setNewSupply({ ...newSupply, quantity: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddSupply}
            disabled={!newSupply.name || !newSupply.unit || !newSupply.costPerUnit || !newSupply.quantity}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
          >
            <Plus size={20} /> Adicionar Insumo
          </button>

          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Insumos Registrados</h4>
            {greenhouse.supplies.map((supply) => (
              <div key={supply.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {getSupplyIcon(supply.name)}
                  <div>
                    <p className="font-medium">{supply.name}</p>
                    <p className="text-sm text-gray-600">
                      {supply.quantity} {supply.unit} (R$ {supply.costPerUnit}/un)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">
                    R$ {(supply.quantity * supply.costPerUnit).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveSupply(supply.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}

            {greenhouse.supplies.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-right font-medium">
                  Custo Total: R$ {getTotalCost().toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};