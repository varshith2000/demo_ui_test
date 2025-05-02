import React, { useState } from 'react';
import GoodsInputRow from './GoodsInputRow';
import WastageFields from './WastageFields';
import ConfirmationModal from './ConfirmationModal';

// For demo, use a static list. Replace with Excel import logic later.
const initialGoodsList = ['Flour', 'Sugar', 'Oil'];

export default function ProductionStage({ stageIndex, initialData, onComplete, isLast }) {
  const [goodsList, setGoodsList] = useState(initialGoodsList);
  const [rawGoods, setRawGoods] = useState(initialData?.rawGoods || [{ name: '', qty: '' }]);
  const [outputGoods, setOutputGoods] = useState(initialData?.outputGoods || [{ name: '', qty: '' }]);
  const [middleFields, setMiddleFields] = useState(initialData?.middleFields || {});
  const [modal, setModal] = useState({ open: false, goodName: '', type: '' });

  // Handle adding/removing rows
  const handleRawChange = (idx, val) => {
    const arr = [...rawGoods];
    arr[idx] = val;
    setRawGoods(arr);
  };
  const handleRawRemove = (idx) => {
    setRawGoods(rawGoods.filter((_, i) => i !== idx));
  };
  const handleRawAdd = () => {
    setRawGoods([...rawGoods, { name: '', qty: '' }]);
  };

  // Output goods
  const handleOutputChange = (idx, val) => {
    const arr = [...outputGoods];
    arr[idx] = val;
    setOutputGoods(arr);
  };
  const handleOutputRemove = (idx) => {
    setOutputGoods(outputGoods.filter((_, i) => i !== idx));
  };
  const handleOutputAdd = () => {
    setOutputGoods([...outputGoods, { name: '', qty: '' }]);
  };

  // Modal for new good
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
    setModal({ open: false, goodName: '', type: '' });
  };
  const handleModalCancel = () => setModal({ open: false, goodName: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onComplete) {
      onComplete({ rawGoods, outputGoods, middleFields });
    }
  };

  return (
    <form style={{ marginBottom: 32 }} onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* Left: Raw/Intermediate Goods */}
        <div style={{ flex: 1, margin: '0 16px' }}>
          <h3 style={{ textAlign: 'center', color: '#6b8e23' }}>Raw/Intermediate Goods</h3>
          {rawGoods.map((row, idx) => (
            <GoodsInputRow
              key={idx}
              goodsList={goodsList}
              value={row}
              onChange={val => handleRawChange(idx, val)}
              onRemove={() => handleRawRemove(idx)}
              onAddNew={() => handleAddNewGood('raw', idx)}
              allowRemove={rawGoods.length > 1}
            />
          ))}
          <button type="button" onClick={handleRawAdd} style={{ marginTop: 8 }}>+ Add Row</button>
        </div>
        {/* Middle: Wastage, etc. */}
        <div style={{ flex: 1, margin: '0 16px' }}>
          <h3 style={{ textAlign: 'center', color: '#6b8e23' }}>Production Details</h3>
          <WastageFields value={middleFields} onChange={setMiddleFields} />
        </div>
        {/* Right: Output Goods */}
        <div style={{ flex: 1, margin: '0 16px' }}>
          <h3 style={{ textAlign: 'center', color: '#6b8e23' }}>Output Goods</h3>
          {outputGoods.map((row, idx) => (
            <GoodsInputRow
              key={idx}
              goodsList={goodsList}
              value={row}
              onChange={val => handleOutputChange(idx, val)}
              onRemove={() => handleOutputRemove(idx)}
              onAddNew={() => handleAddNewGood('output', idx)}
              allowRemove={outputGoods.length > 1}
            />
          ))}
          <button type="button" onClick={handleOutputAdd} style={{ marginTop: 8 }}>+ Add Row</button>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button type="submit" style={{
          background: '#6b8e23', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: '1.1rem', cursor: 'pointer', marginTop: 10
        }}>
          {isLast ? 'Finish' : 'Next'}
        </button>
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
