import * as XLSX from 'xlsx';

export async function readGoodsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Assume first row is header, rest are goods
      const goods = json.slice(1).map(row => row[0]).filter(Boolean);
      resolve(goods);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function addGoodToExcel(existingData, newGood) {
  // existingData: array of goods (strings)
  // returns new array with newGood added if not present
  if (!existingData.includes(newGood)) {
    return [...existingData, newGood];
  }
  return existingData;
}
