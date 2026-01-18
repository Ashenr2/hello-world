import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }) {
  const [data, setData] = useState({
    clients: [],
    campaigns: [],
    contentCalendar: [],
    reports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (window.electronAPI) {
        const loadedData = await window.electronAPI.loadData();
        setData(loadedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.saveData(newData);
        setData(newData);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addClient = (client) => {
    const newData = {
      ...data,
      clients: [...data.clients, { ...client, id: Date.now().toString() }]
    };
    saveData(newData);
  };

  const updateClient = (id, updatedClient) => {
    const newData = {
      ...data,
      clients: data.clients.map(c => c.id === id ? { ...c, ...updatedClient } : c)
    };
    saveData(newData);
  };

  const deleteClient = (id) => {
    const newData = {
      ...data,
      clients: data.clients.filter(c => c.id !== id)
    };
    saveData(newData);
  };

  const addCampaign = (campaign) => {
    const newData = {
      ...data,
      campaigns: [...data.campaigns, { ...campaign, id: Date.now().toString() }]
    };
    saveData(newData);
  };

  const updateCampaign = (id, updatedCampaign) => {
    const newData = {
      ...data,
      campaigns: data.campaigns.map(c => c.id === id ? { ...c, ...updatedCampaign } : c)
    };
    saveData(newData);
  };

  const deleteCampaign = (id) => {
    const newData = {
      ...data,
      campaigns: data.campaigns.filter(c => c.id !== id)
    };
    saveData(newData);
  };

  const addContentItem = (item) => {
    const newData = {
      ...data,
      contentCalendar: [...data.contentCalendar, { ...item, id: Date.now().toString() }]
    };
    saveData(newData);
  };

  const updateContentItem = (id, updatedItem) => {
    const newData = {
      ...data,
      contentCalendar: data.contentCalendar.map(i => i.id === id ? { ...i, ...updatedItem } : i)
    };
    saveData(newData);
  };

  const deleteContentItem = (id) => {
    const newData = {
      ...data,
      contentCalendar: data.contentCalendar.filter(i => i.id !== id)
    };
    saveData(newData);
  };

  const value = {
    data,
    loading,
    addClient,
    updateClient,
    deleteClient,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addContentItem,
    updateContentItem,
    deleteContentItem
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
