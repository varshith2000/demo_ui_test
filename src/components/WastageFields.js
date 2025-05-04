import React from 'react';
import styled from 'styled-components';

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #6b8e23;
  font-family: 'Caveat', cursive;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${props => props.hasError ? '#d32f2f' : '#e0d7b6'};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#d32f2f' : '#6b8e23'};
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${props => props.hasError ? '#d32f2f' : '#e0d7b6'};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#d32f2f' : '#6b8e23'};
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
  &:hover {
    background: #ffe2a9;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 0.75rem;
  padding-left: 4px;
`;

const WastageEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e0d7b6;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &:hover {
    background: #b71c1c;
  }
`;

export default function WastageFields({ 
  value = {}, 
  onChange, 
  wastageGoods = [],
  errors = {}
}) {
  // Initialize wastageEntries if it doesn't exist
  const wastageEntries = value.wastageEntries || [{ good: '', wastage: '', type: 'percent' }];

  const handleWastageChange = (index, field, newValue) => {
    const newEntries = [...wastageEntries];
    newEntries[index] = { ...newEntries[index], [field]: newValue };
    onChange({ ...value, wastageEntries: newEntries });
  };

  const addWastageEntry = () => {
    const newEntries = [...wastageEntries, { good: '', wastage: '', type: 'percent' }];
    onChange({ ...value, wastageEntries: newEntries });
  };

  const removeWastageEntry = (index) => {
    const newEntries = wastageEntries.filter((_, i) => i !== index);
    onChange({ ...value, wastageEntries: newEntries });
  };

  return (
    <MiddleContainer>
      <Field>
        <Label>Wastage Entries</Label>
        {wastageEntries.map((entry, index) => (
          <WastageEntry key={index}>
            {wastageEntries.length > 1 && (
              <RemoveButton onClick={() => removeWastageEntry(index)}>×</RemoveButton>
            )}
            <InputRow>
              <Select
                value={entry.good || ''}
                onChange={e => handleWastageChange(index, 'good', e.target.value)}
                hasError={Boolean(errors.wastageEntries?.[index]?.good)}
                style={{ flex: 2 }}
              >
                <option value="">Select a good...</option>
                {wastageGoods.map(good => (
                  <option key={good} value={good}>{good}</option>
                ))}
              </Select>
            </InputRow>
            <InputRow>
              <Input
                type="number"
                min={0}
                value={entry.wastage || ''}
                onChange={e => handleWastageChange(index, 'wastage', e.target.value)}
                placeholder="Wastage"
                hasError={Boolean(errors.wastageEntries?.[index]?.wastage)}
              />
              <Select
                value={entry.type || 'percent'}
                onChange={e => handleWastageChange(index, 'type', e.target.value)}
                style={{ width: '100px' }}
              >
                <option value="percent">%</option>
                <option value="value">Value</option>
              </Select>
            </InputRow>
            {errors.wastageEntries?.[index]?.good && (
              <ErrorText>{errors.wastageEntries[index].good}</ErrorText>
            )}
            {errors.wastageEntries?.[index]?.wastage && (
              <ErrorText>{errors.wastageEntries[index].wastage}</ErrorText>
            )}
          </WastageEntry>
        ))}
        <Button type="button" onClick={addWastageEntry}>+ Add Wastage Entry</Button>
      </Field>

      <Field>
        <Label>Production Time</Label>
        <InputRow>
          <Input
            type="text"
            value={value.time || ''}
            onChange={e => onChange({ ...value, time: e.target.value })}
            placeholder="e.g. 2h 30m"
            hasError={Boolean(errors.time)}
          />
        </InputRow>
        {errors.time && <ErrorText>{errors.time}</ErrorText>}
      </Field>

      <Field>
        <Label>Outsource?</Label>
        <InputRow>
          <Select
            value={value.outsource || 'no'}
            onChange={e => onChange({ ...value, outsource: e.target.value })}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </InputRow>
      </Field>
    </MiddleContainer>
  );
}
