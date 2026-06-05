// Seed reviews. aptId links a review to an apartment in apartments.js.
// userEmail links a review to the user who wrote it (used by the Profile page).
export const initialReviews = [
  { id: 1, aptId: 1, rating: 5, body: 'Spotless building and the landlord actually responds within a day. Highly recommend.', date: '2026-04-12', author: 'Alex', userEmail: 'alex@dal.ca' },

  { id: 2, aptId: 2, rating: 5, body: 'Quiet, very well maintained, and the staff are professional. Worth the price.', date: '2026-03-28', author: 'Jordan', userEmail: 'jordan@dal.ca' },
  { id: 3, aptId: 2, rating: 4, body: 'Great spot but rent is steep. Management is solid and repairs are quick.', date: '2026-02-15', author: 'Alex', userEmail: 'alex@dal.ca' },

  { id: 4, aptId: 3, rating: 4, body: 'Good location right by campus. Parking is a constant pain though.', date: '2026-03-05', author: 'Sam', userEmail: 'sam@dal.ca' },
  { id: 5, aptId: 3, rating: 4, body: 'Building is aging but the front-desk staff are friendly and helpful.', date: '2026-01-22', author: 'Riley', userEmail: 'riley@dal.ca' },
  { id: 6, aptId: 3, rating: 3, body: 'Walls are thin, but the commute is unbeatable. A fair trade for students.', date: '2025-12-10', author: 'Alex', userEmail: 'alex@dal.ca' },

  { id: 7, aptId: 4, rating: 4, body: 'Incredible views from the upper floors. Sunsets make up for a lot.', date: '2026-04-01', author: 'Casey', userEmail: 'casey@dal.ca' },
  { id: 8, aptId: 4, rating: 3, body: 'Elevators break down often, which is frustrating during exam season.', date: '2026-02-20', author: 'Morgan', userEmail: 'morgan@dal.ca' },
  { id: 9, aptId: 4, rating: 3, body: 'Security at the front entrance could be better. Otherwise fine.', date: '2026-01-08', author: 'Taylor', userEmail: 'taylor@dal.ca' },

  { id: 10, aptId: 5, rating: 3, body: 'Affordable and central, but maintenance requests take ages to resolve.', date: '2026-03-18', author: 'Jamie', userEmail: 'jamie@dal.ca' },
  { id: 11, aptId: 5, rating: 2, body: 'Heating issues all winter. Took weeks to get someone to look at it.', date: '2026-02-02', author: 'Drew', userEmail: 'drew@dal.ca' },
  { id: 12, aptId: 5, rating: 3, body: 'Decent for the price if you keep your expectations low.', date: '2026-01-15', author: 'Pat', userEmail: 'pat@dal.ca' },
  { id: 13, aptId: 5, rating: 2, body: 'Noisy neighbours and thin walls. Not ideal if you need to study.', date: '2025-12-28', author: 'Lee', userEmail: 'lee@dal.ca' },
]
