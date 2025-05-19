import React, { useState } from 'react';
import { Seed } from '../types/greenhouse';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sprout, Flower2, Building2, TreeDeciduous, Package } from 'lucide-react';
import { SupplyManager } from './SupplyManager';

interface Props {
  seed: Seed;
  onUpdate?: (updatedSeed: Seed) => void;
}

const translateStatus = (status: Seed['status']) => {
  const statusMap = {
    germination: 'Germinação',
    nursery: 'Berçário',
    greenhouse: 'Estufa',
    harvest: 'Colheita',
    completed: 'Concluído'
  };
  return statusMap[status];
};

export const SeedTracker: React.FC<Props> = ({ seed, onUpdate }) => {
  const [showSupplyManager, setShowSupplyManager] = useState(false);

  const getStatusIcon = (status: Seed['status']) => {
    switch (status) {
      case 'germination':
        return <Sprout className="text-green-500" />;
      case 'nursery':
        return <Flower2 className="text-blue-500" />;
      case 'greenhouse':
        return <Building2 className="text-purple-500" />;
      case 'harvest':
        return <TreeDeciduous className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTotalSupplyCost = () => {
    return seed.supplies.reduce((total, supply) => {
      return total + (supply.costPerUnit * supply.quantity);
    }, 0);
  };

  const handleUpdateSeed = (updatedSeed: Seed) => {
    if (onUpdate) {
      onUpdate(updatedSeed);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(seed.status)}
          <h3 className="font-semibold">{seed.name}</h3>
        </div>
        <button
          onClick={() => setShowSupplyManager(true)}
          className="text-blue-500 hover:text-blue-700"
          title="Gerenciar Insumos"
        >
          <Package size={20} />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <p>Data de Início: {format(seed.startDate, 'PPP', { locale: ptBR })}</p>
        <p>Fim da Germinação: {format(seed.germinationEndDate, 'PPP', { locale: ptBR })}</p>
        <p>Status: {translateStatus(seed.status)}</p>
        <p>Sucesso na Germinação: {seed.germinationSuccess}%</p>
        <p>Lucro: R$ {seed.profit.toFixed(2)}</p>
        {seed.supplies.length > 0 && (
          <p className="text-red-500">Custo Insumos: R$ {getTotalSupplyCost().toFixed(2)}</p>
        )}
      </div>

      {showSupplyManager && (
        <SupplyManager
          seed={seed}
          onUpdate={handleUpdateSeed}
          onClose={() => setShowSupplyManager(false)}
        />
      )}
    </div>
  );
};