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

  const handleStagePrevious = (stageData) => {
    // Save current stage data even when going back
    const updatedStages = [...stagesData];
    updatedStages[currentStage] = stageData;
    setStagesData(updatedStages);
    
    // Go to previous stage if not at first stage
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleEditStage = (idx) => {
    setEditStage(idx);
    setCurrentStage(idx);
    setShowSummary(false);
  };

  const handleReset = () => {
    setNumStages(null);
    setCurrentStage(0);
    setStagesData([]);
    setShowSummary(false);
    setEditStage(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginTop: 24, color: '#6b8e23' }}>Production Planning</h1>
      
      {!numStages && <StageSelector onSelect={setNumStages} />}
      
      {numStages && !showSummary && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ color: '#6b8e23' }}>Stage {currentStage + 1} of {numStages}</h2>
            <div style={{ height: '4px', background: '#e0d7b6', margin: '20px auto', width: '60%', borderRadius: '2px' }}>
              <div style={{
                height: '100%',
                width: `${((currentStage + 1) / numStages) * 100}%`,
                background: '#6b8e23',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <ProductionStage
              key={currentStage}
              stageIndex={currentStage}
              initialData={stagesData[currentStage]}
              onComplete={handleStageComplete}
              onPrevious={handleStagePrevious}
              isLast={currentStage === numStages - 1}
            />
          </div>
        </>
      )}
      
      {numStages && showSummary && (
        <ProductionSummary 
          stages={stagesData} 
          onEdit={handleEditStage}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
