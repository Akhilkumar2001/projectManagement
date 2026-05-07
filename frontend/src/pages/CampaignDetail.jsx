import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Users, FileText, DollarSign, Settings, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import campaignService from '../services/campaignService.js';
import DashboardTab from './campaign/DashboardTab.jsx';
import OverviewTab from './campaign/OverviewTab.jsx';
import RosterTab from './campaign/RosterTab.jsx';
import DeliverablesTab from './campaign/DeliverablesTab.jsx';
import BudgetTab from './campaign/BudgetTab.jsx';

const TABS = [
  { id: 'dashboard',    label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'overview',     label: 'Campaign Overview',  icon: Settings },
  { id: 'roster',       label: 'Influencer Roster',  icon: Users },
  { id: 'deliverables', label: 'Deliverables',       icon: FileText },
  { id: 'budget',       label: 'Budget & Performance', icon: DollarSign },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign]     = useState(null);
  const [influencers, setInfluencers] = useState([]);
  const [activeTab, setActiveTab]   = useState('dashboard');

  const loadCampaign = () =>
    campaignService.getById(id).then(({ data }) => setCampaign(data.data));

  const loadInfluencers = () =>
    campaignService.getInfluencers(id).then(({ data }) => setInfluencers(data.data));

  useEffect(() => {
    loadCampaign();
    loadInfluencers();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this campaign and all its data? This cannot be undone.')) return;
    try {
      await campaignService.delete(id);
      toast.success('Campaign deleted');
      navigate('/campaigns');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (!campaign) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-7 w-1/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-100 rounded" />
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-32 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/campaigns')} className="p-1.5 rounded-lg border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="page-title">{campaign.name}</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {campaign.primaryPlatform || '—'} · ${campaign.totalBudget?.toLocaleString() || 0} budget
            </p>
          </div>
        </div>
        <button onClick={handleDelete} className="btn-danger text-sm px-3 py-1.5">
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            style={{
              borderColor: activeTab === tabId ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tabId ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardTab campaignId={id} campaign={campaign} />}
      {activeTab === 'overview' && <OverviewTab campaign={campaign} onUpdated={loadCampaign} />}
      {activeTab === 'roster' && <RosterTab campaignId={id} />}
      {activeTab === 'deliverables' && <DeliverablesTab campaignId={id} influencers={influencers} />}
      {activeTab === 'budget' && <BudgetTab campaignId={id} influencers={influencers} />}
    </div>
  );
}
