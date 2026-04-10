import { useEffect, useState, useRef } from 'react';
import apiClient from '../services/apiClient';
import Button from '../components/Button';
import Card from '../components/Card';
import '../styles/admin-dashboard.css';
import { FaListAlt, FaCalendarAlt, FaClock, FaPhoneVolume, FaChartLine, FaSun, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';

export default function AdminCallbacks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortBy, setSortBy] = useState({ key: 'createdAt', dir: 'desc' });
  const [pollIntervalMs, setPollIntervalMs] = useState(5000);
  const prevFiltersRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.hash = 'admin-login';
      window.location.reload();
      return;
    }

    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const resp = await apiClient.get('/loan/callback-requests', { params: { page: 1, pageSize: 1000 } });
        if (!mounted) return;
        const data = resp.data;
        // API may return either an array or a paged object { items, total, page, pageSize }
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load callback requests');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    // Poll for new requests every 5 seconds
    const poll = setInterval(() => load(), pollIntervalMs);

    // Listen for immediate submission events from the frontend
    const handler = () => load();
    window.addEventListener('callbackSubmitted', handler);

    return () => { mounted = false; clearInterval(poll); window.removeEventListener('callbackSubmitted', handler); };
  }, []);

  useEffect(() => {
    // apply client-side filters
    let list = items.slice();
    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i => (
        (i.fullName || '').toLowerCase().includes(q) ||
        (i.phoneNumber || '').toLowerCase().includes(q) ||
        (i.email || '').toLowerCase().includes(q) ||
        (i.referralNumber || '').toLowerCase().includes(q)
      ));
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'new') list = list.filter(i => !i.isProcessed);
      if (statusFilter === 'contacted') list = list.filter(i => i.isProcessed);
    }
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoff = new Date(0);
      if (dateRange === '1d') cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
      if (dateRange === '7d') cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
      if (dateRange === '30d') cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate()-30);
      list = list.filter(i => new Date(i.createdAt) >= cutoff);
    }
    // apply sorting
    list.sort((a, b) => {
      const key = sortBy.key;
      const ad = a[key];
      const bd = b[key];
      if (ad == null && bd == null) return 0;
      if (ad == null) return sortBy.dir === 'asc' ? -1 : 1;
      if (bd == null) return sortBy.dir === 'asc' ? 1 : -1;
      if (typeof ad === 'string') {
        return sortBy.dir === 'asc' ? String(ad).localeCompare(String(bd)) : String(bd).localeCompare(String(ad));
      }
      return sortBy.dir === 'asc' ? (ad > bd ? 1 : ad < bd ? -1 : 0) : (ad < bd ? 1 : ad > bd ? -1 : 0);
    });
    setFiltered(list);
    // Only reset to page 1 when the user changed filters/sort; preserve current page on data refresh
    const filterKey = `${query}|${statusFilter}|${dateRange}|${sortBy.key}|${sortBy.dir}`;
    if (!prevFiltersRef.current) prevFiltersRef.current = filterKey;
    if (prevFiltersRef.current !== filterKey) {
      prevFiltersRef.current = filterKey;
      setPage(1);
    } else {
      // ensure current page is within new total pages after data update
      const newTotalPages = Math.max(1, Math.ceil(list.length / pageSize));
      setPage(p => Math.min(p, newTotalPages));
    }
  }, [items, query, statusFilter, dateRange]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const copy = new Set(Array.from(prev));
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const selectAllOnPage = () => {
    const ids = paged.map(p => p.id);
    setSelectedIds(prev => {
      const copy = new Set(Array.from(prev));
      ids.forEach(id => copy.add(id));
      return copy;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const exportCsv = (rows) => {
    const cols = ['id','createdAt','fullName','phoneNumber','email','referralNumber','loanResultId','message'];
    const lines = [cols.join(',')];
    rows.forEach(r => {
      const values = cols.map(c => '"' + String(r[c] ?? '').replace(/"/g, '""') + '"');
      lines.push(values.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `callback-requests-${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const bulkMarkContacted = async () => {
    try {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      // call backend bulk endpoint
      await apiClient.patch('/loan/callback-requests/bulk', { ids, action: 'markContacted' });
      // update locally
      setItems(prev => prev.map(it => ids.includes(it.id) ? { ...it, isProcessed: true, processedAt: new Date().toISOString() } : it));
      clearSelection();
    } catch (err) { console.error(err); }
  };

  const handleSort = (key) => {
    setSortBy(prev => ({ key, dir: prev.key === key ? (prev.dir === 'asc' ? 'desc' : 'asc') : 'asc' }));
  };

  const formatPrettyJson = (jsonStr) => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch {
      return jsonStr;
    }
  };

  const extractCustomerMessage = (msg) => {
    if (!msg) return '';
    const marker = '--- Loan Inputs ---';
    const idx = msg.indexOf(marker);
    if (idx === -1) return msg;
    // return the part before the marker, trimmed
    return msg.substring(0, idx).trim();
  };

  const labelMap = {
    monthlyBusinessIncome: 'Monthly Business Income',
    monthlySalaryIncome: 'Monthly Salary Income',
    monthlyRentalPayments: 'Monthly Rental Payments',
    existingLoanObligations: 'Existing Loan Obligations',
    preferredLoanTenorYears: 'Preferred Tenor (years)',
    loanRequestId: 'Loan Request Id',
    loanResultId: 'Loan Result Id',
    maximumLoanAmount: 'Maximum Loan Amount',
    estimatedMonthlyRepayment: 'Estimated Monthly Repayment',
    appliedInterestRate: 'Applied Interest Rate',
    loanTenorMonths: 'Loan Tenor (months)',
    netMonthlyIncome: 'Net Monthly Income',
    monthlyTurnover: 'Monthly Turnover'
  };

  const formatAmount = (val) => {
    if (val === null || val === undefined || val === '') return '—';
    const num = Number(val);
    if (!isFinite(num)) return String(val);
    return `KES ${num.toLocaleString()}`;
  };

  const formatTimestamp = (s) => {
    if (!s) return '—';
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return '—';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const deriveIncomeType = (item) => {
    try {
      // check explicit keys first
      const explicit = getField(item, ['incomeType','income_type','employmentType','incomeSource','employment_type']);
      if (explicit) {
        const s = String(explicit).toLowerCase();
        if (s.includes('employ')) return 'Employed';
        if (s.includes('business') || s.includes('self')) return 'Business';
      }

      // fallback: inspect numeric inputs
      const inputs = item && item.loanInputsJson ? JSON.parse(item.loanInputsJson) : {};
      const s = Number(inputs.monthlySalaryIncome || inputs.netMonthlyIncome || inputs.monthlySalary || 0) || 0;
      const b = Number(inputs.monthlyBusinessIncome || inputs.monthlyTurnover || inputs.turnover || 0) || 0;
      if (s > 0 && b === 0) return 'Employed';
      if (b > 0 && s === 0) return 'Business';

      // final fallback: check loanResultJson for any hint
      const res = item && item.loanResultJson ? JSON.parse(item.loanResultJson) : {};
      if (res && res.incomeSource) {
        const r = String(res.incomeSource).toLowerCase();
        if (r.includes('employ')) return 'Employed';
        if (r.includes('business')) return 'Business';
      }
    } catch {}
    return '-';
  };

  const isEmployedType = (s) => {
    if (!s) return false;
    return /employ/i.test(String(s));
  };

  const isBusinessType = (s) => {
    if (!s) return false;
    return /business|self|entrepreneur|trade|company/i.test(String(s));
  };
  // Deterministic whitelists for input keys (exact keys used by the calculator)
  const employedInputKeys = new Set([
    'monthlysalaryincome',
    'monthlyrentalpayments',
    'monthlyrentalpayment',
    'existingloanobligations',
    'loanobligations',
    'preferredloantenoryears',
    'preferredloantenor',
    'preferredtenor',
    'tenor'
  ].map(s => s.toLowerCase()));

  const businessInputKeys = new Set([
    'monthlybusinessincome',
    'monthlyturnover',
    'turnover',
    'revenue',
    'sales',
    'profit',
    'expense',
    'existingloanobligations',
    'preferredloantenoryears',
    'preferredloantenor'
  ].map(s => s.toLowerCase()));

  const commonInputKeys = new Set(['existingloanobligations', 'loanobligations', 'preferredloantenoryears', 'preferredloantenor', 'preferredtenor', 'tenor', 'monthlyrentalpayments'].map(s => s.toLowerCase()));

  const keepInputKeyForIncome = (key, incomeType) => {
    const k = String(key || '').toLowerCase();
    if (!incomeType) return true; // when unknown, show everything for now
    const it = String(incomeType || '').toLowerCase();
    if (it.includes('employ')) {
      return employedInputKeys.has(k) || commonInputKeys.has(k);
    }
    if (it.includes('business') || it.includes('self')) {
      return businessInputKeys.has(k) || commonInputKeys.has(k);
    }
    return true;
  };

  const keepResultKey = (key) => {
    const k = String(key || '').toLowerCase();
    const allowed = new Set([
      'maximumloanamount',
      'maximumloan',
      'estimatedmonthlyrepayment',
      'estimatedmonthly',
      'monthlypayment',
      'loantenormonths',
      'loantenor',
      'appliedinterestrate',
      'loanresultid',
      'loanresult'
    ]);
    // allow if key exactly in whitelist or contains common result words as fallback
    if (allowed.has(k)) return true;
    return /(amount|payment|monthly|tenor|loan|max|qualification|estimated|repayment|rate|interest)/i.test(k);
  };

  const renderJsonAsForm = (jsonStr) => {
    try {
      const obj = JSON.parse(jsonStr);
      return (
        <div className="mt-2 space-y-2">
          {Object.entries(obj).map(([k, v]) => (
            <div key={k} className="flex flex-row items-center gap-2">
              <div className="w-36 text-sm text-gray-600">{k}</div>
              <div className="flex-1 text-sm text-gray-800">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
            </div>
          ))}
        </div>
      );
    } catch {
      return <div className="mt-2 text-sm">{jsonStr}</div>;
    }
  };

  const handlePrint = (item) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <html>
        <head>
          <title>Callback Request #${item.id}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #111 }
            h1 { margin: 0 0 8px 0 }
            .meta { margin-bottom: 12px }
            pre { background:#f7f9fb; padding:12px; border-radius:6px; overflow:auto }
            .section { margin-bottom:18px }
          </style>
        </head>
        <body>
          <h1>${item.fullName}  <small style="font-size:0.8em;color:#666">#${item.id}</small></h1>
          <div class="meta">LoanResultId: ${item.loanResultId} • Phone: ${item.phoneNumber} • Email: ${item.email}${item.referralNumber ? ' • Referral: ' + item.referralNumber : ''}</div>
          ${item.message ? `<div class="section"><strong>Message</strong><div>${extractCustomerMessage(item.message).replace(/\n/g, '<br/>')}</div></div>` : ''}
          ${item.loanInputsJson ? `<div class="section"><strong>Loan Inputs</strong><pre>${formatPrettyJson(item.loanInputsJson)}</pre></div>` : ''}
          ${item.loanResultJson ? `<div class="section"><strong>Loan Result</strong><pre>${formatPrettyJson(item.loanResultJson)}</pre></div>` : ''}
        </body>
      </html>
    `;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 250);
  };

  const download = (filename, content, mime) => {
    const blob = new Blob([content], { type: mime || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

  const total = items.length;
  const todayStr = (new Date()).toDateString();
  const todayCount = items.filter(i => new Date(i.createdAt).toDateString() === todayStr).length;
  const pendingCount = items.filter(i => !i.isProcessed).length;
  const contactedToday = items.filter(i => i.isProcessed && new Date(i.processedAt || i.createdAt).toDateString() === todayStr).length;
  const contactedTotal = items.filter(i => i.isProcessed).length;

  const getField = (item, keys) => {
    try {
      const obj = item && item.loanInputsJson ? JSON.parse(item.loanInputsJson) : {};
      for (const k of keys) if (obj[k] !== undefined) return obj[k];
      const res = item && item.loanResultJson ? JSON.parse(item.loanResultJson) : {};
      for (const k of keys) if (res[k] !== undefined) return res[k];
    } catch {
      return null;
    }
    return null;
  };

  const openDetail = (item) => { setSelected(item); };
  const closeDetail = () => { setSelected(null); };

  const saveNotesForSelected = async () => {
    if (!selected) return;
    const notesEl = document.getElementById('admin-notes');
    const notes = notesEl ? notesEl.value : '';
    try {
      // send notes to backend (server may store them in a separate field). Do not overwrite customer's message locally.
      await apiClient.patch(`/loan/callback-requests/${selected.id}`, { notes });
      setItems(prev => prev.map(it => it.id === selected.id ? { ...it, adminNotes: notes } : it));
      // refresh selected with admin-only notes
      setSelected(prev => prev ? { ...prev, adminNotes: notes } : prev);
    } catch (err) { console.error(err); }
  };

  const markSelectedAsContacted = async () => {
    if (!selected) return;
    try {
      await apiClient.patch(`/loan/callback-requests/${selected.id}`, { isProcessed: true });
      setItems(prev => prev.map(it => it.id === selected.id ? { ...it, isProcessed: true, processedAt: new Date().toISOString() } : it));
      setSelected(prev => prev ? { ...prev, isProcessed: true, processedAt: new Date().toISOString() } : prev);
    } catch (err) { console.error(err); }
  };

  const handleFilterClick = () => {
    const el = document.querySelector('input[placeholder="Search by name, phone, email, referral"]');
    if (el) el.focus();
  };

  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="title-section">
          <h1><FaPhoneVolume style={{color:'#2a7faa', marginRight:10, fontSize:18}} /> Callback Requests Dashboard</h1>
          <p>Manage follow-ups & client communication</p>
        </div>
        <button className="signout-btn" onClick={() => { localStorage.removeItem('adminToken'); window.location.hash = 'admin-login'; window.location.reload(); }}>Sign out</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-left">
            <h3><FaListAlt style={{marginRight:8}} /> Total Requests</h3>
            <div className="stat-number">{total}</div>
          </div>
          <div className="stat-icon"><FaChartLine /></div>
        </div>
        <div className="stat-card">
          <div className="stat-left">
            <h3><FaCalendarAlt style={{marginRight:8}} /> Today</h3>
            <div className="stat-number">{todayCount}</div>
          </div>
          <div className="stat-icon"><FaSun /></div>
        </div>
        <div className="stat-card">
          <div className="stat-left">
            <h3><FaClock style={{marginRight:8}} /> Pending Follow-up</h3>
            <div className="stat-number">{pendingCount}</div>
          </div>
          <div className="stat-icon"><FaHourglassHalf /></div>
        </div>
        <div className="stat-card">
          <div className="stat-left">
            <h3><FaPhoneVolume style={{marginRight:8}} /> Contacted Today</h3>
            <div className="stat-number">{contactedToday}</div>
            <div style={{fontSize:12, color:'#5a7d9c', marginTop:6}}>All time: {contactedTotal}</div>
          </div>
          <div className="stat-icon"><FaCheckCircle /></div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, phone, email, referral" />
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Date:</span>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="filter-select">
            <option value="7d">Last 7 days</option>
            <option value="1d">Last 24 hours</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All</option>
          </select>
        </div>

        <button className="btn-clear" onClick={() => { setQuery(''); setStatusFilter('all'); setDateRange('7d'); }}>Clear</button>

        <div className="action-buttons">
          <button className="btn-export" onClick={() => exportCsv(filtered)}>Export CSV</button>
          <button className="btn-mark" onClick={() => bulkMarkContacted()}>Mark Selected Contacted</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="checkbox-col"><input type="checkbox" onChange={(e) => e.target.checked ? selectAllOnPage() : clearSelection()} /></th>
              <th onClick={() => handleSort('id')} style={{cursor:'pointer'}}>ID</th>
              <th onClick={() => handleSort('createdAt')} style={{cursor:'pointer'}}>Date</th>
              <th onClick={() => handleSort('fullName')} style={{cursor:'pointer'}}>Name</th>
              <th>Phone</th>
              <th onClick={() => handleSort('incomeType')} style={{cursor:'pointer'}}>Income Type</th>
              <th onClick={() => handleSort('amount')} style={{cursor:'pointer'}}>Amount (KES)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => {
              const globalIndex = (page-1)*pageSize + idx;
              const incomeType = deriveIncomeType(item);
              const amount = getField(item, ['maximumLoanAmount','maximumloanamount','maximumLoan','maximum_loan_amount','qualificationAmount','amount','maxLoan','loanAmount']);
              const status = item.isProcessed ? 'contacted' : 'new';
              return (
                <tr key={item.id} className={`${globalIndex % 2 === 0 ? '' : ''} cursor-pointer`} onClick={() => openDetail(item)}>
                  <td className="checkbox-col"><input type="checkbox" checked={selectedIds.has(item.id)} onClick={(e) => e.stopPropagation()} onChange={() => toggleSelect(item.id)} /></td>
                  <td>{item.id}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{incomeType}</td>
                  <td><span className="amount-cell">{typeof amount === 'number' ? formatAmount(amount) : (amount ? formatAmount(Number(amount)) : '—')}</span></td>
                  <td><span className={`status-badge ${status === 'new' ? 'status-new' : 'status-contacted'}`}>{status === 'new' ? '⏳ New' : '✔️ Contacted'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination-area">
        <div className="entries-info">Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, filtered.length)} of {filtered.length} entries</div>
        <div className="pagination-controls">
          <button className="page-btn" onClick={() => setPage(Math.max(1, page-1))} disabled={page===1}>‹ Prev</button>
          <span style={{background:'#eef3fc', padding:'6px 14px', borderRadius:40, fontWeight:600}}>Page {page} of {totalPages}</span>
          <button className="page-btn" onClick={() => setPage(Math.min(totalPages, page+1))} disabled={page===totalPages}>Next ›</button>
        </div>
      </div>
      {/* Detail modal/drawer - re-added so row clicks open details */}
      {selected && (
        <div className="detail-modal-overlay">
          <div className="detail-modal-panel">
            <div className="detail-modal-header">
              <h2 className="text-lg font-semibold">Callback Request Details - ID: #{selected.id}</h2>
              <Button variant="outline" onClick={closeDetail}>Close</Button>
            </div>

            <div className="detail-modal-body">
              <Card className="detail-modal-card">
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex"><div className="w-36 text-gray-600">Full Name:</div><div className="flex-1">{selected.fullName}</div></div>
                  <div className="flex"><div className="w-36 text-gray-600">Phone:</div><div className="flex-1">{selected.phoneNumber}</div></div>
                  <div className="flex"><div className="w-36 text-gray-600">Email:</div><div className="flex-1">{selected.email}</div></div>
                  <div className="flex"><div className="w-36 text-gray-600">Referral No:</div><div className="flex-1">{selected.referralNumber || '—'}</div></div>
                  <div className="flex"><div className="w-36 text-gray-600">Submitted:</div><div className="flex-1">{formatTimestamp(selected.createdAt)}</div></div>
                  {selected.message && (
                    <div className="mt-3">
                      <div className="w-full text-gray-600">Message:</div>
                      <div className="mt-1 text-sm text-gray-700">{extractCustomerMessage(selected.message)}</div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="detail-modal-card">
                <h3 className="font-semibold mb-3">Calculation Result</h3>
                <div className="text-sm">
                  {selected.loanInputsJson && (() => {
                    try {
                      const obj = JSON.parse(selected.loanInputsJson);
                      let incomeType = obj.incomeType || obj.employmentType || obj.income_source || '';
                      if (!incomeType) {
                        const s = Number(obj.monthlySalaryIncome || obj.netMonthlyIncome || 0);
                        const b = Number(obj.monthlyBusinessIncome || obj.monthlyTurnover || 0);
                        if (s > 0 && b === 0) incomeType = 'employed';
                        else if (b > 0 && s === 0) incomeType = 'business';
                      }
                      const entries = Object.entries(obj).filter(([k]) => keepInputKeyForIncome(k, incomeType));
                      return (
                        <div className="mb-3">
                          <div className="text-gray-700 font-medium mb-1">Loan Inputs</div>
                          <div className="space-y-2">
                            {entries.map(([k, v]) => (
                              <div className="grid grid-cols-2 gap-2 items-center" key={`in-${k}`}>
                                <div className="text-sm text-gray-600">{labelMap[k] || k}:</div>
                                <div className="text-sm font-medium text-gray-800">{typeof v === 'number' ? formatAmount(v) : (typeof v === 'object' ? JSON.stringify(v) : String(v))}</div>
                              </div>
                            ))}
                            {selected.loanResultJson && (() => {
                              try {
                                const res = JSON.parse(selected.loanResultJson);
                                let apr = res.appliedInterestRate || res.AppliedInterestRate || res.appliedinterestRate || null;
                                if (apr !== null && apr !== undefined) {
                                  if (apr > 0 && apr < 1) apr = apr * 100;
                                  return (
                                    <div className="grid grid-cols-2 gap-2 items-center mt-2">
                                      <div className="text-sm text-gray-600">Applied Interest Rate:</div>
                                      <div className="text-sm font-medium text-gray-800">{String(apr)}%</div>
                                    </div>
                                  );
                                }
                              } catch { }
                              return null;
                            })()}
                          </div>
                        </div>
                      );
                    } catch { return null; }
                  })()}

                  {selected.loanResultJson && (() => {
                    try {
                      const obj = JSON.parse(selected.loanResultJson);
                      const entries = Object.entries(obj).filter(([k]) => keepResultKey(k));
                      const maxEntry = entries.find(([k]) => k.toLowerCase().includes('maximumloan'));
                      return (
                        <div>
                          <div className="text-gray-700 font-medium mb-1">Loan Result</div>
                          {maxEntry && (
                            <div className="mb-3 p-3 bg-white border rounded-md">
                              <div className="text-sm text-gray-600">{labelMap[maxEntry[0]] || maxEntry[0]}</div>
                              <div className="text-xl font-bold text-gray-900">{typeof maxEntry[1] === 'number' ? formatAmount(maxEntry[1]) : String(maxEntry[1])}</div>
                            </div>
                          )}
                          <div className="space-y-2">
                            {entries.map(([k, v]) => (
                              <div className="grid grid-cols-2 gap-2 items-center" key={`res-${k}`}>
                                <div className="text-sm text-gray-600">{labelMap[k] || k}:</div>
                                <div className="text-sm font-medium text-gray-800">{typeof v === 'number' ? formatAmount(v) : (typeof v === 'object' ? JSON.stringify(v) : String(v))}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } catch { return null; }
                  })()}
                </div>
              </Card>
            </div>

            <div className="modal-actions">
              <div style={{width:'100%'}}>
                <div className="w-full text-sm text-gray-600 mb-1">Notes (admin only)</div>
                <textarea id="admin-notes" className="w-full border p-3 rounded h-28" placeholder="Write admin feedback or notes here" defaultValue={selected.adminNotes || ''}></textarea>
                <div style={{display:'flex', gap:12, marginTop:12, justifyContent:'flex-end'}}>
                  <Button variant="outline" onClick={saveNotesForSelected}>Save Notes</Button>
                  <Button variant="outline" onClick={markSelectedAsContacted}>Mark as Contacted</Button>
                  <Button variant="outline" onClick={() => handlePrint(selected)}>Export PDF</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
