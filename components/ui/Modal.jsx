import { useState } from 'react';

function Modal({ division, onClose, onViewTeams, onRemoveDivision }) {
  if (!division) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold">{division.name}</h2>
        <p className="text-gray-600">What would you like to do?</p>
        <div className="mt-4 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              onViewTeams(division.id);
              onClose();
            }}
          >
            View Teams
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              onRemoveDivision(division.id);
              onClose();
            }}
          >
            Remove Division
          </button>
        </div>
        <button
          className="mt-4 text-gray-500 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
export default Modal;
