const express = require('express')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const { stringify } = require('csv-stringify/sync')
const multer = require('multer')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const CSV_PATH = path.join(__dirname, '..', 'stores.csv')
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') })

function readStores(){
  const raw = fs.readFileSync(CSV_PATH, 'utf8')
  const records = parse(raw, { columns: true, skip_empty_lines: true })
  return records.map(r => {
    // normalize numeric fields
    r.price_from = Number(r.price_from || 0)
    r.price_to = Number(r.price_to || 0)
    r.rating = Number(r.rating || 0)
    r.availability_time_minutes = Number(r.availability_time_minutes || 0)
    r.distance_km = Number(r.distance_km || 0)
    return r
  })
}

app.get('/api/search', (req, res) => {
  const { q = '', category = '', maxDistance = 9999, brand = '' } = req.query
  const stores = readStores()
  const maxD = Number(maxDistance)
  const filtered = stores.filter(s => {
    if(category && s.category !== category) return false
    if(brand && !(s.brands || '').toLowerCase().includes(brand.toLowerCase())) return false
    if(q){
      const ql = q.toLowerCase()
      if(!(
        (s.name||'').toLowerCase().includes(ql) ||
        (s.description||'').toLowerCase().includes(ql) ||
        (s.brands||'').toLowerCase().includes(ql)
      )) return false
    }
    if(Number(s.distance_km) > maxD) return false
    return true
  })
  // sort: rating desc, distance asc
  filtered.sort((a,b) => {
    if(b.rating !== a.rating) return b.rating - a.rating
    return a.distance_km - b.distance_km
  })
  res.json(filtered)
})

app.post('/api/register-store', (req, res) => {
  const store = req.body
  const stores = readStores()
  const nextId = stores.length ? (Math.max(...stores.map(s=>Number(s.id)))+1) : 1
  store.id = nextId
  // ensure fields order matches header
  const header = ['id','name','category','brands','price_from','price_to','after_sale_services','rating','shop_type','availability_time_minutes','distance_km','description']
  const newRow = header.map(h => store[h] !== undefined ? store[h] : '')
  stores.push(Object.fromEntries(header.map((h,i)=>[h,newRow[i]])))
  const csv = stringify(stores, { header: true, columns: header })
  fs.writeFileSync(CSV_PATH, csv, 'utf8')
  res.json({ message: 'Store registered and appended to stores.csv', store })
})

app.post('/api/upload-stores', upload.single('storesCsv'), (req, res) => {
  if(!req.file) return res.status(400).send('No file uploaded')
  const tempPath = req.file.path
  const dest = CSV_PATH
  fs.renameSync(tempPath, dest)
  res.send('Uploaded and replaced stores.csv')
})

// demo message endpoint to "forward" message to shopkeeper
app.post('/api/message', (req, res) => {
  const { storeId, customerMessage } = req.body
  // In production: find shop contact and forward via SMS/WhatsApp/email or push notification.
  // Here we just append to a messages log and simulate a canned reply.
  const messagesLog = path.join(__dirname, '..', 'messages.log')
  const entry = `[${new Date().toISOString()}] To store ${storeId}: ${customerMessage}\n`
  fs.appendFileSync(messagesLog, entry)
  // Simulated shop reply
  const reply = `Shop ${storeId} received your message. They'll reply in a short while (demo).`
  fs.appendFileSync(messagesLog, `[${new Date().toISOString()}] From store ${storeId}: ${reply}\n`)
  res.json({ status: 'forwarded (simulated)', reply })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('Server listening on', PORT))
