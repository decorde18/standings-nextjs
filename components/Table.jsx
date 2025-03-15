'use client';
import React, { useState, useMemo } from 'react';
import styles from '@/styles/components/Table.module.css';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from './ui/Select';

import { usePathname, useRouter } from 'next/navigation';
import { formatDate, formatTime } from '@/utils/dataHelpers';

const Table = ({
  columns,
  data,
  handleRow,
  selected,
  handleDelete,
  handleInput,
  handleSelect,
  rowsPerPage = 10,
}) => {
  const pathname = usePathname();

  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState([{ key: '', value: '' }]);
  const [currentRow, setCurrentRow] = useState(+selected);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const handleRowClick = (rowId) => {
    setCurrentRow(rowId);

    if (handleRow) handleRow(rowId);
    else router.push(`${pathname}/${rowId}`);
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((row) =>
    filters.every(({ key, value }) => {
      if (!key || !value) return true; // Skip filters that aren't set properly
      return row[key]?.toString().toLowerCase().includes(value.toLowerCase());
    })
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (index, value) => {
    const updatedFilters = [...filters];
    updatedFilters[index].value = value;
    setFilters(updatedFilters);
  };

  const handleColumnSelect = (index, column) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { key: column, value: '' };
    setFilters(updatedFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { key: '', value: '' }]);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  return (
    <div className={styles.tableContainer}>
      <div className={styles.addFilterContainer}>
        <Button
          onClick={addFilter}
          style={{
            width: 'auto',
            minWidth: '18rem',
            alignSelf: 'flex-start',
          }}
        >
          Add Filter
        </Button>
      </div>
      <div className={styles.filterContainer}>
        {filters.map((filter, index) => (
          <div key={index} className={styles.filterGroup}>
            <Select
              value={filter.key}
              onChange={(e) => handleColumnSelect(index, e.target.value)}
              options={columns
                .filter((column) => column?.filter !== false)
                .map((column) => ({
                  value: column.name,
                  label: column.label,
                }))}
            />
            <Input
              value={filter.value}
              onChange={(e) => handleFilterChange(index, e.target.value)}
              placeholder="Enter filter value"
              disabled={!filter.key}
            />
            <Button onClick={() => removeFilter(index)}>Remove</Button>
          </div>
        ))}
      </div>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns
              .filter((column) => column.display !== false)
              .map((column) => (
                <th
                  key={column.name}
                  onClick={() => {
                    if (column.sort !== false) requestSort(column.name);
                  }}
                  style={{
                    textAlign:
                      column.align ||
                      (column.type === 'number' ? 'right' : 'left'),
                  }}
                >
                  {column.label}
                  {column.sort !== false && sortConfig?.key === column.name
                    ? sortConfig.direction === 'ascending'
                      ? ' 🔼'
                      : ' 🔽'
                    : null}
                </th>
              ))}
            {handleDelete && <th></th>}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {paginatedData.map((row, index) => (
            <tr
              key={row.id || index}
              className={`${styles.tableRow} ${
                currentRow === row.id && styles.selected
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(row.id)}
            >
              {columns
                .filter((column) => column.display !== false)
                .map((column) => (
                  <td
                    key={column.name}
                    className={column.bold === true ? styles.boldColumn : ''}
                    style={{
                      textAlign:
                        column.align ||
                        (column.type === 'number' ? 'right' : 'left'),
                    }}
                  >
                    {column.input !== true ? (
                      column.type === 'date' ? (
                        formatDate(row[column.name])
                      ) : column.type === 'time' ? (
                        formatTime(row[column.name])
                      ) : (
                        row[column.name]
                      )
                    ) : (
                      <Input
                        name={column.name}
                        value={row[column.name]}
                        type={column.type}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                        }}
                        onBlur={(e) =>
                          handleInput({
                            name: e.target.id,
                            value: e.target.value,
                            rowId: row.id,
                          })
                        }
                      />
                    )}
                  </td>
                ))}
              {handleDelete && (
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row.id);
                  }}
                >
                  🗑️
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <div className={styles.paginationControls}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Table;
