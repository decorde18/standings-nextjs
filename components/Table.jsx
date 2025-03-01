'use client';
import React, { useState } from 'react';
import styles from '@/styles/components/Table.module.css';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Table = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [filterInputs, setFilterInputs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
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

  const filteredData = sortedData.filter((row) => {
    return Object.keys(filterInputs).every((key) => {
      return row[key]
        .toString()
        .toLowerCase()
        .includes(filterInputs[key].toLowerCase());
    });
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e, header) => {
    setFilterInputs({
      ...filterInputs,
      [header]: e.target.value,
    });
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filterContainer}>
        {columns
          .filter((column) => column?.filter !== false)
          .map((column) => (
            <Input
              key={column.header}
              value={filterInputs[column.header] || ''}
              onChange={(e) => handleFilterChange(e, column.header)}
              placeholder={`Search ${column.header}`}
            />
          ))}
      </div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            {columns
              .filter((column) => column?.filter !== false)
              .map((column) => (
                <th
                  key={column.header}
                  onClick={() => {
                    if (column.sort !== false) requestSort(column.header);
                  }}
                >
                  {column.label}
                  {column.sort !== false &&
                  sortConfig &&
                  sortConfig.key === column.header
                    ? sortConfig.direction === 'ascending'
                      ? ' 🔼'
                      : ' 🔽'
                    : null}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {paginatedData.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              {columns
                .filter((column) => column?.filter !== false)
                .map((column) => (
                  <td key={column.header}>{row[column.header]}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
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
  );
};

export default Table;
