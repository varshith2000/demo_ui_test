
import React from 'react';
import styled from 'styled-components';
import StageSelector from './StageSelector';  

const FlowContainer = styled.div`
  padding: 40px;
  margin: 20px 0;
  position: relative;
  overflow-x: auto;
  background: #fff;
`;

const StageRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;
  position: relative;
`;

const CardCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 220px;
  position: relative;
`;

const Card = styled.div`
  background: white;
  border: 2px solid ${props => {
    switch (props.type) {
      case 'wastage': return '#f7c873';
      case 'output': return '#6b8e23';
      default: return '#e0d7b6';
    }
  }};
  border-radius: 8px;
  padding: 16px;
  min-width: 180px;
  min-height: 60px;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  ${props => props.type === 'wastage' && 'background: #fffbf4;'}
  ${props => props.type === 'output' && 'background: #f8faf4;'}
`;

const CardTitle = styled.div`
  font-weight: 600;
  color: #6b8e23;
  margin-bottom: 8px;
`;

const CardContent = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ArrowSvg = styled.svg`
  position: absolute;
  pointer-events: none;
  z-index: 1;
`;

function Arrow({ from, to, color = '#e0d7b6', thickness = 2, dashed = false }) {
  // from/to: {x, y} in px, relative to FlowContainer
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return (
    <ArrowSvg
      style={{ left: from.x, top: from.y, width: len, height: Math.abs(dy) + 20, overflow: 'visible' }}
      width={len}
      height={Math.abs(dy) + 20}
    >
      <line
        x1={0}
        y1={0}
        x2={dx}
        y2={dy}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={dashed ? '6,6' : '0'}
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L8,4 L0,8" fill="none" stroke={color} strokeWidth={thickness} />
        </marker>
      </defs>
    </ArrowSvg>
  );
}

function StageFlow({ stages }) {
  // Calculate card positions for arrows
  // For simplicity, use fixed layout assumptions
  const cardHeight = 80;
  const colWidth = 220;
  const rowGap = 24;
  const colGap = 60;

  // Helper to get card center positions
  function getCardPos(colIdx, rowIdx) {
    return {
      x: colIdx * (colWidth + colGap) + colWidth / 2,
      y: rowIdx * (cardHeight + rowGap) + cardHeight / 2 + 60 // 60 for StageTitle
    };
  }

  return (
    <FlowContainer>
      {(stages || []).map((stage, stageIdx) => {
        // For each card, calculate its position
        const rawGoods = stage?.rawGoods || [];
        const wastageEntries = stage?.middleFields?.wastageEntries || [];
        const outputGoods = stage?.outputGoods || [];
        const inputCount = rawGoods.length;
        const wastageCount = wastageEntries.length;
        const outputCount = outputGoods.length;
        // For arrows, map input to wastage, wastage to output
        return (
          <div key={stageIdx} style={{ position: 'relative', marginBottom: stageIdx < stages.length - 1 ? 80 : 0 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#6b8e23',
                fontFamily: 'Caveat, cursive',
                letterSpacing: '1px',
                marginBottom: 0
              }}>Stage {stageIdx + 1}</div>
            </div>
            <StageRow>
              {/* Input cards */}
              <CardCol>
                {rawGoods.map((good, i) => (
                  <Card key={i}>
                    <CardTitle>{good.name}</CardTitle>
                    <CardContent>Quantity: {good.qty} {good.dimension}</CardContent>
                  </Card>
                ))}
              </CardCol>
              {/* Wastage cards */}
              <CardCol>
                {wastageEntries.map((entry, i) => (
                  <Card key={i} type="wastage">
                    <CardTitle>Wastage: {entry.good}</CardTitle>
                    <CardContent>{entry.wastage}{entry.type === 'percent' ? '%' : ''} wastage</CardContent>
                  </Card>
                ))}
              </CardCol>
              {/* Output cards */}
              <CardCol>
                {outputGoods.map((good, i) => (
                  <Card key={i} type="output">
                    <CardTitle>{good.name}</CardTitle>
                    <CardContent>Quantity: {good.qty} {good.dimension}</CardContent>
                  </Card>
                ))}
              </CardCol>
            </StageRow>
            {/* Draw arrows for this stage */}
            {/* Input to wastage: many-to-one arrows */}
            {rawGoods.map((good, i) => {
              return wastageEntries.map((entry, j) => {
                if (entry.good === good.name) {
                  // Arrow from input i to wastage j
                  return (
                    <Arrow
                      key={`inw-${i}-${j}`}
                      from={getCardPos(0, i)}
                      to={getCardPos(1, j)}
                      color="#e0d7b6"
                    />
                  );
                }
                return null;
              });
            })}
            {/* Wastage to output: many-to-one arrows */}
            {wastageEntries.map((entry, j) => {
              return outputGoods.map((good, k) => (
                <Arrow
                  key={`wout-${j}-${k}`}
                  from={getCardPos(1, j)}
                  to={getCardPos(2, k)}
                  color="#f7c873"
                />
              ));
            })}
            {/* Stage-to-stage connection: output to next stage input */}
            {stageIdx < stages.length - 1 && outputGoods.length > 0 && (stages[stageIdx + 1]?.rawGoods?.length > 0) && (
              <Arrow
                from={getCardPos(2, outputGoods.length - 1)}
                to={getCardPos(0, 0)}
                color="#bbb"
                thickness={3}
                dashed
              />
            )}
          </div>
        );
      })}
    </FlowContainer>
  );
}

export default StageFlow;
