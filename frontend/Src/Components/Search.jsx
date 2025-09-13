import React, {useState} from 'react'

export default function Search(){
  const [query,setQuery] = useState('')
  const [results,setResults] = useState([])
  const [loading,setLoading] = useState(false)
  const [filters,setFilters] = useState({category:'',maxDistance:5,brand:''})

  async function doSearch(e){
    e && e.preventDefault()
    setLoading(true)
    const params = new URLSearchParams({
      q: query,
      category: filters.category,
      maxDistance: filters.maxDistance,
      brand: filters.brand
    })
    const res = await fetch('/api/search?'+params.toString())
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={doSearch} style={{marginBottom:12}}>
        <input placeholder="search product or keyword" value={query} onChange={e=>setQuery(e.target.value)} />
        <select value={filters.category} onChange={e=>setFilters(f=>({...f,category:e.target.value}))}>
          <option value=''>All categories</option>
          <option>Furniture</option><option>Digital electronics</option><option>Shoes</option><option>Watch</option><option>Smartphone</option><option>Home decor</option><option>Stationary</option><option>Restaurant</option><option>Beverage</option><option>Clothes</option>
        </select>
        <input type="number" value={filters.maxDistance} onChange={e=>setFilters(f=>({...f,maxDistance:e.target.value}))} style={{width:90}} /> km
        <input placeholder="brand filter" value={filters.brand} onChange={e=>setFilters(f=>({...f,brand:e.target.value}))} />
        <button type="submit">Search</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <>
          <div>Results: {results.length}</div>
          <div>
            {results.map(s => (
              <div key={s.id} className="store-card">
                <strong>{s.name}</strong> — {s.category} — Rating: {s.rating} — Distance: {s.distance_km} km
                <div>{s.description}</div>
                <div style={{marginTop:8}}>
                  <button onClick={()=>{ navigator.clipboard && navigator.clipboard.writeText('Message to '+s.name); alert('Prepared a demo message to '+s.name) }}>Message shop</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
