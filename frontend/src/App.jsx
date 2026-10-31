import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext } from 'react-router'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { ArrowRight, CalendarDays, CheckSquare, FolderKanban, Home, LogOut, Plus, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import './App.css'

const AuthScreen = lazy(() => import('./components/AuthScreen.jsx'))
const pages = {
  overview: lazy(() => import('./pages/Overview.jsx')),
  projects: lazy(() => import('./pages/Projects.jsx')),
  tasks: lazy(() => import('./pages/Tasks.jsx')),
  calendar: lazy(() => import('./pages/Calendar.jsx')),
  settings: lazy(() => import('./pages/Settings.jsx')),
  workspaces: lazy(() => import('./pages/WorkspaceScreen.jsx')),
}

const navigation = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban, badge: '6' },
  { id: 'tasks', label: 'My tasks', icon: CheckSquare, badge: '4' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
]
const pageLabels = Object.fromEntries([...navigation, { id: 'settings', label: 'Settings' }, { id: 'workspaces', label: 'Workspaces' }].map((item) => [item.id, item.label]))

class PageErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const message = typeof this.state.error.message === 'string' ? this.state.error.message : 'This page could not be displayed.'
      const stack = typeof this.state.error.stack === 'string' ? this.state.error.stack : ''
      return (
        <section className="page-content page-error" role="alert">
          <p className="eyebrow">PAGE ERROR</p>
          <h1>We couldn’t load this page</h1>
          <p className="page-subtitle">{message}</p>
          {stack && <details className="error-details"><summary>Technical details</summary><pre>{stack}</pre></details>}
          <button className="primary-button" onClick={() => window.location.reload()}>Reload page</button>
        </section>
      )
    }
    return this.props.children
  }
}

function RoutedPage({ pageId }) {
  const Page = pages[pageId]
  const { currentUser, navigateToPage, onMembershipAdded, onWorkspaceSelected } = useOutletContext()
  const pageProps = pageId === 'workspaces'
    ? { user: currentUser, onMembershipAdded, onWorkspaceSelected }
    : { user: currentUser, onNavigate: navigateToPage }

  return (
    <PageErrorBoundary key={pageId}>
      <Suspense fallback={<div className="page-loading"><span className="loading-spinner" />Loading {pageLabels[pageId].toLowerCase()}...</div>}>
        <Page {...pageProps} />
      </Suspense>
    </PageErrorBoundary>
  )
}

