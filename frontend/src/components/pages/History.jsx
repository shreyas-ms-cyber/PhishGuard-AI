import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const History = () => {
  // Filter state
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

  // Fetch function with filters
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

  // Refetch when filters or offset change
  useEffect(() => {
    fetchHistory();
  }, [filters, offset]);

  // Reset to first page when filters change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOffset(0);
  };

  const getRiskBadge = (level) => {
    if (level === 'Safe') return 'bg-secondary/10 text-secondary border-secondary/20';
    if (level === 'Suspicious') return 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20';
    return 'bg-error/10 text-error border-error/20';
  };

  const nextPage = () => {
    if (offset + limit < total) setOffset(offset + limit);
  };
  const prevPage = () => {
    if (offset - limit >= 0) setOffset(offset - limit);
  };

  return (
    <div className="space-y-4 pt-4 md:pt-0 w-full max-w-full">
      <header>
        <h2 className="font-headline-md text-headline-md font-bold text-primary">Analysis History</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Review all past email analyses.</p>
      </header>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
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
          {/* Risk Level */}
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
          {/* Sort By */}
          <div>
            <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Sort By</label>
            <select
              value={`${filters.sort_by}:${filters.sort_order}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split(':');
                handleFilterChange('sort_by', sort_by);
                handleFilterChange('sort_order', sort_order);
              }}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
            >
              <option value="created_at:desc">Newest First</option>
              <option value="created_at:asc">Oldest First</option>
              <option value="risk_score:desc">Risk: High→Low</option>
              <option value="risk_score:asc">Risk: Low→High</option>
            </select>
          </div>
          {/* Date Range */}
          <div>
            <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-1/2 bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
              />
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-1/2 bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => {
              setFilters({
                search: '',
                risk_level: '',
                sort_by: 'created_at',
                sort_order: 'desc',
                start_date: '',
                end_date: ''
              });
              setOffset(0);
            }}
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="glass-card p-4 md:p-6 rounded-xl overflow-hidden w-full">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-primary animate-pulse">Loading...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl block mb-4 opacity-30">history</span>
            <p>No analyses found matching the filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left py-3 px-4 font-label-code text-label-code text-on-surface-variant uppercase">ID</th>
                    <th className="text-left py-3 px-4 font-label-code text-label-code text-on-surface-variant uppercase">Subject</th>
                    <th className="text-left py-3 px-4 font-label-code text-label-code text-on-surface-variant uppercase">Score</th>
                    <th className="text-left py-3 px-4 font-label-code text-label-code text-on-surface-variant uppercase">Level</th>
                    <th className="text-left py-3 px-4 font-label-code text-label-code text-on-surface-variant uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-variant/5 transition-colors">
                      <td className="py-3 px-4 font-label-code text-label-code">#{item.id}</td>
                      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface">
                        <Link to={`/result/${item.id}`} className="hover:text-primary transition-colors">
                          {item.subject || 'No subject'}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface">{item.risk_score}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-label-code text-[10px] uppercase border ${getRiskBadge(item.risk_level)}`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface-variant">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {history.map((item) => (
                <div key={item.id} className="glass-card p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/result/${item.id}`} className="font-headline-sm text-sm text-primary hover:underline">
                      {item.subject || 'No subject'}
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase border ${getRiskBadge(item.risk_level)}`}>
                      {item.risk_level}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Score: {item.risk_score}</span>
                    <span>#{item.id}</span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-outline-variant/10">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={offset === 0}
                  className="px-4 py-2 glass-card rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={offset + limit >= total}
                  className="px-4 py-2 glass-card rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
