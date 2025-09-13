import React, {useState} from 'react'

export default function Dashboard(){
  const [form, setForm] = useState({name:'',category:'',brands:'',price_from:'',price_to:'',after_sale_services:'',rating:4.0,shop_type:'store',availability_time_minutes:60,distance_km:1,description:''})
  const [status,setStatus] = useState('')

  async function submit(e){
    e.preventDefault()
    setStatus('Submitting...')
    const res = await fetch('/api/register-store', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setStatus(data.message || 'done')
  }

  return (
    <div>
      <h3>Store Dashboard — Register store (demo)</h3>
      <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:520}}>
        {Object.keys(form).map(key => (
          <input key={key} placeholder={key} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} />
        ))}
        <button type="submit">Register Store (append to stores.csv)</button>
      </form>
      <div style={{marginTop:12}}>{status}</div>
      <hr />
      <div>
        <h4>CSV Upload (replace full DB)</h4>
        <form action="/api/upload-stores" method="post" encType="multipart/form-data">
          <input type="file" name="storesCsv" accept=".csv" />
          <button type="submit">Upload CSV</button>
        </form>
        <p>You can open `stores.csv` in Excel and upload it here to replace the dataset.</p>
      </div>
    </div>
  )
}
