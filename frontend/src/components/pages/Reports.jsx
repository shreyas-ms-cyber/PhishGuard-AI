import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    suspicious: 0,
    high_risk: 0,
    avg_score: 0
  });
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    risk_level: '',
    search: ''
  });
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all pages (max 100 per request)
      let allItems = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const params = new URLSearchParams({
          limit: limit,
          offset: offset,
          ...(filters.search && { search: filters.search }),
          ...(filters.risk_level && { risk_level: filters.risk_level }),
          ...(filters.start_date && { start_date: filters.start_date }),
          ...(filters.end_date && { end_date: filters.end_date }),
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        const response = await api.get(`/dashboard/history?${params.toString()}`);
        const data = response.data;
        if (data.items && data.items.length > 0) {
          allItems = allItems.concat(data.items);
          offset += limit;
          if (offset >= data.total) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      if (allItems.length === 0) {
        setError('No data found for the selected filters.');
        setLoading(false);
        return;
      }

      // Prepare report data
      const rows = allItems.map(item => [
        item.id,
        new Date(item.created_at).toLocaleDateString(),
        item.subject || 'No subject',
        item.risk_score,
        item.risk_level
      ]);

      const headers = [['ID', 'Date', 'Subject', 'Risk Score', 'Risk Level']];

      if (format === 'csv') {
        const csvContent = [
          headers[0].join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phishguard-report-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const doc = new jsPDF('landscape', 'pt', 'a4');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('PhishGuard AI - Analysis Report', 40, 40);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 60);
        doc.setTextColor(0);

        autoTable(doc, {
          head: headers,
          body: rows,
          startY: 80,
          styles: { fontSize: 8, cellPadding: 4 },
          headStyles: { fillColor: [0, 150, 200] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        doc.save(`phishguard-report-${new Date().toISOString().slice(0,10)}.pdf`);
      }
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 md:pt-0 w-full max-w-full">
      <header>
        <h2 className="font-headline-md text-headline-md font-bold text-primary">Reports</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Generate and download analysis reports.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        <div className="glass-card p-4 rounded-xl w-full">
          <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">Total</p>
          <p className="font-headline-sm text-headline-sm text-on-surface">{stats.total}</p>
        </div>
        <div className="glass-card p-4 rounded-xl w-full">
          <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">Safe</p>
          <p className="font-headline-sm text-headline-sm text-secondary">{stats.safe}</p>
        </div>
        <div className="glass-card p-4 rounded-xl w-full">
          <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">Suspicious</p>
          <p className="font-headline-sm text-headline-sm text-tertiary-container">{stats.suspicious}</p>
        </div>
        <div className="glass-card p-4 rounded-xl w-full">
          <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">High Risk</p>
          <p className="font-headline-sm text-headline-sm text-error">{stats.high_risk}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Search</label>
            <input
              type="text"
              placeholder="ID or subject..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Risk Level</label>
            <select
              value={filters.risk_level}
              onChange={(e) => handleFilterChange('risk_level', e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
            >
              <option value="">All</option>
              <option value="Safe">Safe</option>
              <option value="Suspicious">Suspicious</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>
          <div>
            <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="font-label-code text-label-code text-on-surface-variant block mb-1">End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Format Selection & Generate */}
      <div className="glass-card p-4 rounded-xl w-full flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="font-label-code text-label-code text-on-surface-variant">Format</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('pdf')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${format === 'pdf' ? 'bg-primary/20 text-primary border border-primary/30' : 'glass-card text-on-surface-variant hover:text-primary'}`}
            >
              PDF
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${format === 'csv' ? 'bg-primary/20 text-primary border border-primary/30' : 'glass-card text-on-surface-variant hover:text-primary'}`}
            >
              CSV
            </button>
          </div>
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          className="btn-primary w-full md:w-auto"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Generating...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">file_download</span>
              Generate Report
            </>
          )}
        </button>
        {error && <p className="text-error text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Reports;
