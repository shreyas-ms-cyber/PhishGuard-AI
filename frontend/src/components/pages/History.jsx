import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const History = () => {
  const [filters, setFilters] = useState({
    search: '',
    risk_level: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    start_date: '',
    end_date: ''
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit,
        offset: offset,
        ...(filters.search && { search: filters.search }),
        ...(filters.risk_level && { risk_level: filters.risk_level }),
        ...(filters.start_date && { start_date: filters.start_date }),
        ...(filters.end_date && { end_date: filters.end_date }),
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });
      const response = await api.get(`/dashboard/history?${params.toString()}`);
      setHistory(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filters, offset]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOffset(0);
  };

  const getRiskBadge = (level) => {
    const classes = {
      'Safe': 'badge-safe',
      'Suspicious': 'badge-suspicious',
      'High Risk': 'badge-high-risk',
    };
    return classes[level] || 'badge-safe';
  };

  const getRiskDot = (level) => {
    const classes = {
      'Safe': 'status-dot green',
      'Suspicious': 'status-dot amber',
      'High Risk': 'status-dot red',
    };
    return classes[level] || 'status-dot green';
  };

  const nextPage = () => {
    if (offset + limit < total) setOffset(offset + limit);
  };
  const prevPage = () => {
    if (offset - limit >= 0) setOffset(offset - limit);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      risk_level: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      start_date: '',
      end_date: ''
    });
    setOffset(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4 md:pt-0 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">Analysis History</h1>
        <p className="text-muted text-sm">Review all past email analyses.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-5 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Search</label>
            <input
              type="text"
              placeholder="ID or subject..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Risk Level */}
          <div>
            <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Risk Level</label>
            <select
              value={filters.risk_level}
              onChange={(e) => handleFilterChange('risk_level', e.target.value)}
              className="w-full bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            >
              <option value="">All</option>
              <option value="Safe">Safe</option>
              <option value="Suspicious">Suspicious</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Sort By</label>
            <select
              value={`${filters.sort_by}:${filters.sort_order}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split(':');
                handleFilterChange('sort_by', sort_by);
                handleFilterChange('sort_order', sort_order);
              }}
              className="w-full bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            >
              <option value="created_at:desc">Newest First</option>
              <option value="created_at:asc">Oldest First</option>
              <option value="risk_score:desc">Risk: High → Low</option>
              <option value="risk_score:asc">Risk: Low → High</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-1/2 bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-1/2 bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="text-sm text-muted hover:text-primary transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="glass-card rounded-xl overflow-hidden">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-muted/30 mb-4">history</span>
            <p className="font-display text-lg font-semibold text-on-surface/60">No analyses found</p>
            <p className="text-muted text-sm mt-1">Try adjusting your filters or run a new analysis.</p>
            <Link to="/analyze" className="btn-primary mt-4">
              <span className="material-symbols-outlined">add</span>
              New Analysis
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 font-label-code text-[10px] text-muted uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-4 font-label-code text-[10px] text-muted uppercase tracking-wider">Subject</th>
                    <th className="text-left py-3 px-4 font-label-code text-[10px] text-muted uppercase tracking-wider">Score</th>
                    <th className="text-left py-3 px-4 font-label-code text-[10px] text-muted uppercase tracking-wider">Level</th>
                    <th className="text-left py-3 px-4 font-label-code text-[10px] text-muted uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-glass-border/50 hover:bg-surface/10 transition-colors group">
                      <td className="py-3 px-4 font-mono text-sm text-muted">#{item.id}</td>
                      <td className="py-3 px-4">
                        <Link to={`/result/${item.id}`} className="font-body-sm text-sm text-on-surface hover:text-primary transition-colors">
                          {item.subject || 'No subject'}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-on-surface">{item.risk_score}</td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(item.risk_level)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getRiskDot(item.risk_level)}`} />
                          {item.risk_level}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-glass-border">
              {history.map((item) => (
                <div key={item.id} className="p-4 space-y-2 hover:bg-surface/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <Link to={`/result/${item.id}`} className="font-body-sm text-sm text-on-surface hover:text-primary transition-colors flex-1">
                      {item.subject || 'No subject'}
                    </Link>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskBadge(item.risk_level)} flex-shrink-0`}>
                      <span className={`w-1 h-1 rounded-full ${getRiskDot(item.risk_level)}`} />
                      {item.risk_level}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="font-mono">#{item.id}</span>
                    <span className="font-mono">Score: {item.risk_score}</span>
                    <span className="font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <span className="font-body-sm text-sm text-muted">
            Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={offset === 0}
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={offset + limit >= total}
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
