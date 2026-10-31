import { BriefcaseBusiness, Mail, ShieldCheck, UserRound } from 'lucide-react'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function Profile({ user }) {
  const workspaceCount = user?.workspaceIds?.length || 0

  return (
    <section className="page-content profile-page">
      <div className="welcome-row">
        <div><p className="eyebrow">ACCOUNT</p><h1>My profile</h1><p className="page-subtitle">Your personal account details and workspace access.</p></div>
      </div>

      <section className="profile-summary-card panel">
        <span className="profile-large-avatar">{initials(user?.name)}</span>
        <div className="profile-summary-copy"><span className="profile-card-label"><ShieldCheck size={14} /> ACCOUNT PROFILE</span><h2>{user?.name || 'User'}</h2><p>{user?.email}</p></div>
      </section>

      <section className="profile-details-card panel">
        <div className="profile-section-heading"><div><h2>Personal information</h2><p>Details associated with your Flowspace account.</p></div></div>
        <div className="profile-detail-row"><span className="profile-detail-icon"><UserRound size={17} /></span><span><small>Full name</small><strong>{user?.name || '—'}</strong></span></div>
        <div className="profile-detail-row"><span className="profile-detail-icon"><Mail size={17} /></span><span><small>Email address</small><strong>{user?.email || '—'}</strong></span></div>
        <div className="profile-detail-row"><span className="profile-detail-icon"><BriefcaseBusiness size={17} /></span><span><small>Workspaces</small><strong>{workspaceCount} {workspaceCount === 1 ? 'workspace' : 'workspaces'}</strong></span></div>
      </section>
    </section>
  )
}

export default Profile
