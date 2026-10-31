function Settings() {
  return <section className="page-content"><div className="welcome-row"><div><p className="eyebrow">WORKSPACE</p><h1>Settings</h1><p className="page-subtitle">Manage your workspace and personal preferences.</p></div></div><section className="panel settings-panel"><div className="settings-tabs"><button className="selected">General</button><button>Members</button><button>Notifications</button><button>Billing</button></div><div className="settings-form"><h2>Workspace details</h2><p>Update your workspace name and preferences.</p><label>Workspace name<input defaultValue="Northstar Studio"/></label><label>Workspace URL<div className="url-input"><span>flowspace.app/</span><input defaultValue="northstar-studio"/></div></label><label>Workspace description<textarea defaultValue="A shared space for the Northstar team to plan and deliver great work."/></label><button className="primary-button">Save changes</button></div></section></section>
}

export default Settings
