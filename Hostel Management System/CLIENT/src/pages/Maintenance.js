import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Maintenance.css';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [tenantBooking, setTenantBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookingAndRequests = async () => {
      if (!user) {
        setError('Please log in to manage maintenance requests.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const bookingResponse = await fetch(`/tenants?email=${user.email}&status=Active`);
        const bookings = await bookingResponse.json();

        if (bookings.length > 0) {
          setTenantBooking(bookings[0]);
        } else {
          setError('No active room booking found. You must have an active booking to submit a request.');
        }

        const requestsResponse = await fetch('/maintenanceRequests');
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to retrieve data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingAndRequests();
  }, [user]);

  const handleInputChange = useCallback((e) => {
    setNewRequest(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!tenantBooking) {
      alert(error || 'Cannot submit request without an active room booking.');
      return;
    }

    try {
      const response = await fetch('/maintenanceRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newRequest,
          roomId: tenantBooking.roomId,
          tenantId: tenantBooking._id,
          status: 'Pending',
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const data = await response.json();
      setRequests(prev => [...prev, data]);
      setNewRequest({
        title: '',
        description: '',
        priority: 'medium',
      });
      alert('Maintenance request submitted successfully!');
    } catch (err) {
      console.error('Error submitting maintenance request:', err);
      alert(`Failed to submit maintenance request: ${err.message}`);
    }
  }, [newRequest, tenantBooking, error]);

  if (isLoading) {
    return (
      <div className="maintenance">
        <h1>Maintenance Requests</h1>
        <div className="loading">Loading your booking details...</div>
      </div>
    );
  }

  return (
    <div className="maintenance">
      <h1>Maintenance Requests</h1>

      <div className="maintenance-container">
        <div className="new-request">
          <h2>Submit New Request</h2>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newRequest.title}
                onChange={handleInputChange}
                required
                disabled={!!error}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newRequest.description}
                onChange={handleInputChange}
                required
                disabled={!!error}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={newRequest.priority}
                onChange={handleInputChange}
                disabled={!!error}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !!error || !tenantBooking}
            >
              {isLoading ? 'Loading...' : (error || !tenantBooking ? 'Booking Required' : 'Submit Request')}
            </button>
          </form>
        </div>

        <div className="requests-list">
          <h2>All Requests</h2>
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>{request.title}</h3>
                <span className={`priority ${request.priority}`}>
                  {request.priority}
                </span>
              </div>
              <p className="description">{request.description}</p>
              <div className="request-details">
                <p>Room: {request.roomNumber || `ID: ${request.roomId}` || 'N/A'}</p> 
                <p>Status: <span className={`status ${request.status}`}>{request.status}</span></p>
                <p>Submitted: {new Date(request.reportedDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maintenance; 