function AuthenticatedLayout({ currentUser, activeWorkspace, onWorkspaceSelected, onMembershipAdded, onLogout, sidebarOpen, onToggleSidebar, theme, onToggleTheme }) {
  const location = useLocation()
  const navigate = useNavigate()
  const pageId = location.pathname.split('/')[1] || 'workspaces'
  const activeLabel = pageLabels[pageId] || 'Overview'
  const navigateToPage = (page) => navigate('/' + page)

  return (
    <div className={'app-shell ' + (sidebarOpen ? '' : 'sidebar-collapsed')}>
      <Header currentUser={currentUser} activeWorkspace={activeWorkspace} onToggleSidebar={onToggleSidebar} theme={theme} onToggleTheme={onToggleTheme} />
      <aside className="sidebar">
        <div className="sidebar-scroll">
          <p className="nav-label">WORKSPACE</p>
          <nav aria-label="Main navigation">
            {navigation.map((item) => <NavLink key={item.id} to={'/' + item.id} end className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')} title={item.label}>
              <item.icon className="nav-icon" size={17} strokeWidth={1.8} /><span className="nav-text">{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>)}
          </nav>
          <div className="sidebar-section-heading"><p className="nav-label">YOUR PROJECTS</p><Link className="tiny-add" aria-label="Go to projects" to="/projects"><Plus size={15} /></Link></div>
          <NavLink className="project-link" to="/projects"><span className="project-color color-violet" />Website redesign</NavLink>
          <NavLink className="project-link" to="/projects"><span className="project-color color-orange" />Mobile app</NavLink>
          <NavLink className="project-link" to="/projects"><span className="project-color color-blue" />Q4 marketing</NavLink>
          <div className="sidebar-spacer" />
          <div className="upgrade-card"><div className="upgrade-sparkle"><Sparkles size={16} /></div><strong>Make work flow</strong><p>Bring your team together and get more done.</p><Link to="/workspaces">Manage workspaces <ArrowRight size={14} /></Link></div>
          <NavLink className={({ isActive }) => 'nav-item settings-link ' + (isActive ? 'active' : '')} to="/settings" title="Settings"><SettingsIcon className="nav-icon" size={17} strokeWidth={1.8} /><span className="nav-text">Settings</span></NavLink>
        </div>
        <div className="sidebar-user"><span className="avatar avatar-you">{currentUser.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><span className="user-details"><strong>{currentUser.name}</strong><small>{currentUser.email}</small></span><button className="user-more" onClick={onLogout} aria-label="Sign out" title="Sign out"><LogOut size={16} /></button></div>
      </aside>

      <main className="main-area">
        <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{activeLabel}</strong></div>
        <Outlet context={{ currentUser, navigateToPage, onMembershipAdded, onWorkspaceSelected }} />
        <Footer />
      </main>
    </div>
  )
}

function readSavedTheme() {
  try {
    return localStorage.getItem('flowspace-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function App() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [activeWorkspace, setActiveWorkspace] = useState(null)
  const [sessionStatus, setSessionStatus] = useState('checking')
  const [retrySession, setRetrySession] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState(readSavedTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('flowspace-theme', theme)
    } catch {
      // The chosen theme still works for this session if storage is unavailable.
    }
  }, [theme])

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) {
          if (active) setSessionStatus('signed-out')
          return
        }
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Could not check your session.')
        if (active) {
          setCurrentUser(data.user)
          setSessionStatus('authenticated')
          let savedWorkspace = null
          try {
            savedWorkspace = JSON.parse(localStorage.getItem('flowspace-active-workspace-' + data.user.id) || 'null')
          } catch {
            savedWorkspace = null
          }
          const isMember = savedWorkspace && data.user.workspaceIds?.some((id) => String(id) === String(savedWorkspace.id))
          if (isMember) {
            setActiveWorkspace(savedWorkspace)
          } else {
            setActiveWorkspace(null)
            navigate('/workspaces', { replace: true })
          }
        }
      })
      .catch(() => {
        if (active) setSessionStatus('offline')
      })
    return () => { active = false }
  }, [retrySession, navigate])

  function handleAuthenticated(user) {
    setCurrentUser(user)
    setActiveWorkspace(null)
    setSessionStatus('authenticated')
    navigate('/workspaces', { replace: true })
  }

  function handleMembershipAdded(workspace) {
    const workspaceId = String(workspace.id)
    setCurrentUser((user) => user
      ? { ...user, workspaceIds: Array.from(new Set([...(user.workspaceIds || []).map(String), workspaceId])) }
      : user)
  }

  function handleWorkspaceSelected(workspace) {
    handleMembershipAdded(workspace)
    setActiveWorkspace(workspace)
    try {
      localStorage.setItem('flowspace-active-workspace-' + currentUser.id, JSON.stringify(workspace))
    } catch {
      // The workspace remains selected for this session if storage is unavailable.
    }
    navigate('/overview')
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // Clear the local screen even if the API is temporarily unavailable.
    }
    if (currentUser) {
      try { localStorage.removeItem('flowspace-active-workspace-' + currentUser.id) } catch {}
    }
    setCurrentUser(null)
    setActiveWorkspace(null)
    setSessionStatus('signed-out')
  }

  if (sessionStatus === 'checking') {
    return <div className="auth-status"><span className="loading-spinner" />Checking your session...</div>
  }

  if (sessionStatus === 'offline') {
    return <div className="auth-status"><div className="auth-status-card"><span className="brand-mark">f</span><h1>Can’t reach the API</h1><p>Start the backend and make sure PostgreSQL is running, then try again.</p><button className="primary-button" onClick={() => { setSessionStatus('checking'); setRetrySession((value) => value + 1) }}>Try again</button></div></div>
  }

  if (!currentUser) {
    return <Suspense fallback={<div className="auth-status"><span className="loading-spinner" />Loading sign in...</div>}><AuthScreen onAuthenticated={handleAuthenticated} /></Suspense>
  }

  return (
    <Routes>
      <Route element={<AuthenticatedLayout currentUser={currentUser} activeWorkspace={activeWorkspace} onWorkspaceSelected={handleWorkspaceSelected} onMembershipAdded={handleMembershipAdded} onLogout={handleLogout} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)} theme={theme} onToggleTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} />}>
        <Route index element={<Navigate to="/workspaces" replace />} />
        <Route path="workspaces" element={<RoutedPage pageId="workspaces" />} />
        <Route path="overview" element={<RoutedPage pageId="overview" />} />
        <Route path="projects" element={<RoutedPage pageId="projects" />} />
        <Route path="tasks" element={<RoutedPage pageId="tasks" />} />
        <Route path="calendar" element={<RoutedPage pageId="calendar" />} />
        <Route path="settings" element={<RoutedPage pageId="settings" />} />
        <Route path="*" element={<Navigate to="/workspaces" replace />} />
      </Route>
    </Routes>
  )
}

export default App
