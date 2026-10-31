import { Link } from 'react-router'
import { useState } from 'react'
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function Header({ currentUser, activeWorkspace, onToggleSidebar, theme, onToggleTheme }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="brand-area">
        <button className="icon-button menu-toggle" aria-label="Toggle navigation" onClick={onToggleSidebar}><Menu size={19} strokeWidth={1.8} /></button>
        <Link className="brand" to="/overview" aria-label="Flowspace home">
          <span className="brand-mark">f</span><span>flowspace</span>
        </Link>
        <span className="topbar-divider" />
        <Link className="workspace-switcher" to="/workspaces" aria-label="Choose a workspace">
          <span className="workspace-avatar">{activeWorkspace?.name?.slice(0, 1).toUpperCase() || 'W'}</span>
          <span>{activeWorkspace?.name || 'Choose workspace'}</span><ChevronDown className="chevron" size={15} />
        </Link>
      </div>
      <div className="topbar-actions">
        <label className="search-box"><Search size={16} /><input aria-label="Search" placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
        <button className="icon-button theme-toggle" aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'} title={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'} onClick={onToggleTheme}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        <div className="notification-wrap">
          <button className="icon-button notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} strokeWidth={1.8} /><i /></button>
          {notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><p><span className="activity-dot purple" />Maya mentioned you in <b>Website redesign</b><small>12 minutes ago</small></p><p><span className="activity-dot green" />Your weekly report is ready<small>1 hour ago</small></p><button onClick={() => setNotificationsOpen(false)}>Close</button></div>}
        </div>
        <button className="profile-button" aria-label={'Profile menu for ' + currentUser.name} aria-haspopup="menu"><span className="avatar avatar-you">{initials(currentUser.name)}</span><ChevronDown className="profile-chevron" size={15} strokeWidth={2} /></button>
      </div>

    </header>
  )
}

export default Header



