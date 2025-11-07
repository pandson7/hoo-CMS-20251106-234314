import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api';

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/customers?search=${searchTerm}`);
      setCustomers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to search customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingCustomer) {
        await axios.put(`${API_BASE_URL}/customers/${editingCustomer.customer_id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/customers`, formData);
      }
      
      setFormData({ name: '', email: '', phone: '', address: '' });
      setShowForm(false);
      setEditingCustomer(null);
      fetchCustomers();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/customers/${customerId}`);
      fetchCustomers();
      setError('');
    } catch (err) {
      setError('Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Information Management System</h1>
      </header>

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} disabled={loading}>
              Search
            </button>
            <button onClick={fetchCustomers} disabled={loading}>
              Show All
            </button>
          </div>
          
          <button 
            onClick={() => setShowForm(true)} 
            className="add-button"
            disabled={loading}
          >
            Add New Customer
          </button>
        </div>

        {showForm && (
          <div className="form-overlay">
            <form onSubmit={handleSubmit} className="customer-form">
              <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  maxLength="100"
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  maxLength="20"
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  maxLength="500"
                  rows="3"
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingCustomer ? 'Update' : 'Create')}
                </button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="customers-section">
          <h2>Customers ({customers.length})</h2>
          
          {loading && <div className="loading">Loading...</div>}
          
          {customers.length === 0 && !loading ? (
            <div className="empty-state">
              <p>No customers found. Add your first customer to get started!</p>
            </div>
          ) : (
            <div className="customers-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone || '-'}</td>
                      <td>{customer.address || '-'}</td>
                      <td>{new Date(customer.registration_date).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="edit-button"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.customer_id)}
                          className="delete-button"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;