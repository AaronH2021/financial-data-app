import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { fetchIncomeStatements } from './utils/api';

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ dateRange: [2020, 2024], revenueRange: [0, Infinity] });
  const [sortKey, setSortKey] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchIncomeStatements();
      if (fetchedData.length) setData(fetchedData);
      else setError('Failed to fetch data.');
    };

    loadData();
  }, []);

  const applyFilters = (data) => {
    return data.filter(
      (row) =>
        parseInt(row.date.split('-')[0]) >= filters.dateRange[0] &&
        parseInt(row.date.split('-')[0]) <= filters.dateRange[1] &&
        row.revenue >= filters.revenueRange[0] &&
        row.revenue <= filters.revenueRange[1]
    );
  };

  const sortedData = [...applyFilters(data)].sort((a, b) => {
    if (sortKey === 'date') {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    }
    return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
  });

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Financial Data Filtering App</h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {/* Filters Panel */}
          <FilterPanel filters={filters} setFilters={setFilters} />

          {/* Sorting Panel */}
          <SortPanel setSortKey={setSortKey} setSortOrder={setSortOrder} />

          {/* Data Table */}
          <DataTable data={sortedData} />
        </>
      )}
    </div>
  );
};

const FilterPanel = ({ filters, setFilters }) => (
  <div className="mb-4">
    <label className="block">
      Date Range:
      <input
        type="number"
        placeholder="Start Year"
        className="border p-1 mx-2"
        value={filters.dateRange[0]}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, dateRange: [e.target.value, prev.dateRange[1]] }))
        }
      />
      -
      <input
        type="number"
        placeholder="End Year"
        className="border p-1 mx-2"
        value={filters.dateRange[1]}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, dateRange: [prev.dateRange[0], e.target.value] }))
        }
      />
    </label>
    <label className="block">
      Revenue Range:
      <input
        type="number"
        placeholder="Min"
        className="border p-1 mx-2"
        value={filters.revenueRange[0]}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, revenueRange: [e.target.value, prev.revenueRange[1]] }))
        }
      />
      -
      <input
        type="number"
        placeholder="Max"
        className="border p-1 mx-2"
        value={filters.revenueRange[1]}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, revenueRange: [prev.revenueRange[0], e.target.value] }))
        }
      />
    </label>
  </div>
);

const SortPanel = ({ setSortKey, setSortOrder }) => (
  <div className="mb-4">
    <label className="block">
      Sort By:
      <select className="border p-1 mx-2" onChange={(e) => setSortKey(e.target.value)}>
        <option value="date">Date</option>
        <option value="revenue">Revenue</option>
        <option value="netIncome">Net Income</option>
      </select>
      <select className="border p-1 mx-2" onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </label>
  </div>
);

const DataTable = ({ data }) => (
  <table className="min-w-full border-collapse border border-gray-200">
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-4 py-2">Date</th>
        <th className="border px-4 py-2">Revenue</th>
        <th className="border px-4 py-2">Net Income</th>
        <th className="border px-4 py-2">Gross Profit</th>
        <th className="border px-4 py-2">EPS</th>
        <th className="border px-4 py-2">Operating Income</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx} className="hover:bg-gray-50">
          <td className="border px-4 py-2">{row.date}</td>
          <td className="border px-4 py-2">{row.revenue}</td>
          <td className="border px-4 py-2">{row.netIncome}</td>
          <td className="border px-4 py-2">{row.grossProfit}</td>
          <td className="border px-4 py-2">{row.eps}</td>
          <td className="border px-4 py-2">{row.operatingIncome}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default App;
