// Stub types for test-builder store - used in template files
// These are minimal type definitions to satisfy imports

export interface Element {
  id: string;
  type: string;
  [key: string]: any;
}

export interface Column {
  id: string;
  elements: Element[];
  [key: string]: any;
}

export interface Row {
  id: string;
  columns: Column[];
  [key: string]: any;
}

export interface Section {
  id: string;
  rows: Row[];
  [key: string]: any;
}





