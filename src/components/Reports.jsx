import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

function Reports() {
  const { data } = useData();
  const [reportType, setReportType] = useState('overview');

  const generateOverviewStats = () => {
    const totalBudget = data.campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);
    const activeCampaigns = data.campaigns.filter(c => c.status === 'active').length;
    const completedCampaigns = data.campaigns.filter(c => c.status === 'completed').length;
    const upcomingContent = data.contentCalendar.filter(item =>
      new Date(item.publishDate) >= new Date() && item.status === 'scheduled'
    ).length;

    return {
      totalBudget,
      activeCampaigns,
      completedCampaigns,
      totalCampaigns: data.campaigns.length,
      totalClients: data.clients.length,
      totalContent: data.contentCalendar.length,
      upcomingContent,
      publishedContent: data.contentCalendar.filter(i => i.status === 'published').length
    };
  };

  const generateClientReport = () => {
    const clientStats = {};

    data.clients.forEach(client => {
      const clientCampaigns = data.campaigns.filter(c =>
        c.clientName.toLowerCase() === client.name.toLowerCase() ||
        c.clientName.toLowerCase() === client.company.toLowerCase()
      );

      const clientContent = data.contentCalendar.filter(item =>
        item.clientName && (
          item.clientName.toLowerCase() === client.name.toLowerCase() ||
          item.clientName.toLowerCase() === client.company.toLowerCase()
        )
      );

      const totalBudget = clientCampaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);

      clientStats[client.id] = {
        name: client.company,
        campaigns: clientCampaigns.length,
        activeCampaigns: clientCampaigns.filter(c => c.status === 'active').length,
        content: clientContent.length,
        budget: totalBudget
      };
    });

    return clientStats;
  };

  const generateCampaignReport = () => {
    const byStatus = {
      planning: data.campaigns.filter(c => c.status === 'planning').length,
      active: data.campaigns.filter(c => c.status === 'active').length,
      paused: data.campaigns.filter(c => c.status === 'paused').length,
      completed: data.campaigns.filter(c => c.status === 'completed').length
    };

    const totalBudgetByStatus = {
      planning: data.campaigns.filter(c => c.status === 'planning').reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0),
      active: data.campaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0),
      paused: data.campaigns.filter(c => c.status === 'paused').reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0),
      completed: data.campaigns.filter(c => c.status === 'completed').reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0)
    };

    return { byStatus, totalBudgetByStatus };
  };

  const generateContentReport = () => {
    const byPlatform = {};
    const platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Blog', 'Email', 'YouTube'];

    platforms.forEach(platform => {
      const items = data.contentCalendar.filter(i => i.platform === platform);
      byPlatform[platform] = {
        total: items.length,
        scheduled: items.filter(i => i.status === 'scheduled').length,
        published: items.filter(i => i.status === 'published').length,
        draft: items.filter(i => i.status === 'draft').length
      };
    });

    return byPlatform;
  };

  const overviewStats = generateOverviewStats();
  const clientReport = generateClientReport();
  const campaignReport = generateCampaignReport();
  const contentReport = generateContentReport();

  return (
    <div>
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Insights and analytics for your marketing operations</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
          <button
            className={`btn ${reportType === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('overview')}
          >
            Overview
          </button>
          <button
            className={`btn ${reportType === 'clients' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('clients')}
          >
            Client Reports
          </button>
          <button
            className={`btn ${reportType === 'campaigns' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('campaigns')}
          >
            Campaign Reports
          </button>
          <button
            className={`btn ${reportType === 'content' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('content')}
          >
            Content Reports
          </button>
        </div>
      </div>

      {reportType === 'overview' && (
        <div>
          <div className="card">
            <h2>Business Overview</h2>
            <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.totalClients}</div>
                  <div className="stat-label">Total Clients</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.totalCampaigns}</div>
                  <div className="stat-label">Total Campaigns</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.activeCampaigns}</div>
                  <div className="stat-label">Active Campaigns</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">${overviewStats.totalBudget.toLocaleString()}</div>
                  <div className="stat-label">Total Budget</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Content Overview</h2>
            <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.totalContent}</div>
                  <div className="stat-label">Total Content Items</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.upcomingContent}</div>
                  <div className="stat-label">Upcoming</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.publishedContent}</div>
                  <div className="stat-label">Published</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{overviewStats.completedCampaigns}</div>
                  <div className="stat-label">Completed Campaigns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'clients' && (
        <div className="card">
          <h2>Client Performance Report</h2>
          {Object.keys(clientReport).length > 0 ? (
            <table className="table" style={{ marginTop: '1.5rem' }}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Total Campaigns</th>
                  <th>Active Campaigns</th>
                  <th>Content Items</th>
                  <th>Total Budget</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(clientReport).map((client, idx) => (
                  <tr key={idx}>
                    <td>{client.name}</td>
                    <td>{client.campaigns}</td>
                    <td>{client.activeCampaigns}</td>
                    <td>{client.content}</td>
                    <td>${client.budget.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No client data available</p>
            </div>
          )}
        </div>
      )}

      {reportType === 'campaigns' && (
        <div>
          <div className="card">
            <h2>Campaign Status Distribution</h2>
            <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{campaignReport.byStatus.planning}</div>
                  <div className="stat-label">Planning</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                    ${campaignReport.totalBudgetByStatus.planning.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{campaignReport.byStatus.active}</div>
                  <div className="stat-label">Active</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                    ${campaignReport.totalBudgetByStatus.active.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{campaignReport.byStatus.paused}</div>
                  <div className="stat-label">Paused</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                    ${campaignReport.totalBudgetByStatus.paused.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{campaignReport.byStatus.completed}</div>
                  <div className="stat-label">Completed</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                    ${campaignReport.totalBudgetByStatus.completed.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'content' && (
        <div className="card">
          <h2>Content by Platform</h2>
          <table className="table" style={{ marginTop: '1.5rem' }}>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Total</th>
                <th>Scheduled</th>
                <th>Published</th>
                <th>Draft</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(contentReport)
                .filter(([_, stats]) => stats.total > 0)
                .map(([platform, stats]) => (
                  <tr key={platform}>
                    <td>{platform}</td>
                    <td>{stats.total}</td>
                    <td>{stats.scheduled}</td>
                    <td>{stats.published}</td>
                    <td>{stats.draft}</td>
                  </tr>
                ))}
              {Object.values(contentReport).every(stats => stats.total === 0) && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#9ca3af' }}>
                    No content data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;
