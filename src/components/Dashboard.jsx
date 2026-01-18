import React from 'react';
import { useData } from '../contexts/DataContext';
import './Dashboard.css';

function Dashboard() {
  const { data } = useData();

  const stats = {
    totalClients: data.clients.length,
    activeCampaigns: data.campaigns.filter(c => c.status === 'active').length,
    upcomingContent: data.contentCalendar.filter(item => {
      const itemDate = new Date(item.publishDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return itemDate >= today && itemDate <= nextWeek;
    }).length,
    totalCampaigns: data.campaigns.length
  };

  const recentCampaigns = data.campaigns.slice(-5).reverse();
  const upcomingContent = data.contentCalendar
    .filter(item => new Date(item.publishDate) >= new Date())
    .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your marketing consultancy activities</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-label">Total Clients</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeCampaigns}</div>
            <div className="stat-label">Active Campaigns</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.upcomingContent}</div>
            <div className="stat-label">Content This Week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCampaigns}</div>
            <div className="stat-label">Total Campaigns</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Recent Campaigns</h2>
          </div>
          {recentCampaigns.length > 0 ? (
            <div className="campaign-list">
              {recentCampaigns.map(campaign => (
                <div key={campaign.id} className="campaign-item">
                  <div>
                    <div className="campaign-name">{campaign.name}</div>
                    <div className="campaign-client">{campaign.clientName}</div>
                  </div>
                  <span className={`status-badge ${campaign.status}`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No campaigns yet</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Upcoming Content</h2>
          </div>
          {upcomingContent.length > 0 ? (
            <div className="content-list">
              {upcomingContent.map(item => (
                <div key={item.id} className="content-item">
                  <div>
                    <div className="content-title">{item.title}</div>
                    <div className="content-meta">
                      {item.platform} • {new Date(item.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming content scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
