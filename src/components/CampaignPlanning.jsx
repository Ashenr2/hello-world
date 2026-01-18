import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

function CampaignPlanning() {
  const { data, addCampaign, updateCampaign, deleteCampaign } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    objective: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    description: '',
    targetMetrics: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCampaign) {
      updateCampaign(editingCampaign.id, formData);
    } else {
      addCampaign(formData);
    }
    resetForm();
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      clientName: campaign.clientName,
      objective: campaign.objective,
      budget: campaign.budget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      description: campaign.description || '',
      targetMetrics: campaign.targetMetrics || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      clientName: '',
      objective: '',
      budget: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      description: '',
      targetMetrics: ''
    });
    setEditingCampaign(null);
    setShowModal(false);
  };

  const getStatusCounts = () => {
    return {
      planning: data.campaigns.filter(c => c.status === 'planning').length,
      active: data.campaigns.filter(c => c.status === 'active').length,
      completed: data.campaigns.filter(c => c.status === 'completed').length,
      paused: data.campaigns.filter(c => c.status === 'paused').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      <div className="page-header">
        <h1>Campaign Planning & Tracking</h1>
        <p>Manage your marketing campaigns</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{statusCounts.planning}</div>
            <div className="stat-label">Planning</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{statusCounts.active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{statusCounts.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{statusCounts.paused}</div>
            <div className="stat-label">Paused</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Campaigns ({data.campaigns.length})</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Campaign
          </button>
        </div>

        {data.campaigns.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Client</th>
                <th>Objective</th>
                <th>Budget</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.clientName}</td>
                  <td>{campaign.objective}</td>
                  <td>${campaign.budget}</td>
                  <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
                  <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${campaign.status}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(campaign)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No campaigns yet</h3>
            <p>Click "Add Campaign" to start planning</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Campaign Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Objective *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="e.g., Increase brand awareness, Generate leads"
                  required
                />
              </div>
              <div className="form-group">
                <label>Budget ($) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Target Metrics</label>
                <textarea
                  className="form-control"
                  value={formData.targetMetrics}
                  onChange={(e) => setFormData({ ...formData, targetMetrics: e.target.value })}
                  placeholder="e.g., 10,000 impressions, 500 clicks, 50 conversions"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCampaign ? 'Update' : 'Add'} Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignPlanning;
