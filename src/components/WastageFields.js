import React, { useState } from 'react';
import styled from 'styled-components';

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.label`
  flex: 1;
  font-size: 1rem;
  color: #6b8e23;
  font-family: 'Caveat', cursive;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e0d7b6;
  font-size: 1rem;
`;

const Select = styled.select`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e0d7b6;
  font-size: 1rem;
`;

export default function WastageFields({ value = {}, onChange }) {
  return (
    <MiddleContainer>
      <Field>
        <Label>Wastage</Label>
        <Input
          type="number"
          min={0}
          value={value.wastage || ''}
          onChange={e => onChange({ ...value, wastage: e.target.value })}
          placeholder="Wastage"
        />
        <Select
          value={value.wastageType || 'percent'}
          onChange={e => onChange({ ...value, wastageType: e.target.value })}
        >
          <option value="percent">%</option>
          <option value="value">Value</option>
        </Select>
      </Field>
      <Field>
        <Label>Production Time</Label>
        <Input
          type="text"
          value={value.time || ''}
          onChange={e => onChange({ ...value, time: e.target.value })}
          placeholder="e.g. 2h 30m"
        />
      </Field>
      <Field>
        <Label>Outsource?</Label>
        <Select
          value={value.outsource || 'no'}
          onChange={e => onChange({ ...value, outsource: e.target.value })}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </Field>
    </MiddleContainer>
  );
}
