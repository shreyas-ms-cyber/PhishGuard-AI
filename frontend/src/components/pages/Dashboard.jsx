import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler);

const Dashboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    suspicious: 0,
    high_risk: 0,
    avg_score: 0
  });
  const [trendData, setTrendData] = useState({ dates: [], counts: [] });
  const [keywords, setKeywords] = useState({ keywords: [], counts: [] });
  const [attackPatterns, setAttackPatterns] = useState({ patterns: {} });
  const [topDomains, setTopDomains] = useState({ domains: [], counts: [] });
  const [ruleFrequency, setRuleFrequency] = useState({ rules: [], counts: [] });
  const [mitreFrequency, setMitreFrequency] = useState({ mitre: [] });
  const [loading, setLoading] = useState(true);
  const [counted, setCounted] = useState(false);
  const countRefs = useRef({});

  const isDark = theme === 'dark';
  const textColor = isDark ? '#F1F5F9' : '#0F172A';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendRes, keywordRes, attackRes, domainsRes, rulesRes, mitreRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/trends?days=30'),
          api.get('/dashboard/top-keywords?limit=5'),
          api.get('/dashboard/attack-patterns'),
          api.get('/dashboard/top-domains?limit=5'),
          api.get('/dashboard/rule-frequency'),
          api.get('/dashboard/mitre-frequency')
        ]);
        setStats(statsRes.data);
        setTrendData(trendRes.data);
        setKeywords(keywordRes.data);
        setAttackPatterns(attackRes.data);
        setTopDomains(domainsRes.data);
        setRuleFrequency(rulesRes.data);
        setMitreFrequency(mitreRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animated counter
  useEffect(() => {
    if (!loading && !counted) {
      const animateCount = (key, target) => {
        const element = countRefs.current[key];
        if (!element) return;
        let current = 0;
        const duration = 800;
        const step = Math.max(1, Math.ceil(target / 30));
        const interval = duration / 30;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
          } else {
            element.textContent = current;
          }
        }, interval);
      };

      animateCount('total', stats.total);
      animateCount('safe', stats.safe);
      animateCount('suspicious', stats.suspicious);
      animateCount('high_risk', stats.high_risk);

      setCounted(true);
    }
  }, [loading, stats, counted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Chart options with theme awareness
  const barOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(13,20,34,0.9)' : 'rgba(255,255,255,0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: borderColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 } },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
      y: {
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const horizontalBarOptions = {
    ...barOptions,
    indexAxis: 'y',
  };

  // Risk Distribution Chart
  const riskChartData = {
    labels: ['Safe', 'Suspicious', 'High Risk'],
    datasets: [{
      data: [stats.safe, stats.suspicious, stats.high_risk],
      backgroundColor: ['#00D26A', '#FFC857', '#FF3B5C'],
      borderColor: isDark ? '#0B1120' : '#FFFFFF',
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const riskOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(13,20,34,0.9)' : 'rgba(255,255,255,0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: borderColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Weekly Trend Chart
  const trendChartData = {
    labels: trendData.dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Analyses per Day',
      data: trendData.counts,
      borderColor: '#00E5FF',
      backgroundColor: isDark ? 'rgba(0,229,255,0.08)' : 'rgba(0,229,255,0.12)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00E5FF',
      pointBorderColor: isDark ? '#0B1120' : '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
    }],
  };

  const trendOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(13,20,34,0.9)' : 'rgba(255,255,255,0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: borderColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 } },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
      y: {
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 }, stepSize: 1 },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Helper: Empty State Component
  const EmptyState = ({ title, description }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <span className="material-symbols-outlined text-4xl text-muted/30 mb-3">data_usage</span>
      <p className="font-display text-sm font-semibold text-on-surface/60">{title}</p>
      <p className="text-xs text-muted mt-1">{description}</p>
    </div>
  );

  // Helper: Bar chart with empty state
  const BarChartWithEmpty = ({ data, options, emptyTitle, emptyDescription }) => {
    const hasData = data.datasets[0].data.some(v => v > 0);
    if (!hasData) {
      return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }
    return <Bar data={data} options={options} />;
  };

  // Chart data builders
  const keywordChartData = {
    labels: keywords.keywords.length ? keywords.keywords : ['No data'],
    datasets: [{
      data: keywords.counts.length ? keywords.counts : [0],
      backgroundColor: isDark ? 'rgba(0,229,255,0.7)' : 'rgba(0,229,255,0.6)',
      borderColor: '#00E5FF',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const attackPatternData = {
    labels: Object.keys(attackPatterns.patterns).length ? Object.keys(attackPatterns.patterns) : ['No data'],
    datasets: [{
      data: Object.values(attackPatterns.patterns).length ? Object.values(attackPatterns.patterns) : [0],
      backgroundColor: isDark ? 'rgba(255,200,87,0.7)' : 'rgba(255,200,87,0.6)',
      borderColor: '#FFC857',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const domainChartData = {
    labels: topDomains.domains.length ? topDomains.domains : ['No data'],
    datasets: [{
      data: topDomains.counts.length ? topDomains.counts : [0],
      backgroundColor: isDark ? 'rgba(0,229,255,0.7)' : 'rgba(0,229,255,0.6)',
      borderColor: '#00E5FF',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const ruleChartData = {
    labels: ruleFrequency.rules.length ? ruleFrequency.rules : ['No data'],
    datasets: [{
      data: ruleFrequency.counts.length ? ruleFrequency.counts : [0],
      backgroundColor: isDark ? 'rgba(0,210,106,0.7)' : 'rgba(0,210,106,0.6)',
      borderColor: '#00D26A',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  // Stat cards with accent colors
  const statCards = [
    { key: 'total', label: 'Total Analyzed', value: stats.total, icon: 'analytics', color: 'text-primary', borderColor: 'border-primary/30' },
    { key: 'safe', label: 'Safe', value: stats.safe, icon: 'check_circle', color: 'text-status-safe', borderColor: 'border-status-safe/30' },
    { key: 'suspicious', label: 'Suspicious', value: stats.suspicious, icon: 'warning', color: 'text-status-suspicious', borderColor: 'border-status-suspicious/30' },
    { key: 'high_risk', label: 'High Risk', value: stats.high_risk, icon: 'error', color: 'text-status-high-risk', borderColor: 'border-status-high-risk/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-muted text-sm">Real-time threat intelligence overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 border border-status-safe/20">
            <span className="material-symbols-outlined text-primary text-sm">bolt</span>
            <span className="font-label-code text-[10px] text-secondary uppercase tracking-wider">Live Feed</span>
            <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div 
            key={card.key} 
            className={`glass-card p-4 rounded-xl hover:translate-y-[-2px] transition-all duration-200 border-t-2 ${card.borderColor}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${card.color.replace('text', 'bg')}/10`}>
                <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
              </div>
              <div>
                <p className="font-label-code text-[10px] text-muted uppercase tracking-wider">{card.label}</p>
                <p
                  ref={(el) => (countRefs.current[card.key] = el)}
                  className="font-display text-2xl font-bold text-on-surface"
                >
                  0
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-on-surface">Risk Distribution</h3>
            <span className="font-label-code text-[10px] text-muted uppercase tracking-wider">{stats.total} Total</span>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <Doughnut data={riskChartData} options={riskOptions} />
          </div>
        </div>
        <div className="lg:col-span-3 glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-on-surface">Weekly Analysis Trend</h3>
            <span className="font-label-code text-[10px] text-muted uppercase tracking-wider">Last 30 Days</span>
          </div>
          <div className="h-64">
            <Line data={trendChartData} options={trendOptions} />
          </div>
        </div>
      </div>

      {/* Threat Intelligence Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Top Suspicious Keywords</h3>
          <div className="h-48">
            <BarChartWithEmpty
              data={keywordChartData}
              options={horizontalBarOptions}
              emptyTitle="No Suspicious Keywords Detected Yet"
              emptyDescription="Run an analysis to populate this panel."
            />
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Attack Patterns</h3>
          <div className="h-48">
            <BarChartWithEmpty
              data={attackPatternData}
              options={horizontalBarOptions}
              emptyTitle="No Attack Patterns Detected"
              emptyDescription="Run analyses to see attack patterns."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Top Suspicious Domains</h3>
          <div className="h-48">
            <BarChartWithEmpty
              data={domainChartData}
              options={horizontalBarOptions}
              emptyTitle="No Suspicious Domains Detected"
              emptyDescription="Suspicious domains will appear here once detected."
            />
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Detection Rule Frequency</h3>
          <div className="h-48">
            <BarChartWithEmpty
              data={ruleChartData}
              options={horizontalBarOptions}
              emptyTitle="No Detection Rules Triggered"
              emptyDescription="Rules will appear here once triggered."
            />
          </div>
        </div>
      </div>

      {/* MITRE Frequency */}
      {mitreFrequency.mitre && mitreFrequency.mitre.length > 0 && (
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-display text-sm font-semibold text-on-surface mb-4">MITRE ATT&CK Technique Frequency</h3>
          <div className="space-y-3">
            {mitreFrequency.mitre.map((item) => (
              <div key={item.technique_id} className="flex items-center justify-between p-3 rounded-lg bg-surface/30 border border-glass-border">
                <div className="flex items-center gap-3">
                  <span className="font-label-code text-xs text-primary">{item.technique_id}</span>
                  <span className="font-body-sm text-sm text-on-surface">{item.technique_name}</span>
                </div>
                <span className="font-label-code text-xs text-muted">{item.count} times</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Credit */}
      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">info</span>
          <p className="font-body-sm text-sm text-on-surface-variant">
            Built by <span className="font-semibold text-primary">Shreyas M S</span> – Cybersecurity Analyst &amp; SOC Enthusiast
          </p>
        </div>
        <Link to="/about" className="text-primary hover:underline text-sm font-medium transition-colors">
          Learn More →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
