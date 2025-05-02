import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f9f7e8;
`;

const Card = styled.div`
  background: #fffbe6;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 32px 40px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-family: 'Caveat', cursive;
`;

const Input = styled.input`
  font-size: 1.1rem;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0d7b6;
  margin-bottom: 20px;
  width: 80px;
  text-align: center;
`;

const Button = styled.button`
  background: #6b8e23;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
  &:hover {
    background: #4e6b18;
  }
`;

export default function StageSelector({ onSelect }) {
  const [stages, setStages] = useState(1);

  const handleChange = (e) => {
    setStages(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stages > 0) onSelect(stages);
  };

  return (
    <Container>
      <Card>
        <Label htmlFor="stages">How many production stages?</Label>
        <Input
          id="stages"
          type="number"
          min={1}
          value={stages}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit}>Start</Button>
      </Card>
    </Container>
  );
}
