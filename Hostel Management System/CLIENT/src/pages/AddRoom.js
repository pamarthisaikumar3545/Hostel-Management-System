import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRoom.css';

const AddRoom = () => {
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    building: 'Vedavathi',
    floor: 1,
    capacity: 3,
    rent: 8000,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'floor' || name === 'rent' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(false);

      const response = await fetch('/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRoom)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to add room');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-room">
      <h1>Add New Room</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Room added successfully! Redirecting...</div>}

      <form onSubmit={handleSubmit} className="add-room-form">
        <div className="form-group">
          <label htmlFor="roomNumber">Room Number</label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={newRoom.roomNumber}
            onChange={handleInputChange}
            placeholder="Enter room number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="building">Building</label>
          <input
            type="text"
            id="building"
            name="building"
            value={newRoom.building}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="floor">Floor</label>
          <input
            type="number"
            id="floor"
            name="floor"
            value={newRoom.floor}
            onChange={handleInputChange}
            min="1"
            max="1"
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <select
            id="capacity"
            name="capacity"
            value={newRoom.capacity}
            onChange={handleInputChange}
            required
          >
            <option value="3">3 Students</option>
            <option value="4">4 Students</option>
            <option value="5">5 Students</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rent">Rent (₹)</label>
          <select
            id="rent"
            name="rent"
            value={newRoom.rent}
            onChange={handleInputChange}
            required
          >
            <option value="8000">₹8,000 (3 Students)</option>
            <option value="6000">₹6,000 (4 Students)</option>
            <option value="5000">₹5,000 (5 Students)</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Add Room</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom; 