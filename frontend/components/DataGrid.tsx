'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useStore, type Segment } from '@/lib/store';
import type { ColDef } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridProps {
  segment: Segment;
}

export default function DataGrid({ segment }: DataGridProps) {
  const { scrapedData, updateFilters, updateHiddenColumns } = useStore();
  
  const data = scrapedData[segment] || [];

  // Log data for debugging
  useEffect(() => {
    console.log(`DataGrid for ${segment}:`, {
      hasData: data.length > 0,
      rowCount: data.length,
      firstRow: data[0]
    });
  }, [segment, data]);

  // Generate column definitions dynamically
  const columnDefs = useMemo<ColDef[]>(() => {
    if (data.length === 0) return [];

    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => {
      const sampleValue = firstRow[key];
      const isNumeric = typeof sampleValue === 'number';
      const isChange = key.toUpperCase().includes('CHG');

      return {
        field: key,
        headerName: key,
        filter: true,
        sortable: true,
        resizable: true,
        cellStyle: (params: any) => {
          const style: any = {};
          
          // Numeric alignment
          if (isNumeric) {
            style.textAlign = 'right';
          }

          // Color coding for change columns
          if (isChange && typeof params.value === 'number') {
            if (params.value > 0) {
              style.color = '#10b981'; // emerald-500
            } else if (params.value < 0) {
              style.color = '#f43f5e'; // rose-500
            }
          }

          return style;
        },
      };
    });
  }, [data]);

  // Default column definition
  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

  // Handle filter changes
  const onFilterChanged = useCallback((event: any) => {
    const filterModel = event.api.getFilterModel();
    const filters = Object.entries(filterModel).map(([field, model]: [string, any]) => ({
      field,
      values: model.values || [],
    }));
    updateFilters(segment, filters);
  }, [segment, updateFilters]);

  // Handle column visibility changes
  const onColumnVisible = useCallback((event: any) => {
    const hiddenCols = event.columnApi
      .getAllColumns()
      .filter((col: any) => !col.isVisible())
      .map((col: any) => col.getColId());
    updateHiddenColumns(segment, hiddenCols);
  }, [segment, updateHiddenColumns]);

  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
        <p className="text-zinc-500">
          No data available for {segment.replace('_', ' ')}
        </p>
        <p className="text-sm text-zinc-600 mt-2">
          Run the scraper to fetch data
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">
          {segment.replace('_', ' ')} Data
        </h3>
        <span className="text-sm text-zinc-500">
          {data.length} rows
        </span>
      </div>

      <div className="ag-theme-quartz-dark" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={50}
          onFilterChanged={onFilterChanged}
          onColumnVisible={onColumnVisible}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          animateRows={true}
        />
      </div>
    </div>
  );
}
