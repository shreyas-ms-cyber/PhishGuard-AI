import { useState, useEffect } from 'react';
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

  // Theme-aware text color
  const getTextColor = () => {
    return theme === 'dark' ? '#dde2f8' : '#0f172a';
  };
  const getGridColor = () => {
    return theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  // Common chart options factory
  const createOptions = (customOptions = {}) => ({
    plugins: {
      legend: {
        labels: {
          color: getTextColor(),
          font: { family: 'Inter' }
        }
      },
      ...(customOptions.plugins || {})
    },
    scales: {
      x: {
        ticks: { color: getTextColor(), font: { family: 'Inter' } },
        grid: { color: getGridColor() }
      },
      y: {
        ticks: { color: getTextColor(), font: { family: 'Inter' } },
        grid: { color: getGridColor() }
      },
      ...(customOptions.scales || {})
    },
    responsive: true,
    maintainAspectRatio: false,
    ...customOptions
  });

  // Risk Distribution
  const riskChartData = {
    labels: ['Safe', 'Suspicious', 'High Risk'],
    datasets: [{
      data: [stats.safe, stats.suspicious, stats.high_risk],
      backgroundColor: ['#00D26A', '#FFC857', '#FF3B5C'],
      borderColor: ['#00D26A', '#FFC857', '#FF3B5C'],
      borderWidth: 1
    }]
  };
  const riskOptions = createOptions({
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: getTextColor(), font: { family: 'Inter' } }
      }
    }
  });

  // Trend Chart
  const trendChartData = {
    labels: trendData.dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Analyses per Day',
      data: trendData.counts,
      borderColor: '#00E5FF',
      backgroundColor: 'rgba(0, 229, 255, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00E5FF'
    }]
  };
  const trendOptions = createOptions();

  // Top Keywords
  const keywordChartData = {
    labels: keywords.keywords.length ? keywords.keywords : ['No data'],
    datasets: [{
      label: 'Occurrences',
      data: keywords.counts.length ? keywords.counts : [0],
      backgroundColor: '#00E5FF',
      borderRadius: 4
    }]
  };
  const keywordOptions = createOptions();

  // Attack Patterns
  const attackData = {
    labels: Object.keys(attackPatterns.patterns),
    datasets: [{
      label: 'Count',
      data: Object.values(attackPatterns.patterns),
      backgroundColor: '#FFC857',
      borderRadius: 4
    }]
  };
  const attackOptions = createOptions();

  // Top Domains
  const domainData = {
    labels: topDomains.domains.length ? topDomains.domains : ['No data'],
    datasets: [{
      label: 'Occurrences',
      data: topDomains.counts.length ? topDomains.counts : [0],
      backgroundColor: '#00E5FF',
      borderRadius: 4
    }]
  };
  const domainOptions = createOptions();

  // Rule Frequency
  const ruleData = {
    labels: ruleFrequency.rules.length ? ruleFrequency.rules : ['No data'],
    datasets: [{
      label: 'Frequency',
      data: ruleFrequency.counts.length ? ruleFrequency.counts : [0],
      backgroundColor: '#41ee82',
      borderRadius: 4
    }]
  };
  const ruleOptions = createOptions();

  return (
    <div className="space-y-4 pt-4 md:pt-0 w-full max-w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Real-time threat intelligence overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 glass-card rounded-full">
            <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden">
              <span className="material-symbols-outlined text-on-surface">person</span>
            </div>
            <span className="font-label-code text-label-code text-on-surface">{user?.username || 'Agent'}</span>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div>
              <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs md:text-sm">Total Analyzed</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
            </div>
            <div>
              <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs md:text-sm">Safe</p>
              <p className="font-headline-sm text-headline-sm text-secondary">{stats.safe}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-tertiary-container/10 border border-tertiary-container/20">
              <span className="material-symbols-outlined text-tertiary-container">warning</span>
            </div>
            <div>
              <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs md:text-sm">Suspicious</p>
              <p className="font-headline-sm text-headline-sm text-tertiary-container">{stats.suspicious}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-error/10 border border-error/20">
              <span className="material-symbols-outlined text-error">error</span>
            </div>
            <div>
              <p className="font-label-code text-label-code text-on-surface-variant uppercase text-xs md:text-sm">High Risk</p>
              <p className="font-headline-sm text-headline-sm text-error">{stats.high_risk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* First Row: Risk Distribution + Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Risk Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut data={riskChartData} options={riskOptions} />
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-xl w-full lg:col-span-2">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Weekly Analysis Trend (Last 30 Days)</h3>
          <div className="h-56 flex items-center justify-center">
            <Line data={trendChartData} options={trendOptions} />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Top Suspicious Keywords</h3>
          <div className="h-48 flex items-center justify-center">
            <Bar data={keywordChartData} options={keywordOptions} />
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Attack Patterns</h3>
          <div className="h-48 flex items-center justify-center">
            <Bar data={attackData} options={attackOptions} />
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Top Suspicious Domains</h3>
          <div className="h-48 flex items-center justify-center">
            <Bar data={domainData} options={domainOptions} />
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Detection Rule Frequency</h3>
          <div className="h-48 flex items-center justify-center">
            <Bar data={ruleData} options={ruleOptions} />
          </div>
        </div>
      </div>

      {/* MITRE Frequency */}
      {mitreFrequency.mitre && mitreFrequency.mitre.length > 0 && (
        <div className="glass-card p-4 md:p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">MITRE ATT&CK Technique Frequency</h3>
          <div className="space-y-3">
            {mitreFrequency.mitre.map((item) => (
              <div key={item.technique_id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container/30 border border-outline-variant/10">
                <div>
                  <span className="font-label-code text-label-code text-primary">{item.technique_id}</span>
                  <span className="ml-2 font-body-md text-on-surface">{item.technique_name}</span>
                </div>
                <span className="font-body-md text-on-surface-variant">{item.count} times</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Footer */}
      <div className="glass-card p-4 md:p-6 rounded-xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">info</span>
          <div>
            <p className="font-body-sm text-body-sm text-on-surface">
              Built by <span className="font-semibold text-primary">Shreyas M S</span> – Cybersecurity Analyst &amp; SOC Enthusiast
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              PhishGuard AI uses heuristic‑based analysis to detect phishing in real time.
            </p>
          </div>
        </div>
        <Link to="/about" className="btn-secondary flex-shrink-0 text-sm">
          Learn More
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
