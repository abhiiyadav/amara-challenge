import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export type Candidate = {
  [key: string]: string | number | boolean;
};

export function parseCSVToJSON(csvString: string): Candidate[] {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const entry: Candidate = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
}

export function loadCandidatesFromCSV() {
  const filePath = path.join(process.cwd(), 'candidates.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  return parsed.data;
}

export function filterCandidates(candidates: any[], filter: { [key: string]: any }) {
  return candidates.filter((candidate) => {
    return Object.entries(filter).every(([key, val]) => {
      const candidateVal = candidate[key];
      if (!candidateVal) return false;
      // return candidateVal.toString().toLowerCase();
      return candidateVal.toString().toLowerCase().includes(val.toString().toLowerCase());
    });
  });
}

// Example: Ranking candidates
export function rankCandidates(
  candidates: any[],
  rank: { sort_by: string; order: 'ascending' | 'descending' }
): any[] {
  const { sort_by, order } = rank;

  return [...candidates].sort((a, b) => {
    const valA = parseFloat(a[sort_by]) || 0;
    const valB = parseFloat(b[sort_by]) || 0;

    return order === 'ascending' ? valA - valB : valB - valA;
  });
}

