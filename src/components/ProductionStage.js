import React, { useState } from 'react';
import GoodsInputRow from './GoodsInputRow';
import WastageFields from './WastageFields';
import ConfirmationModal from './ConfirmationModal';

const initialGoodsList = ['Flour', 'Sugar', 'Oil'];

export default function ProductionStage({ stageIndex, initialData, onComplete, onPrevious, isLast }) {
  const [goodsList, setGoodsList] = useState(initialGoodsList);
  const [rawGoods, setRawGoods] = useState(initialData?.rawGoods || [{ name: '', qty: '', dimension: '' }]);
  const [outputGoods, setOutputGoods] = useState(initialData?.outputGoods || [{ name: '', qty: '', dimension: '' }]);
  const [middleFields, setMiddleFields] = useState(initialData?.middleFields || {
    wastageEntries: [{ good: '', wastage: '', type: 'percent' }],
    time: '',
    outsource: 'no'
  });
  const [modal, setModal] = useState({ open: false, goodName: '', type: '', idx: -1 });
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Handle adding/removing raw goods rows
  const handleRawChange = (idx, val) => {
    const arr = [...rawGoods];
    arr[idx] = val;
    setRawGoods(arr);
  };

  const handleRawRemove = (idx) => {
    setRawGoods(rawGoods.filter((_, i) => i !== idx));
  };

  const handleRawAdd = () => {
    setRawGoods([...rawGoods, { name: '', qty: '', dimension: '' }]);
  };

  // Get selected raw goods for wastage dropdown
  const selectedRawGoods = rawGoods.filter(g => g.name).map(g => g.name);

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    // Validate rawGoods
    const validateGoods = (goods, type) => {
      const invalidRows = goods
        .map((g, idx) => ({ ...g, idx }))
        .filter(g => !g.name || !g.qty || !g.dimension);
      
      if (invalidRows.length > 0) {
        errors[`${type}Goods`] = invalidRows.map(row => 
          `Row ${row.idx + 1}: ${!row.name ? 'name' : !row.qty ? 'quantity' : 'dimension'} is required`
        );
      }
    };

    validateGoods(rawGoods, 'raw');
    validateGoods(outputGoods, 'output');

    // Validate wastage entries
    const { wastageEntries = [] } = middleFields;
    if (wastageEntries.length === 0) {
      errors.wastageEntries = [{ good: 'At least one wastage entry is required' }];
    } else {
      const invalidEntries = wastageEntries
        .map((entry, idx) => ({ ...entry, idx }))
        .filter(entry => !entry.good || !entry.wastage);

      if (invalidEntries.length > 0) {
        errors.wastageEntries = invalidEntries.map(entry => ({
          good: !entry.good ? 'Please select a good' : undefined,
          wastage: !entry.wastage ? 'Please enter wastage amount' : undefined
        }));
      }
    }

    // Validate production time
    if (!middleFields.time) {
      errors.time = 'Please enter production time';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Output goods handlers
  const handleOutputChange = (idx, val) => {
    const arr = [...outputGoods];
    arr[idx] = val;
    setOutputGoods(arr);
  };

  const handleOutputRemove = (idx) => {
    setOutputGoods(outputGoods.filter((_, i) => i !== idx));
  };

  const handleOutputAdd = () => {
    setOutputGoods([...outputGoods, { name: '', qty: '', dimension: '' }]);
  };

  // Modal handlers
  const handleAddNewGood = (type, idx) => {
    let name = '';
    if (type === 'raw') name = rawGoods[idx].name;
    else name = outputGoods[idx].name;
    setModal({ open: true, goodName: name, type, idx });
  };

  const handleModalConfirm = (newName) => {
    const { type, idx } = modal;
    setGoodsList([...goodsList, newName]);
    if (type === 'raw') {
      const arr = [...rawGoods];
      arr[idx] = { ...arr[idx], name: newName };
      setRawGoods(arr);
    } else {
      const arr = [...outputGoods];
      arr[idx] = { ...arr[idx], name: newName };
      setOutputGoods(arr);
    }
    setModal({ open: false, goodName: '', type: '', idx: -1 });
  };

  const handleModalCancel = () => setModal({ open: false, goodName: '', type: '', idx: -1 });

  // Navigation handlers
  const handleNext = (e) => {
    e.preventDefault();
    setShowErrors(true);
    const isValid = validateForm();
    if (isValid && onComplete) {
      onComplete({ rawGoods, outputGoods, middleFields });
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    // Save current state even when going back
    if (onPrevious) {
      onPrevious({ rawGoods, outputGoods, middleFields });
    }
  };

  return (
    <form style={{ marginBottom: 32 }} onSubmit={handleNext}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
        {/* Left: Raw/Intermediate Goods */}
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: '#6b8e23', marginBottom: '16px' }}>Raw/Intermediate Goods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rawGoods.map((row, idx) => (
              <GoodsInputRow
                key={idx}
                goodsList={goodsList}
                value={row}
                onChange={val => handleRawChange(idx, val)}
                onRemove={() => handleRawRemove(idx)}
                onAddNew={() => handleAddNewGood('raw', idx)}
                allowRemove={rawGoods.length > 1}
                showDimension
                error={showErrors && validationErrors.rawGoods?.find(err => err.startsWith(`Row ${idx + 1}:`))}
              />
            ))}
            <button 
              type="button" 
              onClick={handleRawAdd}
              style={{
                alignSelf: 'flex-start',
                background: '#f0f0f0',
                border: '1px dashed #6b8e23',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                color: '#6b8e23'
              }}
            >
              + Add Raw Good
            </button>
          </div>
        </div>

        {/* Middle: Wastage, etc. */}
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: '#6b8e23', marginBottom: '16px' }}>Production Details</h3>
          <WastageFields
            value={middleFields}
            onChange={setMiddleFields}
            wastageGoods={selectedRawGoods}
            errors={showErrors ? validationErrors : {}}
          />
        </div>

        {/* Right: Output Goods */}
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: '#6b8e23', marginBottom: '16px' }}>Output Goods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {outputGoods.map((row, idx) => (
              <GoodsInputRow
                key={idx}
                goodsList={goodsList}
                value={row}
                onChange={val => handleOutputChange(idx, val)}
                onRemove={() => handleOutputRemove(idx)}
                onAddNew={() => handleAddNewGood('output', idx)}
                allowRemove={outputGoods.length > 1}
                showDimension
                error={showErrors && validationErrors.outputGoods?.find(err => err.startsWith(`Row ${idx + 1}:`))}
              />
            ))}
            <button 
              type="button" 
              onClick={handleOutputAdd}
              style={{
                alignSelf: 'flex-start',
                background: '#f0f0f0',
                border: '1px dashed #6b8e23',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                color: '#6b8e23'
              }}
            >
              + Add Output Good
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        {showErrors && Object.keys(validationErrors).length > 0 && (
          <div style={{ color: '#d32f2f', marginBottom: 16, padding: '8px', background: '#ffebee', borderRadius: '4px' }}>
            Please fix the validation errors before proceeding
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {stageIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              style={{
                background: '#f0f0f0',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '10px 32px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#e0e0e0',
                }
              }}
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            style={{
              background: showErrors && Object.keys(validationErrors).length > 0 ? '#b5b5b5' : '#6b8e23',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              fontSize: '1.1rem',
              cursor: showErrors && Object.keys(validationErrors).length > 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={modal.open}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        goodName={modal.goodName}
      />
    </form>
  );
}