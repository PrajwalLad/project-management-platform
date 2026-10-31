const projects = [
  { name: 'Website redesign', desc: 'Refresh the company website and design system.', category: 'Design', color: 'violet', progress: 72, date: 'Oct 28', members: 'JD · MK · AL' },
  { name: 'Mobile app', desc: 'Build a faster, more helpful mobile experience.', category: 'Product', color: 'orange', progress: 48, date: 'Nov 04', members: 'JD · MK · TR' },
  { name: 'Q4 marketing', desc: 'Plan and launch the Q4 campaign.', category: 'Marketing', color: 'blue', progress: 86, date: 'Oct 30', members: 'AL · TR · MK' },
  { name: 'Customer research', desc: 'Turn customer interviews into product insights.', category: 'Research', color: 'green', progress: 34, date: 'Nov 12', members: 'JD · AL' },
]

function Projects() {
  return <section className="page-content"><div className="welcome-row"><div><p className="eyebrow">WORKSPACE</p><h1>Projects</h1><p className="page-subtitle">Plan, track, and deliver great work together.</p></div><button className="primary-button"><Plus size={17} /> New project</button></div><div className="page-toolbar"><div className="segmented-control"><button className="selected">All projects <span>6</span></button><button>My projects <span>3</span></button></div><button className="filter-button"><Filter size={15} /> Filters</button></div><div className="project-cards">{projects.map((project) => <article className="project-card" key={project.name}><div className="project-card-top"><span className={'project-color color-' + project.color}/><span className="category-pill">{project.category}</span><button className="more-button" aria-label={'More options for ' + project.name}><MoreHorizontal size={18} /></button></div><h2>{project.name}</h2><p>{project.desc}</p><div className="project-card-progress"><div><span>Progress</span><strong>{project.progress}%</strong></div><span className="progress-track"><i className={'progress-' + project.color} style={{width: project.progress + '%'}}/></span></div><div className="project-card-bottom"><div className="card-members"><span className="avatar avatar-you">JD</span><span className="avatar avatar-1">MK</span><span className="avatar avatar-2">AL</span></div><span><CalendarDays size={14} /> {project.date}</span></div></article>)}</div></section>
}

export default Projects
import { CalendarDays, Filter, MoreHorizontal, Plus } from 'lucide-react'

