import React, { useState } from 'react';
import ProductionStage from './components/ProductionStage';
import StageSelector from './components/StageSelector';
import ProductionSummary from './components/ProductionSummary';

// Show all stages on a single page

function App() {
  const [numStages, setNumStages] = useState(null);
  const [stagesData, setStagesData] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  // Handler for selecting number of stages
  const handleSelectStages = (n) => {
    setNumStages(n);
    setStagesData(Array(n).fill({}));
    setCompleted(Array(n).fill(false));
    setShowSummary(false);
  };

  // Handler for updating a stage's data
  const handleStageChange = (stageIdx, data) => {
    const updated = [...stagesData];
    updated[stageIdx] = data;
    setStagesData(updated);
  };

  // Handler for marking a stage as complete
  const handleStageComplete = (stageIdx, data) => {
    handleStageChange(stageIdx, data);
    const updated = [...completed];
    updated[stageIdx] = true;
    setCompleted(updated);
    // If last stage, show summary
    if (stageIdx === (numStages - 1)) {
      setShowSummary(true);
    }
  };

  // Handler for editing a stage (un-complete it)
  const handleEditStage = (idx) => {
    const updated = [...completed];
    updated[idx] = false;
    setCompleted(updated);
    setShowSummary(false);
  };

  // Handler for reset
  const handleReset = () => {
    setNumStages(null);
    setStagesData([]);
    setCompleted([]);
    setShowSummary(false);
  };

  // If numStages not selected, show selector
  if (numStages === null) {
    return <StageSelector onSelect={handleSelectStages} />;
  }

  // If summary is to be shown
  if (showSummary) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ textAlign: 'center', marginTop: 24, color: '#6b8e23' }}>Production Planning</h1>
        <ProductionSummary stages={stagesData} onEdit={handleEditStage} onReset={handleReset} />
      </div>
    );
  }

  // Otherwise, show all stages for input
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginTop: 24, color: '#6b8e23' }}>Production Planning</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {Array.from({ length: numStages }).map((_, stageIdx) => (
          <div key={stageIdx} style={{ border: '1px solid #e0d7b6', borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32 }}>
            <h2 style={{ color: '#6b8e23', marginBottom: 24 }}>Stage {stageIdx + 1}</h2>
            <ProductionStage
              stageIndex={stageIdx}
              initialData={stagesData[stageIdx]}
              onComplete={data => handleStageComplete(stageIdx, data)}
              onPrevious={null}
              isLast={stageIdx === numStages - 1}
            />
            {completed[stageIdx] && (
              <button onClick={() => handleEditStage(stageIdx)} style={{ marginTop: 16, background: '#f7c873', color: '#6b8e23', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer' }}>
                Edit Stage {stageIdx + 1}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
