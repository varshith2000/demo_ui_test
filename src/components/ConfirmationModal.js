import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalBox = styled.div`
  background: #fffbe6;
  border-radius: 12px;
  padding: 32px 40px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  min-width: 320px;
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
  margin: 0 10px;
  transition: background 0.2s;
  &:hover {
    background: #4e6b18;
  }
`;

export default function ConfirmationModal({ open, onConfirm, onCancel, goodName }) {
  const [inputValue, setInputValue] = React.useState(goodName || '');

  React.useEffect(() => {
    setInputValue(goodName || '');
  }, [goodName, open]);

  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <h2>New Good Detected</h2>
        <p>
          <span style={{ fontWeight: 500 }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter new product name"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e0d7b6',
                fontSize: '1rem',
                minWidth: '180px',
                marginBottom: '8px',
                marginRight: '4px',
              }}
              autoFocus
            />
          </span>
          is not in the list. Add it to the master list?
        </p>
        <div style={{ marginTop: 24 }}>
          <Button onClick={() => onConfirm(inputValue)} disabled={!inputValue.trim()}>
            Yes, Add
          </Button>
          <Button onClick={onCancel} style={{ background: '#ccc', color: '#333' }}>Cancel</Button>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
}
