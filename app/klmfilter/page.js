'use client';

import { useState, useEffect, useRef } from 'react';
import { createSupabaseClientWithSchema } from '../../lib/supabaseClient';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  Button
} from '@mui/material';

export default function GetTablesWithData() {
  const [selectedSchema, setSelectedSchema] = useState('january_2025'); // Default schema
  const [supabase, setSupabase] = useState(createSupabaseClientWithSchema(selectedSchema));

  const [tables, setTables] = useState([]); // Stores all table names
  const [selectedTable, setSelectedTable] = useState(''); // Stores the currently selected table
  const [tableData, setTableData] = useState([]); // Stores data from the selected table or all tables
  const [filteredData, setFilteredData] = useState([]); // Stores filtered data based on the Action and Employee Id columns
  const [actionFilter, setActionFilter] = useState(''); // Stores the filter value for the Action column
  const [employeeIdFilter, setEmployeeIdFilter] = useState(''); // Stores the filter value for the Employee Id column
  const [availableActions, setAvailableActions] = useState([]); // Stores unique actions for the current table
  const [availableEmployeeIds, setAvailableEmployeeIds] = useState([]); // Stores unique employee ids for the current table
  const [error, setError] = useState(''); // Error message if any operation fails
  const [loading, setLoading] = useState(true); // Loading state indicator
  const tableContainerRef = useRef(null); // Ref for the table container

  // Effect to fetch data whenever Supabase client is created or selected schema changes
  useEffect(() => {
    async function fetchAllTableNames() {
      try {
        const { data, error } = await supabase.rpc('get_all_tables'); // RPC function to fetch table names

        if (error) {
          console.error('Error fetching table names:', error.message);
          setError(error.message);
        } else {
          const sortedTables = data.sort(); // Sort table names in ascending order
          setTables(sortedTables);
          fetchAllTablesData(sortedTables); // Fetch data from all tables initially
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      }
    }

    fetchAllTableNames();
  }, [supabase]); // Dependency on `supabase` to trigger the effect when it changes

  // Fetch data from all tables
  const fetchAllTablesData = async (tableNames) => {
    setLoading(true);
    setError('');
    try {
      let combinedData = [];

      for (const table of tableNames) {
        const { data, error } = await supabase.from(table).select('*'); // Fetch all rows and columns from each table

        if (error) {
          console.error(`Error fetching data from table ${table}:`, error.message);
          setError(`Error fetching data from table ${table}: ${error.message}`);
        } else {
          combinedData = [...combinedData, ...data.map(row => ({ ...row, tableName: table }))];
        }
      }

      combinedData.sort((a, b) => a[Object.keys(a)[0]] < b[Object.keys(b)[0]] ? -1 : 1); // Sort data in ascending order
      setTableData(combinedData); // Store the combined data from all tables
      setFilteredData(combinedData); // Initialize filtered data
      setAvailableActions([...new Set(combinedData.map(row => row.Action).filter(Boolean))]); // Extract unique actions
      setAvailableEmployeeIds([...new Set(combinedData.map(row => row['Employee Id']).filter(Boolean))]); // Extract unique employee ids
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred while fetching table data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from a single table
  const fetchTableData = async (tableName) => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.from(tableName).select('*');

      if (error) {
        console.error(`Error fetching data from table ${tableName}:`, error.message);
        setError(`Error fetching data from table ${tableName}: ${error.message}`);
      } else {
        data.sort((a, b) => a[Object.keys(a)[0]] < b[Object.keys(b)[0]] ? -1 : 1); // Sort data in ascending order
        const tableDataWithNames = data.map(row => ({ ...row, tableName })); // Store the fetched table data with table name
        setTableData(tableDataWithNames);
        setFilteredData(tableDataWithNames); // Initialize filtered data
        setAvailableActions([...new Set(tableDataWithNames.map(row => row.Action).filter(Boolean))]); // Extract unique actions
        setAvailableEmployeeIds([...new Set(tableDataWithNames.map(row => row['Employee Id']).filter(Boolean))]); // Extract unique employee ids
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred while fetching table data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle schema change
  const handleSchemaChange = (event) => {
    const newSchema = event.target.value;
    setSelectedSchema(newSchema); // Update selected schema
    setSupabase(createSupabaseClientWithSchema(newSchema)); // Update Supabase client with the new schema
  };

  const handleTableChange = (event) => {
    const tableName = event.target.value;
    setSelectedTable(tableName);
    setActionFilter(''); // Reset action filter when table changes
    setEmployeeIdFilter(''); // Reset employee id filter when table changes
    if (tableName === 'All Tables') {
      fetchAllTablesData(tables); // Fetch data for all tables
    } else {
      fetchTableData(tableName); // Fetch data for the selected table
    }
  };

  const handleActionFilterChange = (event) => {
    const filterValue = event.target.value;
    setActionFilter(filterValue);
    filterData(filterValue, employeeIdFilter);
  };

  const handleEmployeeIdFilterChange = (event) => {
    const filterValue = event.target.value;
    setEmployeeIdFilter(filterValue);
    filterData(actionFilter, filterValue);
  };

  const filterData = (action, employeeId) => {
    let filtered = tableData;
    if (action) {
      filtered = filtered.filter(row => row.Action && row.Action === action);
    }
    if (employeeId) {
      filtered = filtered.filter(row => row['Employee Id'] && row['Employee Id'] === employeeId);
    }
    setFilteredData(filtered);
  };

  const downloadCSV = () => {
    if (!filteredData || filteredData.length === 0) return; // Ensure there is data to download

    // Get headers from the keys of the first data row
    const headers = Object.keys(filteredData[0]);

    // Prepare rows by converting each object into a CSV row
    const rows = filteredData.map(row =>
      headers.map(header => `"${row[header]}"`).join(',')
    );

    // Add the header row at the start
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create a link to trigger the CSV download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Backdrop open={loading} style={{ zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" gutterBottom>
        Tables and Data
      </Typography>
      <Button variant="contained" color="primary" onClick={downloadCSV}>
        Download CSV
      </Button>

      <FormControl fullWidth>
        <InputLabel>Choose Schema</InputLabel>
        <Select
          value={selectedSchema}
          onChange={handleSchemaChange}
          label="Choose Schema"
        >
          <MenuItem value="january_2025">January 2025</MenuItem>
          <MenuItem value="december_2024">December 2024</MenuItem>
          {/* Add more schemas here */}
        </Select>
      </FormControl>
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select a Table</InputLabel>
            <Select
              value={selectedTable}
              onChange={handleTableChange}
              label="Select a Table"
            >
              <MenuItem value="All Tables">All Tables</MenuItem>
              {tables.map((table, index) => (
                <MenuItem key={index} value={table}>{table}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {availableActions.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Filter by Action</InputLabel>
              <Select
                value={actionFilter}
                onChange={handleActionFilterChange}
                label="Filter by Action"
              >
                <MenuItem value="">All Actions</MenuItem>
                {availableActions.map((action, index) => (
                  <MenuItem key={index} value={action}>{action}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {availableEmployeeIds.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Filter by Employee Id</InputLabel>
              <Select
                value={employeeIdFilter}
                onChange={handleEmployeeIdFilterChange}
                label="Filter by Employee Id"
              >
                <MenuItem value="">All Employee Ids</MenuItem>
                {availableEmployeeIds.map((employeeId, index) => (
                  <MenuItem key={index} value={employeeId}>{employeeId}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Available Rows: {filteredData.length}
          </Typography>

          <TableContainer
            component={Paper}
            ref={tableContainerRef}
            sx={{ cursor: 'grab', overflow: 'auto', userSelect: 'none' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(filteredData[0] || {}).map((column, index) => (
                    <TableCell key={index}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.keys(row).map((column, columnIndex) => (
                      <TableCell key={columnIndex}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}
