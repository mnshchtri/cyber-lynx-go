import React, { useEffect, useRef, useContext, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { ThemeContext } from '../context/ThemeContext';
import { useAddTargetModal } from '../context/AddTargetModalContext';
import AddTargetModal from '../components/AddTargetModal';
Chart.register(...registerables);

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { darkMode } = useContext(ThemeContext);
  const { isModalOpen, openModal, closeModal } = useAddTargetModal();
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const response = await fetch('/api/targets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTargets(data);
      } catch (error) {
        console.error('Error fetching targets:', error);
      }
    };

    fetchTargets();

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext('2d');

    const chartData = {
      labels: ['Nmap', 'Subfinder', 'Dirsearch', 'Ghauri'],
      datasets: [
        {
          label: 'Scans',
          data: [12, 8, 5, 3],
          backgroundColor: 'rgba(108, 99, 255, 0.6)',
          borderColor: 'rgba(108, 99, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Findings',
          data: [5, 12, 2, 1],
          backgroundColor: 'rgba(56, 161, 105, 0.6)',
          borderColor: 'rgba(56, 161, 105, 1)',
          borderWidth: 1,
        },
      ],
    };

    chartInstance.current = new Chart(myChartRef, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: darkMode ? '#a0aec0' : '#718096',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: darkMode ? '#a0aec0' : '#718096',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: darkMode ? '#a0aec0' : '#718096',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [darkMode]);

  const handleAddTarget = async (newTarget) => {
    try {
      const response = await fetch('/api/targets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTarget),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedTarget = await response.json();
      setTargets((prevTargets) => [...prevTargets, addedTarget]);
      console.log('New Target Added:', addedTarget);
      return addedTarget;
    } catch (error) {
      console.error('Error adding target:', error);
      throw error; // Re-throw so modal can handle it
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center">
        <svg className="w-8 h-8 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        Dashboard Overview
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Targets Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-text-secondary text-sm font-medium">Targets</div>
              <div className="text-muted text-xs">Active</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1" id="total-targets">{targets.length}</div>
          <div className="flex items-center text-muted text-sm">
            <svg className="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Total Scans Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-text-secondary text-sm font-medium">Scans</div>
              <div className="text-muted text-xs">Completed</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-success mb-1">12</div>
          <div className="flex items-center text-muted text-sm">
            <svg className="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>+8% from last week</span>
          </div>
        </div>

        {/* Total Findings Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-text-secondary text-sm font-medium">Findings</div>
              <div className="text-muted text-xs">Discovered</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-warning mb-1">7</div>
          <div className="flex items-center text-muted text-sm">
            <svg className="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>+3 new this week</span>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.047 2.061.582 4.015 1.381 5.813a11.955 11.955 0 013.04 8.618M12 21a9 9 0 100-18 9 9 0 000 18z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-text-secondary text-sm font-medium">Success</div>
              <div className="text-muted text-xs">Rate</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary mb-1">80%</div>
          <div className="flex items-center text-muted text-sm">
            <svg className="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>+2% improvement</span>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Scan Activity Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-primary flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Scan Activity
            </h3>
            <div className="flex space-x-2">
              <button className="btn btn-primary text-xs">Week</button>
              <button className="btn btn-secondary text-xs">Month</button>
              <button className="btn btn-secondary text-xs">Year</button>
            </div>
          </div>
          <div className="h-64">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="chart-container">
          <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-surface-light rounded-lg">
              <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-text-primary font-medium">Scan completed</div>
                <div className="text-text-secondary text-sm">example.com - 2 vulnerabilities found</div>
              </div>
              <div className="text-muted text-xs">2 min ago</div>
            </div>
            
            <div className="flex items-center p-3 bg-surface-light rounded-lg">
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-text-primary font-medium">New target added</div>
                <div className="text-text-secondary text-sm">192.168.1.100 - Network scan</div>
              </div>
              <div className="text-muted text-xs">15 min ago</div>
            </div>
            
            <div className="flex items-center p-3 bg-surface-light rounded-lg">
              <div className="w-10 h-10 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-text-primary font-medium">Vulnerability detected</div>
                <div className="text-text-secondary text-sm">SQL Injection - High severity</div>
              </div>
              <div className="text-muted text-xs">1 hour ago</div>
            </div>
            
            <div className="flex items-center p-3 bg-surface-light rounded-lg">
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-text-primary font-medium">Report generated</div>
                <div className="text-text-secondary text-sm">Security assessment - PDF format</div>
              </div>
              <div className="text-muted text-xs">3 hours ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Added Targets Section */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-text-primary flex items-center">
            <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Added Targets
          </h3>
          <button id="dashboard-add-target-btn" className="btn btn-primary" onClick={openModal}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Target
          </button>
        </div>
        <div id="targets-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targets.map(target => (
            <div key={target.id} className="target-card bg-surface-light p-4 rounded-lg shadow-md border-l-4 border-primary transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold text-primary">{target.type}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-text-secondary">Nov 28, 2025</span>
                  <button type="button" className="edit-target-btn bg-primary hover:opacity-90 text-white p-2 rounded transition-colors duration-200" title="Edit Target" aria-label="Edit Target">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button type="button" className="delete-target-btn bg-danger hover:opacity-90 text-white p-2 rounded transition-colors duration-200" title="Delete Target" aria-label="Delete Target">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-md text-text-primary mb-2">{target.value}</p>
              <p className="text-sm text-text-secondary">{target.description}</p>
            </div>
          ))}
        </div>
      </div>
      <AddTargetModal isOpen={isModalOpen} onClose={closeModal} onAddTarget={handleAddTarget} />
    </div>
  );
};

export default Dashboard;
