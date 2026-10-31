import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Bell, Check, ChevronDown, LogOut, Menu, Moon, Search, Sun, UserRound } from 'lucide-react'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function Header({ currentUser, activeWorkspace, onWorkspaceSelected, onLogout, onToggleSidebar, theme, onToggleTheme }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState([])
  const [workspacesLoading, setWorkspacesLoading] = useState(true)
  const headerRef = useRef(null)

  useEffect(() => {
    let active = true
    fetch('/api/workspaces', { credentials: 'include' })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Could not load workspaces.')
        if (active) setWorkspaces(data.workspaces || [])
      })
      .catch(() => { if (active) setWorkspaces([]) })
      .finally(() => { if (active) setWorkspacesLoading(false) })
    return () => { active = false }
  }, [currentUser.id, currentUser.workspaceIds])

  useEffect(() => {
    function closeMenus(event) {
      if (event.key === 'Escape') {
        setWorkspaceMenuOpen(false)
        setProfileMenuOpen(false)
        setNotificationsOpen(false)
      }
      if (event.type === 'mousedown' && !headerRef.current?.contains(event.target)) {
        setWorkspaceMenuOpen(false)
        setProfileMenuOpen(false)
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('keydown', closeMenus)
    document.addEventListener('mousedown', closeMenus)
    return () => {
      document.removeEventListener('keydown', closeMenus)
      document.removeEventListener('mousedown', closeMenus)
    }
  }, [])

  function chooseWorkspace(workspace) {
    setWorkspaceMenuOpen(false)
    onWorkspaceSelected(workspace)
  }

  return (
    <header className="topbar" ref={headerRef}>
      <div className="brand-area">
        <button className="icon-button menu-toggle" aria-label="Toggle navigation" onClick={onToggleSidebar}><Menu size={19} strokeWidth={1.8} /></button>
        <Link className="brand" to="/overview" aria-label="Flowspace home">
          <span className="brand-mark">f</span><span>flowspace</span>
        </Link>
        <div className="workspace-menu-wrap">
          <button className="workspace-switcher" type="button" aria-label="Choose a workspace" aria-haspopup="menu" aria-expanded={workspaceMenuOpen} onClick={() => setWorkspaceMenuOpen((open) => !open)}>
            <span className="workspace-avatar">{activeWorkspace?.name?.slice(0, 1).toUpperCase() || 'W'}</span>
            <span className="workspace-switcher-name">{activeWorkspace?.name || 'Choose workspace'}</span>
            <ChevronDown className="chevron" size={15} />
          </button>
          {workspaceMenuOpen && <div className="workspace-popover" role="menu" aria-label="Your workspaces">
            <strong className="popover-heading">Your workspaces</strong>
            {workspacesLoading ? <p className="popover-empty">Loading workspaces…</p> : workspaces.length ? workspaces.map((workspace) => {
              const selected = String(workspace.id) === String(activeWorkspace?.id)
              return <button className="workspace-option" type="button" role="menuitem" key={workspace.id} onClick={() => chooseWorkspace(workspace)}>
                <span className="workspace-avatar">{workspace.name.slice(0, 1).toUpperCase()}</span>
                <span className="workspace-option-copy"><strong>{workspace.name}</strong><small>{workspace.role}</small></span>
                {selected && <Check size={16} aria-label="Current workspace" />}
              </button>
            }) : <p className="popover-empty">You haven’t joined a workspace yet.</p>}
            <Link className="workspace-manage-link" to="/workspaces" onClick={() => setWorkspaceMenuOpen(false)}>Manage workspaces <ChevronDown size={14} className="manage-link-arrow" /></Link>
          </div>}
        </div>
      </div>
      <div className="topbar-actions">
        <label className="search-box"><Search size={16} /><input aria-label="Search" placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
        <button className="icon-button theme-toggle" aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'} title={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'} onClick={onToggleTheme}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        <div className="notification-wrap">
          <button className="icon-button notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18} strokeWidth={1.8} /><i /></button>
          {notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><p><span className="activity-dot purple" />Maya mentioned you in <b>Website redesign</b><small>12 minutes ago</small></p><p><span className="activity-dot green" />Your weekly report is ready<small>1 hour ago</small></p><button onClick={() => setNotificationsOpen(false)}>Close</button></div>}
        </div>
        <div className="profile-menu-wrap">
          <button className="profile-button" type="button" aria-label={'Profile menu for ' + currentUser.name} aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}>
            <span className="avatar avatar-you">{initials(currentUser.name)}</span><ChevronDown className="profile-chevron" size={15} strokeWidth={2} />
          </button>
          {profileMenuOpen && <div className="profile-popover" role="menu" aria-label="Profile menu">
            <div className="profile-popover-user"><span className="avatar avatar-you">{initials(currentUser.name)}</span><span><strong>{currentUser.name}</strong><small>{currentUser.email}</small></span></div>
            <Link role="menuitem" to="/profile" onClick={() => setProfileMenuOpen(false)}><UserRound size={16} /> My profile</Link>
            <button role="menuitem" type="button" onClick={onLogout}><LogOut size={16} /> Log out</button>
          </div>}
        </div>
      </div>
    </header>
  )
}

export default Header
