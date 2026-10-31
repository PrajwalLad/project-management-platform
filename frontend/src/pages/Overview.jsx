const projects = [
  { name: 'Website redesign', category: 'Design', color: 'violet', progress: 72, date: 'Oct 28', members: ['JD', 'MK', 'AL'] },
  { name: 'Mobile app', category: 'Product', color: 'orange', progress: 48, date: 'Nov 04', members: ['JD', 'MK', 'TR'] },
  { name: 'Q4 marketing', category: 'Marketing', color: 'blue', progress: 86, date: 'Oct 30', members: ['AL', 'TR', 'MK'] },
]

const tasks = [
  { title: 'Finalize homepage wireframes', project: 'Website redesign', date: 'Today', color: 'violet', done: false },
  { title: 'Review onboarding flow', project: 'Mobile app', date: 'Today', color: 'orange', done: false },
  { title: 'Share campaign brief', project: 'Q4 marketing', date: 'Tomorrow', color: 'blue', done: false },
]

function AvatarStack({ members }) {
  return <div className="avatar-stack">{members.map((member, index) => <span className={'avatar avatar-' + index} key={member}>{member}</span>)}</div>
}

function Overview({ onNavigate, user }) {
  return (
    <section className="page-content">
      <div className="welcome-row">
        <div><p className="eyebrow">SATURDAY, OCTOBER 24, 2026 <Sun className="sun-icon" size={14} /></p><h1>Good morning, {user?.name?.split(' ')[0] || 'there'} <span className="wave"><Sparkles size={16} /></span></h1><p className="page-subtitle">Here’s what’s happening across your workspace today.</p></div>
        <button className="primary-button" onClick={() => onNavigate('projects')}><Plus size={17} /> New project</button>
      </div>
      <div className="stats-grid">
        <article className="stat-card"><div className="stat-top"><span>Active projects</span><span className="stat-icon stat-purple"><FolderKanban size={16} /></span></div><strong>6</strong><div className="stat-foot"><span className="trend-up"><TrendingUp size={13} /> 2</span> vs. last month</div><div className="sparkline purple-line"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
        <article className="stat-card"><div className="stat-top"><span>Tasks completed</span><span className="stat-icon stat-green"><Check size={16} /></span></div><strong>24<span className="stat-denom">/32</span></strong><div className="stat-foot"><span className="trend-up"><TrendingUp size={13} /> 12%</span> vs. last week</div><div className="mini-progress"><i style={{width:'75%'}} /></div></article>
        <article className="stat-card"><div className="stat-top"><span>Team members</span><span className="stat-icon stat-blue"><Users size={16} /></span></div><strong>8</strong><div className="stat-foot"><span>Across 4 departments</span></div><div className="stat-avatars"><AvatarStack members={['JD','MK','AL','TR']} /><span>+4</span></div></article>
        <article className="stat-card"><div className="stat-top"><span>Upcoming deadlines</span><span className="stat-icon stat-orange"><CalendarClock size={16} /></span></div><strong>3</strong><div className="stat-foot"><span className="deadline-alert">Next one in 2 days</span></div><div className="deadline-line"><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
      </div>

      <div className="content-grid">
        <section className="panel projects-panel">
          <div className="panel-heading"><div><h2>Projects</h2><p>Your team’s work at a glance</p></div><button className="text-button" onClick={() => onNavigate('projects')}>View all <ArrowRight size={14} /></button></div>
          <div className="project-table">
            <div className="table-head"><span>PROJECT</span><span>PROGRESS</span><span>DUE DATE</span><span>TEAM</span></div>
            {projects.map((project) => <div className="project-row" key={project.name}><div className="project-name-cell"><span className={'project-color color-' + project.color}/><div><strong>{project.name}</strong><small>{project.category}</small></div></div><div className="progress-cell"><span className="progress-track"><i className={'progress-' + project.color} style={{width: project.progress + '%'}} /></span><small>{project.progress}%</small></div><span className="due-date">{project.date}</span><AvatarStack members={project.members}/></div>)}
          </div>
          <button className="mobile-view-all" onClick={() => onNavigate('projects')}>View all projects <ArrowRight size={14} /></button>
        </section>
        <section className="panel tasks-panel">
          <div className="panel-heading"><div><h2>My tasks <span className="heading-count">4</span></h2><p>Stay on top of your priorities</p></div><button className="more-button" aria-label="More task options">···</button></div>
          <div className="task-list">{tasks.map((task) => <label className="task-item" key={task.title}><input type="checkbox" checked={task.done} readOnly/><span className={'task-check ' + task.color}/><span className="task-copy"><strong>{task.title}</strong><small><i className={'project-color color-' + task.color}/>{task.project}</small></span><span className={'task-date ' + (task.date === 'Today' ? 'today' : '')}>{task.date}</span></label>)}</div>
          <button className="add-task-button" onClick={() => onNavigate('tasks')}><Plus size={15} /> Add a task</button>
        </section>
      </div>

      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>See what your team has been up to</p></div><button className="text-button">See all activity <ArrowRight size={14} /></button></div><div className="activity-list"><div className="activity-entry"><span className="avatar avatar-1">MK</span><p><strong>Maya Kim</strong> completed <b>“Design system audit”</b><small>Website redesign <span>·</span> 18 min ago</small></p><span className="activity-tag done-tag">Completed</span></div><div className="activity-entry"><span className="avatar avatar-2">AL</span><p><strong>Alex Lee</strong> added a comment to <b>“Campaign concepts”</b><small>Q4 marketing <span>·</span> 1 hour ago</small></p><span className="activity-tag comment-tag">Comment</span></div><div className="activity-entry"><span className="avatar avatar-3">TR</span><p><strong>Taylor Reed</strong> created a new task <b>“Prepare launch checklist”</b><small>Mobile app <span>·</span> 3 hours ago</small></p><span className="activity-tag task-tag">New task</span></div></div></section>
    </section>
  )
}

export default Overview



import { ArrowRight, CalendarClock, Check, FolderKanban, Plus, Sparkles, Sun, TrendingUp, Users } from 'lucide-react'

