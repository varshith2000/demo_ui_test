import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  background: #fffbe6;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin: 32px auto;
  padding: 32px 24px;
  max-width: 1100px;
`;

export default function ProductionSummary({ stages, onEdit }) {
  return (
    <SummaryContainer>
      <h2 style={{ textAlign: 'center', color: '#6b8e23' }}>Production Stages Summary</h2>
      {stages.map((stage, idx) => (
        <div key={idx} style={{ marginBottom: 32, borderBottom: '1px solid #e0d7b6', paddingBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#6b8e23' }}>Stage {idx + 1}</h3>
            <button onClick={() => onEdit(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }} title="Edit">
              ✏️
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <b>Raw/Intermediate Goods:</b>
              <ul>
                {stage.rawGoods.map((g, i) => (
                  <li key={i}>{g.name} ({g.qty})</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <b>Production Details:</b>
              <ul>
                <li>Wastage: {stage.middleFields.wastage} {stage.middleFields.wastageType === 'percent' ? '%' : ''}</li>
                <li>Time: {stage.middleFields.time}</li>
                <li>Outsource: {stage.middleFields.outsource}</li>
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <b>Output Goods:</b>
              <ul>
                {stage.outputGoods.map((g, i) => (
                  <li key={i}>{g.name} ({g.qty})</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </SummaryContainer>
  );
}
