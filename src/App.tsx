import React, { useState } from 'react';
import { GreenhouseList } from './components/GreenhouseList';
import { Analytics } from './components/Analytics';
import { SeedTracker } from './components/SeedTracker';
import { SeedTypeManager } from './components/SeedTypeManager';
import { SubstrateManager } from './components/SubstrateManager';
import { Greenhouse, Seed, SeedType, Substrate } from './types/greenhouse';

function App() {
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [seedTypes, setSeedTypes] = useState<SeedType[]>([]);
  const [substrates, setSubstrates] = useState<Substrate[]>([]);

  const handleAddGreenhouse = () => {
    const newGreenhouse: Greenhouse = {
      id: crypto.randomUUID(),
      name: `Estufa ${greenhouses.length + 1}`,
      seeds: [],
      capacity: 100,
      supplies: [], // Initialize empty supplies array
    };
    setGreenhouses([...greenhouses, newGreenhouse]);
  };

  const handleRemoveGreenhouse = (id: string) => {
    setGreenhouses(greenhouses.filter(gh => gh.id !== id));
  };

  const handleUpdateGreenhouse = (updatedGreenhouse: Greenhouse) => {
    setGreenhouses(greenhouses.map(gh => 
      gh.id === updatedGreenhouse.id ? updatedGreenhouse : gh
    ));
  };

  const handleAddSeedType = (seedType: SeedType) => {
    setSeedTypes([...seedTypes, seedType]);
  };

  const handleRemoveSeedType = (id: string) => {
    setSeedTypes(seedTypes.filter(st => st.id !== id));
  };

  const handleAddSubstrate = (substrate: Substrate) => {
    setSubstrates([...substrates, substrate]);
  };

  const handleRemoveSubstrate = (id: string) => {
    setSubstrates(substrates.filter(s => s.id !== id));
  };

  const getAllSeeds = () => {
    return greenhouses.flatMap(gh => gh.seeds);
  };

  const handleUpdateSeed = (updatedSeed: Seed) => {
    const updatedGreenhouses = greenhouses.map(gh => ({
      ...gh,
      seeds: gh.seeds.map(seed => 
        seed.id === updatedSeed.id ? updatedSeed : seed
      )
    }));
    setGreenhouses(updatedGreenhouses);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Sistema de Gerenciamento de Estufas
        </h1>
        
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SeedTypeManager
              seedTypes={seedTypes}
              onAdd={handleAddSeedType}
              onRemove={handleRemoveSeedType}
            />
            <SubstrateManager
              substrates={substrates}
              onAdd={handleAddSubstrate}
              onRemove={handleRemoveSubstrate}
            />
          </div>

          <GreenhouseList
            greenhouses={greenhouses}
            seedTypes={seedTypes}
            substrates={substrates}
            onAdd={handleAddGreenhouse}
            onRemove={handleRemoveGreenhouse}
            onUpdateGreenhouse={handleUpdateGreenhouse}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <Analytics seeds={getAllSeeds()} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Sementes Ativas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getAllSeeds().map(seed => (
                  <SeedTracker 
                    key={seed.id} 
                    seed={seed} 
                    onUpdate={handleUpdateSeed}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;