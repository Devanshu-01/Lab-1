import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { neighbourhoods, sortOptions } from '../data/apartments'
import { api } from '../lib/api'
import ApartmentCard from '../components/ApartmentCard'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('All Neighbourhoods')
  const [sort, setSort] = useState('Highest Rated')

  // Load the apartment list (with rating + reviewCount) from the API.
  useEffect(() => {
    let active = true
    api.listApartments()
      .then(data => { if (active) setApartments(data) })
      .catch(err => { if (active) setError(err.message || 'Failed to load apartments') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (!user) {
    return null
  }

  const totalReviews = apartments.reduce((sum, a) => sum + (a.reviewCount || 0), 0)
  const uniqueNeighbourhoods = [...new Set(apartments.map(a => a.neighbourhood))].length

  let filtered = apartments.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.address.toLowerCase().includes(q) || a.neighbourhood.toLowerCase().includes(q)
    const matchNeighbourhood = neighbourhood === 'All Neighbourhoods' || a.neighbourhood === neighbourhood
    return matchSearch && matchNeighbourhood
  })

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Highest Rated') return b.rating - a.rating
    if (sort === 'Lowest Rated') return a.rating - b.rating
    if (sort === 'Most Reviews') return b.reviewCount - a.reviewCount
    return 0
  })

  function handleSignOut() {
    logout()
    navigate('/login')
  }

  const initials = user.initials || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US'

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="dash-nav">
        <span className="dash-logo">TenantTrails</span>
        <div className="dash-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search apartments by address or neighbourhood..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="dash-user">
          <Link to="/profile" className="user-profile-link">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user.name}</span>
          </Link>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      {/* Main content */}
      <main className="dash-main">
        <div className="dash-header">
          <h1>Apartments in Halifax</h1>
          <p>Honest reviews from real tenants. Read before you rent.</p>
        </div>

        {/* Stats row */}
        <div className="dash-stats">
          <span className="stat-chip">{apartments.length} apartments</span>
          <span className="stat-chip">{totalReviews} reviews</span>
          <span className="stat-chip">{uniqueNeighbourhoods} neighbourhoods</span>
        </div>

        {/* Filters */}
        <div className="dash-filters">
          <select value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)}>
            {neighbourhoods.map(n => <option key={n}>{n}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {sortOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="no-results"><p>Loading apartments…</p></div>
        ) : error ? (
          <div className="no-results"><p>{error}</p></div>
        ) : filtered.length > 0 ? (
          <div className="apt-grid">
            {filtered.map(apt => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No apartments match your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
