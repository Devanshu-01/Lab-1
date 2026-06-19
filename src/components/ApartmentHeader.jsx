import StarRating from './StarRating'

// Top of the Apartment Detail page: photo, name, address, neighbourhood, rating.
function ApartmentHeader({ apartment }) {
  const { name, address, neighbourhood, rating, reviewCount, imageUrl } = apartment
  const safeRating = rating ?? 0
  return (
    <header className="apt-header">
      <div className="apt-header-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="apt-header-info">
        <h1 className="apt-header-name">{name}</h1>
        <p className="apt-header-address">
          <span className="pin">📍</span> {address} · {neighbourhood}
        </p>
        <div className="apt-header-rating">
          <StarRating rating={safeRating} />
          <span className="apt-header-score">{safeRating.toFixed(1)}</span>
          <span className="apt-header-count">
            ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
          </span>
        </div>
      </div>
    </header>
  )
}

export default ApartmentHeader
