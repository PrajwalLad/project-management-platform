const tasks = [
  ['Finalize homepage wireframes', 'Website redesign', 'Today', 'violet'],
  ['Review onboarding flow', 'Mobile app', 'Today', 'orange'],
  ['Share campaign brief', 'Q4 marketing', 'Tomorrow', 'blue'],
  ['Prepare launch checklist', 'Mobile app', 'Oct 28', 'orange'],
  ['Review research notes', 'Customer research', 'Oct 30', 'green'],
]

function Tasks() {
  return <section className="page-content"><div className="welcome-row"><div><p className="eyebrow">YOUR WORK</p><h1>My tasks</h1><p className="page-subtitle">A clear view of what needs your attention.</p></div><button className="primary-button"><Plus size={17} /> Add task</button></div><div className="page-toolbar"><div className="segmented-control"><button className="selected">Upcoming <span>4</span></button><button>Completed</button></div><button className="filter-button"><Filter size={15} /> Filters</button></div><section className="panel task-page-panel"><div className="task-group-heading"><span>Today</span><span>2 tasks</span></div>{tasks.slice(0,2).map((task) => <label className="task-item task-page-item" key={task[0]}><input type="checkbox"/><span className={'task-check ' + task[3]}/><span className="task-copy"><strong>{task[0]}</strong><small><i className={'project-color color-' + task[3]}/>{task[1]}</small></span><span className="task-date today">{task[2]}</span></label>)}<div className="task-group-heading"><span>Upcoming</span><span>3 tasks</span></div>{tasks.slice(2).map((task) => <label className="task-item task-page-item" key={task[0]}><input type="checkbox"/><span className={'task-check ' + task[3]}/><span className="task-copy"><strong>{task[0]}</strong><small><i className={'project-color color-' + task[3]}/>{task[1]}</small></span><span className="task-date">{task[2]}</span></label>)}</section></section>
}

export default Tasks
import { Filter, Plus } from 'lucide-react'

