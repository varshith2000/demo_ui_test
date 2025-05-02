import React, { useState } from 'react';


import ProductionStage from './components/ProductionStage';
import StageSelector from './components/StageSelector';
import ProductionSummary from './components/ProductionSummary';

function App() {
  const [numStages, setNumStages] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [stagesData, setStagesData] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [editStage, setEditStage] = useState(null);

  const handleStageComplete = (stageData) => {
    const updatedStages = [...stagesData];
    updatedStages[currentStage] = stageData;
    setStagesData(updatedStages);
    if (currentStage + 1 < numStages) {
      setCurrentStage(currentStage + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleEditStage = (idx) => {
    setEditStage(idx);
    setCurrentStage(idx);
    setShowSummary(false);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: 24 }}>Production Planning</h1>
      {!numStages && <StageSelector onSelect={setNumStages} />}
      {numStages && !showSummary && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <ProductionStage
            key={currentStage}
            stageIndex={currentStage}
            initialData={stagesData[currentStage]}
            onComplete={handleStageComplete}
            isLast={currentStage === numStages - 1}
          />
        </div>
      )}
      {numStages && showSummary && (
        <ProductionSummary stages={stagesData} onEdit={handleEditStage} />
      )}
    </div>
  );
}

export default App;
