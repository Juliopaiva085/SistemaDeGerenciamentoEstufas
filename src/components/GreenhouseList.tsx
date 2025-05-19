import React, { useState } from 'react';
import { Greenhouse, SeedType, Substrate } from '../types/greenhouse';
import { Plus, Trash2, Sprout, Eye, Package } from 'lucide-react';
import { GreenhouseSeedManager } from './GreenhouseSeedManager';
import { GreenhouseMonitor } from './GreenhouseMonitor';
import { GreenhouseSupplyManager } from './greenhouse/GreenhouseSupplyManager';

interface Props {
  greenhouses: Greenhouse[];
  seedTypes: SeedType[];
  substrates: Substrate[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdateGreenhouse: (greenhouse: Greenhouse) => void;
}

export const GreenhouseList: React.FC<Props> = ({ 
  greenhouses, 
  seedTypes, 
  substrates,
  onAdd, 
  onRemove,
  onUpdateGreenhouse 
}) => {
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<string | null>(null);
  const [monitoringGreenhouseId, setMonitoringGreenhouseId] = useState<string | null>(null);
  const [supplyManagerId, setSupplyManagerId] = useState<string | null>(null);

  const handleOpenSeedManager = (id: string) => {
    setSelectedGreenhouseId(id);
  };

  const handleCloseSeedManager = () => {
    setSelectedGreenhouseId(null);
  };

  const handleOpenMonitor = (id: string) => {
    setMonitoringGreenhouseId(id);
  };

  const handleCloseMonitor = () => {
    setMonitoringGreenhouseId(null);
  };

  const handleOpenSupplyManager = (id: string) => {
    setSupplyManagerId(id);
  };

  const handleCloseSupplyManager = () => {
    setSupplyManagerId(null);
  };

  const getTotalSupplyCost = (greenhouse: Greenhouse) => {
    return greenhouse.supplies.reduce((total, supply) => {
      return total + (supply.costPerUnit * supply.quantity);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Estufas</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Plus size={20} /> Adicionar Estufa
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {greenhouses.map((greenhouse) => (
          <div key={greenhouse.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{greenhouse.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenSupplyManager(greenhouse.id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Gerenciar Insumos"
                >
                  <Package size={20} />
                </button>
                <button
                  onClick={() => handleOpenMonitor(greenhouse.id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Monitorar Estufa"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleOpenSeedManager(greenhouse.id)}
                  className="text-green-500 hover:text-green-700"
                  title="Gerenciar Sementes"
                >
                  <Sprout size={20} />
                </button>
                <button
                  onClick={() => onRemove(greenhouse.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Remover Estufa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Capacidade: {greenhouse.capacity} sementes</p>
              <p>Sementes Ativas: {greenhouse.seeds.length}</p>
              {greenhouse.supplies.length > 0 && (
                <p className="text-red-500">
                  Custo Total Insumos: R$ {getTotalSupplyCost(greenhouse).toFixed(2)}
                </p>
              )}
            </div>

            {selectedGreenhouseId === greenhouse.id && (
              <GreenhouseSeedManager
                greenhouse={greenhouse}
                seedTypes={seedTypes}
                substrates={substrates}
                onClose={handleCloseSeedManager}
                onUpdate={onUpdateGreenhouse}
              />
            )}

            {monitoringGreenhouseId === greenhouse.id && (
              <GreenhouseMonitor
                greenhouse={greenhouse}
                seedTypes={seedTypes}
                onClose={handleCloseMonitor}
                onUpdateGreenhouse={onUpdateGreenhouse}
              />
            )}

            {supplyManagerId === greenhouse.id && (
              <GreenhouseSupplyManager
                greenhouse={greenhouse}
                onUpdate={onUpdateGreenhouse}
                onClose={handleCloseSupplyManager}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};