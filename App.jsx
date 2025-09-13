import React, {useState} from 'react'
import Search from './components/Search'
import Dashboard from './components/Dashboard'

export default function App(){
  const [view, setView] = useState('search')
  return (
    <div style={{fontFamily:'sans-serif',padding:20}}>
      <header style={{display:'flex',gap:12,marginBottom:20}}>
        <h2>Offline Shop Recommender (Starter)</h2>
        <nav style={{marginLeft:'auto'}}>
          <button onClick={()=>setView('search')}>Search</button>
          <button onClick={()=>setView('dashboard')}>Store Dashboard</button>
        </nav>
      </header>
      {view==='search' ? <Search /> : <Dashboard />}
    </div>
  )
}
