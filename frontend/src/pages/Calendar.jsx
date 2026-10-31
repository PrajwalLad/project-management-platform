import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const days = [
  { day: 'MON', date: '19', items: [['Wireframe review', 'violet'], ['Team standup', 'green']] },
  { day: 'TUE', date: '20', items: [['Design sync', 'blue']] },
  { day: 'WED', date: '21', items: [['Product demo', 'orange'], ['Research share-out', 'green']] },
  { day: 'THU', date: '22', items: [['Sprint planning', 'violet']] },
  { day: 'FRI', date: '23', items: [['Homepage review', 'violet'], ['Team check-in', 'green'], ['Campaign kickoff', 'orange']] },
  { day: 'SAT', date: '24', today: true, items: [] },
  { day: 'SUN', date: '25', items: [] },
]

function Calendar() {
  return (
    <section className="page-content">
      <div className="welcome-row">
        <div><p className="eyebrow">YOUR SCHEDULE</p><h1>Calendar</h1><p className="page-subtitle">Keep your team’s milestones and meetings in sync.</p></div>
        <button className="primary-button"><Plus size={17} /> New event</button>
      </div>
      <section className="panel calendar-panel">
        <div className="calendar-heading">
          <div><h2>October 19 – 25, 2026</h2><span className="calendar-month">Week 43</span></div>
          <div className="calendar-controls">
            <button aria-label="Previous week"><ChevronLeft size={15} /></button><button>Today</button>
            <button aria-label="Next week"><ChevronRight size={15} /></button>
            <button className="calendar-view-button">Week <ChevronDown size={14} /></button>
          </div>
        </div>
        <div className="week-grid">{days.map((day) => <div className={'day-column ' + (day.today ? 'today-column' : '')} key={day.date}><div className="day-heading"><span>{day.day}</span><strong>{day.date}</strong></div><div className="day-events">{day.items.map((item) => <div className={'calendar-event event-' + item[1]} key={item[0]}>{item[0]}</div>)}</div></div>)}</div>
        <div className="calendar-legend"><span><i className="color-violet"/>Website redesign</span><span><i className="color-orange"/>Mobile app</span><span><i className="color-green"/>Team</span></div>
      </section>
    </section>
  )
}

export default Calendar
