import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApartmentCard from '../components/ApartmentCard'
import './Dashboard.css'

const APARTMENTS = [
  {
    id: 1,
    name: 'The Marlstone',
    address: '5540 Spring Garden Rd',
    neighbourhood: 'Spring Garden',
    rating: 5.0,
    reviewCount: 1,
    tags: [],
    noSummary: true,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
  },
  {
    id: 2,
    name: 'Park Victoria',
    address: '1496 Carlton St',
    neighbourhood: 'South End',
    rating: 4.5,
    reviewCount: 2,
    tags: ['Well maintained', 'Quiet', 'Expensive'],
    noSummary: false,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
  },
  {
    id: 3,
    name: 'Le Marchant Towers',
    address: '1585 Le Marchant St',
    neighbourhood: 'West End',
    rating: 3.7,
    reviewCount: 3,
    tags: ['Good location', 'Parking limited', 'Aging building'],
    noSummary: false,
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  },
  {
    id: 4,
    name: 'Fenwick Tower',
    address: '5599 Fenwick St',
    neighbourhood: 'Downtown',
    rating: 3.3,
    reviewCount: 3,
    tags: ['Elevator issues', 'Great views', 'Security concerns'],
    noSummary: false,
    imageUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=600&q=80',
  },
  {
    id: 5,
    name: 'Southpoint Apartments',
    address: '1050 South Park St',
    neighbourhood: 'South End',
    rating: 2.5,
    reviewCount: 4,
    tags: [],
    noSummary: true,
    imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80',
  },
]

const NEIGHBOURHOODS = ['All Neighbourhoods', 'South End', 'Downtown', 'West End', 'Spring Garden']
const SORT_OPTIONS = ['Highest Rated', 'Most Reviews', 'Lowest Rated']

function Dashboard({ user, onSignOut }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('All Neighbourhoods')
  const [sort, setSort] = useState('Highest Rated')

  const totalReviews = APARTMENTS.reduce((s, a) => s + a.reviewCount, 0)
  const uniqueNeighbourhoods = [...new Set(APARTMENTS.map(a => a.neighbourhood))].length

  let filtered = APARTMENTS.filter(a => {
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
    onSignOut()
    navigate('/')
  }

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
          <div className="user-avatar">{user.initials}</div>
          <span className="user-name">{user.name}</span>
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
          <span className="stat-chip">{APARTMENTS.length} apartments</span>
          <span className="stat-chip">{totalReviews} reviews</span>
          <span className="stat-chip">{uniqueNeighbourhoods} neighbourhoods</span>
        </div>

        {/* Filters */}
        <div className="dash-filters">
          <select value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)}>
            {NEIGHBOURHOODS.map(n => <option key={n}>{n}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
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
