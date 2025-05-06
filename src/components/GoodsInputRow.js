import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  flex: 2;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${props => props.$hasError ? '#d32f2f' : '#e0d7b6'};
  margin-right: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#d32f2f' : '#6b8e23'};
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${props => props.$hasError ? '#d32f2f' : '#e0d7b6'};
  font-size: 1rem;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#d32f2f' : '#6b8e23'};
  }
`;

const Button = styled.button`
  background: #f7c873;
  color: #6b8e23;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 4px;
  &:hover {
    background: #ffe2a9;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 4px;
  padding-left: 4px;
`;

export default function GoodsInputRow({
  goodsList = [],
  value = {},
  onChange,
  onRemove,
  onAddNew,
  allowRemove = true,
  placeholder = 'Select good...',
  showDimension = false,
  error = null,
}) {
  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected === '__add_new__') {
      onAddNew && onAddNew();
    } else {
      onChange({ ...value, name: selected });
    }
  };

  const handleDimensionChange = (e) => {
    onChange({ ...value, dimension: e.target.value });
  };

  const hasError = Boolean(error);

  return (
    <Row>
      <InputRow style={{ flexWrap: 'wrap', gap: 8 }}>
        <div style={{ flex: 2, minWidth: 140 }}>
          <Select value={value.name || ''} onChange={handleSelect} $hasError={hasError} style={{ width: '100%' }}>
            <option value="" disabled>{placeholder}</option>
            {goodsList.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
            <option value="__add_new__">+ Add new...</option>
          </Select>
        </div>
        <div style={{ flex: 1, minWidth: 80 }}>
          <Input
            type="number"
            min={0}
            value={value.qty || ''}
            onChange={e => onChange({ ...value, qty: e.target.value })}
            placeholder="Qty"
            $hasError={hasError}
            style={{ width: '100%' }}
          />
        </div>
        {showDimension && (
          <div style={{ flex: 1, minWidth: 80 }}>
            <Select
              value={value.dimension || ''}
              onChange={handleDimensionChange}
              $hasError={hasError}
              style={{ width: '100%' }}
            >
              <option value="">Unit</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="l">L</option>
            </Select>
          </div>
        )}
        {allowRemove && (
          <Button type="button" onClick={onRemove}>-</Button>
        )}
      </InputRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Row>
  );
}
