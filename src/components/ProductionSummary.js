import React from 'react';
import styled from 'styled-components';
import StageFlow from './StageFlow';

const SummaryContainer = styled.div`
  margin: 32px auto;
  max-width: 1400px;
`;

const Header = styled.div`
  background: #fffbe6;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  background: ${props => props.$secondary ? '#f0f0f0' : '#6b8e23'};
  color: ${props => props.$secondary ? '#666' : '#fff'};
  border: ${props => props.$secondary ? '1px solid #ddd' : 'none'};
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$secondary ? '#e0e0e0' : '#597a1d'};
  }
`;

const StageDetail = styled.div`
  margin-bottom: ${props => props.isLast ? '0' : '32px'};
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #e0d7b6'};
  padding-bottom: ${props => props.isLast ? '0' : '16px'};
`;

const EditControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px 8px;
  border-radius: 4px;
  color: #6b8e23;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f0f0f0;
  }
`;




export default function ProductionSummary({ stages, onEdit, onReset }) {
  return (
    <SummaryContainer>
      <Header>
        <h2 style={{ color: '#6b8e23', margin: 0 }}>Production Stages Summary</h2>
        <ActionButtons>
          <Button $secondary onClick={onReset}>
            <span>↺</span> Reset
          </Button>
          <Button onClick={() => window.print()}>
            <span>🖨️</span> Print
          </Button>
        </ActionButtons>
      </Header>

      <StageFlow stages={stages} />

      <div style={{ background: '#fff', padding: '24px', borderRadius: '0 0 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#6b8e23', marginBottom: '16px' }}>Stage Details</h3>
        {(stages || []).map((stage, idx) => (
          <StageDetail key={idx} isLast={idx === (stages?.length || 0) - 1}>
            <EditControls>
              <EditButton onClick={() => onEdit(idx)}>
                <span>✏️</span> Edit Stage {idx + 1}
              </EditButton>
            </EditControls>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '12px' }}>
              <div>
                <h4 style={{ color: '#6b8e23', marginBottom: '8px' }}>Raw/Intermediate Goods</h4>
                <div style={{ background: '#f8faf4', padding: '12px', borderRadius: '8px' }}>
                  {(stage?.rawGoods || []).map((g, i) => (
                    <div key={i} style={{ marginBottom: '8px', padding: '8px', background: '#fff', borderRadius: '4px', border: '1px solid #e0d7b6' }}>
                      <div style={{ fontWeight: '600' }}>{g.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Quantity: {g.qty} {g.dimension}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#6b8e23', marginBottom: '8px' }}>Production Details</h4>
                <div style={{ background: '#fffbf4', padding: '12px', borderRadius: '8px' }}>
                  {(stage?.middleFields?.wastageEntries || []).map((entry, i) => (
                    <div key={i} style={{ marginBottom: '8px', padding: '8px', background: '#fff', borderRadius: '4px', border: '1px solid #f7c873' }}>
                      <div style={{ fontWeight: '600' }}>Wastage for {entry.good}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        Amount: {entry.wastage}{entry.type === 'percent' ? '%' : ''}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '12px', padding: '8px', background: '#fff', borderRadius: '4px', border: '1px solid #e0d7b6' }}>
                    <div>Time: {stage?.middleFields?.time}</div>
                    <div>Outsource: {stage?.middleFields?.outsource}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#6b8e23', marginBottom: '8px' }}>Output Goods</h4>
                <div style={{ background: '#f8faf4', padding: '12px', borderRadius: '8px' }}>
                  {(stage?.outputGoods || []).map((g, i) => (
                    <div key={i} style={{ marginBottom: '8px', padding: '8px', background: '#fff', borderRadius: '4px', border: '1px solid #6b8e23' }}>
                      <div style={{ fontWeight: '600' }}>{g.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Quantity: {g.qty} {g.dimension}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StageDetail>
        ))}
      </div>
    </SummaryContainer>
  );
}
