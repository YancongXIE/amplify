import React, { useState } from 'react';

const DataTable = ({ data, columns, onAdd, onEdit, onDelete }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{item[column.field]}</td>
              ))}
              <td>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn btn-primary mt-4"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add New
      </button>
    </div>
  );
};

export default DataTable; 