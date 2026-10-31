import { useEffect, useState } from 'react'
import { ArrowRight, Plus, UserRoundPlus } from 'lucide-react'
import './WorkspaceScreen.css'

async function sendWorkspaceRequest(url, body) {
  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Workspace request failed.')
  return data
}

function WorkspaceScreen({ user, onMembershipAdded, onWorkspaceSelected }) {
  const [workspaces, setWorkspaces] = useState([])
  const [workspaceName, setWorkspaceName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sendWorkspaceRequest('/api/workspaces')
      .then((data) => { if (active) setWorkspaces(data.workspaces) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const data = await sendWorkspaceRequest('/api/workspaces', { name: workspaceName })
      setWorkspaces((existing) => [data.workspace, ...existing.filter((item) => item.id !== data.workspace.id)])
      setNotice('Workspace created. Invite code: ' + data.workspace.inviteCode)
      setWorkspaceName('')
      onMembershipAdded(data.workspace)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleJoin(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const data = await sendWorkspaceRequest('/api/workspaces/join', { inviteCode })
      setWorkspaces((existing) => [data.workspace, ...existing.filter((item) => item.id !== data.workspace.id)])
      setInviteCode('')
      setNotice('You joined ' + data.workspace.name + '. Select it below to continue.')
      onMembershipAdded(data.workspace)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page-content workspace-page">
      <div className="workspace-welcome">
        <p className="eyebrow">YOUR TEAM SPACE</p>
        <h1>Your workspaces</h1>
        <p className="page-subtitle">Open a workspace, or create and join spaces for your teams.</p>
      </div>

      <section className="existing-workspaces">
        <div className="existing-heading"><div><h2>Your workspaces</h2><p>Choose a workspace to continue.</p></div><span>{workspaces.length}</span></div>
        {loading ? <div className="workspace-list-loading"><span className="loading-spinner" />Loading workspaces...</div> : workspaces.length === 0 ? (
          <div className="workspace-empty">You’re not a member of a workspace yet. Create one or join with an invite code below.</div>
        ) : (
          <div className="workspace-list">{workspaces.map((workspace) => <article className="workspace-list-card" key={workspace.id}>
            <span className="workspace-list-mark">{workspace.name.slice(0, 1).toUpperCase()}</span>
            <div className="workspace-list-copy"><strong>{workspace.name}</strong><small>{workspace.role} {workspace.inviteCode ? '· Invite code: ' + workspace.inviteCode : ''}</small></div>
            <button className="open-workspace-button" onClick={() => onWorkspaceSelected(workspace)}>Open workspace <ArrowRight size={14} /></button>
          </article>)}</div>
        )}
      </section>

      <div className="workspace-actions-heading"><h2>More workspace options</h2><p>Create a new workspace or join one with an invite code.</p></div>

      <div className="workspace-choice-grid">
        <article className="workspace-choice-card create-choice">
          <div className="workspace-choice-icon"><Plus size={22} /></div>
          <span className="workspace-card-kicker">START SOMETHING NEW</span>
          <h2>Create a workspace</h2>
          <p>Set up a shared home for your projects, tasks, and teammates.</p>
          <form onSubmit={handleCreate}>
            <label htmlFor="workspace-name">Workspace name</label>
            <input id="workspace-name" value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="e.g. Northstar Studio" minLength={2} maxLength={80} required />
            <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Create workspace'}<ArrowRight size={16} /></button>
          </form>
        </article>

        <article className="workspace-choice-card join-choice">
          <div className="workspace-choice-icon join-icon"><UserRoundPlus size={20} /></div>
          <span className="workspace-card-kicker">YOUR TEAM INVITED YOU</span>
          <h2>Join a workspace</h2>
          <p>Enter the invite code shared by a workspace owner or admin.</p>
          <form onSubmit={handleJoin}>
            <label htmlFor="workspace-invite">Invite code</label>
            <input id="workspace-invite" value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase())} placeholder="12-character code" minLength={12} maxLength={12} required />
            <button className="secondary-button" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Join workspace'}<ArrowRight size={16} /></button>
          </form>
        </article>
      </div>

      {(error || notice) && <p className={error ? 'workspace-message workspace-error' : 'workspace-message workspace-success'} role="status">{error || notice}</p>}

      <p className="workspace-signed-in">Signed in as <strong>{user.name}</strong></p>
    </section>
  )
}

export default WorkspaceScreen

