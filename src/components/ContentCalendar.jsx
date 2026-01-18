import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

function ContentCalendar() {
  const { data, addContentItem, updateContentItem, deleteContentItem } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    platform: 'Facebook',
    contentType: 'Post',
    publishDate: '',
    publishTime: '',
    status: 'scheduled',
    description: '',
    clientName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateContentItem(editingItem.id, formData);
    } else {
      addContentItem(formData);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      platform: item.platform,
      contentType: item.contentType,
      publishDate: item.publishDate,
      publishTime: item.publishTime,
      status: item.status,
      description: item.description || '',
      clientName: item.clientName || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      deleteContentItem(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: 'Facebook',
      contentType: 'Post',
      publishDate: '',
      publishTime: '',
      status: 'scheduled',
      description: '',
      clientName: ''
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const filteredContent = filterPlatform === 'all'
    ? data.contentCalendar
    : data.contentCalendar.filter(item => item.platform === filterPlatform);

  const sortedContent = [...filteredContent].sort((a, b) =>
    new Date(a.publishDate) - new Date(b.publishDate)
  );

  const platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Blog', 'Email', 'YouTube'];

  return (
    <div>
      <div className="page-header">
        <h1>Content Calendar</h1>
        <p>Schedule and manage your content across platforms</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2>Content Schedule ({filteredContent.length})</h2>
            <select
              className="form-control"
              style={{ width: 'auto', marginBottom: 0 }}
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Schedule Content
          </button>
        </div>

        {sortedContent.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Platform</th>
                <th>Type</th>
                <th>Client</th>
                <th>Publish Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedContent.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.platform}</td>
                  <td>{item.contentType}</td>
                  <td>{item.clientName || '-'}</td>
                  <td>{new Date(item.publishDate).toLocaleDateString()}</td>
                  <td>{item.publishTime}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(item)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
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
            <h3>No content scheduled</h3>
            <p>Click "Schedule Content" to add items to your calendar</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Content' : 'Schedule New Content'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Platform *</label>
                <select
                  className="form-control"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Content Type *</label>
                <select
                  className="form-control"
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  required
                >
                  <option value="Post">Post</option>
                  <option value="Story">Story</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Ad">Ad</option>
                </select>
              </div>
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Publish Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Publish Time *</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.publishTime}
                  onChange={(e) => setFormData({ ...formData, publishTime: e.target.value })}
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
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Content description, copy, or notes"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Schedule'} Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentCalendar;
