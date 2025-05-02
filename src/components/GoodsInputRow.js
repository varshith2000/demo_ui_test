import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Select = styled.select`
  flex: 2;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e0d7b6;
  margin-right: 10px;
  font-size: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e0d7b6;
  font-size: 1rem;
  margin-right: 10px;
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

export default function GoodsInputRow({
  goodsList = [],
  value = {},
  onChange,
  onRemove,
  onAddNew,
  allowRemove = true,
  placeholder = 'Select good...',
}) {
  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected === '__add_new__') {
      onAddNew && onAddNew();
    } else {
      onChange({ ...value, name: selected });
    }
  };

  return (
    <Row>
      <Select value={value.name || ''} onChange={handleSelect}>
        <option value="" disabled>{placeholder}</option>
        {goodsList.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
        <option value="__add_new__">+ Add new...</option>
      </Select>
      <Input
        type="number"
        min={0}
        value={value.qty || ''}
        onChange={e => onChange({ ...value, qty: e.target.value })}
        placeholder="Qty"
      />
      {allowRemove && (
        <Button type="button" onClick={onRemove}>-</Button>
      )}
    </Row>
  );
}
