# WorldWeave Backend - Setup & Implementation Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install express cors
```

### 2. Start the Server
```bash
node server.js
# or
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════════╗
║         🌍 WorldWeave Backend Server Running 🌍               ║
╚════════════════════════════════════════════════════════════════╝

  Server:   http://localhost:3000
  API:      http://localhost:3000/api
```

### 3. Test the API
```bash
# Health check
curl http://localhost:3000/api/health

# Get all events
curl http://localhost:3000/api/events

# Get categories
curl http://localhost:3000/api/categories

# Get bootstrap data
curl http://localhost:3000/api/bootstrap
```

---

## Project Structure

```
worldweave/
│
├── 📄 server.js                    # Main Express server & route setup
├── 📄 package.json                 # Dependencies & scripts
├── 📄 API-DOCUMENTATION.md         # Complete API reference
├── 📄 BACKEND-SETUP.md            # This file
│
├── 📁 config/
│   └── 📄 database.js              # In-memory database singleton
│
├── 📁 models/
│   ├── 📄 Event.js                 # Event model with methods
│   ├── 📄 Category.js              # Category model
│   └── 📄 Host.js                  # Host model
│
├── 📁 controllers/
│   ├── 📄 eventController.js       # Event business logic (20+ methods)
│   ├── 📄 categoryController.js    # Category operations
│   └── 📄 hostController.js        # Host operations
│
├── 📁 routes/
│   ├── 📄 events.js                # Event API endpoints
│   ├── 📄 categories.js            # Category endpoints
│   └── 📄 hosts.js                 # Host endpoints
│
├── 📁 middleware/
│   └── 📄 errorHandler.js          # Error & 404 handling
│
└── 📁 utils/
    └── 📄 validators.js            # Input validation functions
```

---

## Key Features

### ✅ Modular Architecture
- Separation of concerns (routes, controllers, models)
- Easy to extend and maintain
- Scalable design pattern

### ✅ Comprehensive API
- **Events**: CRUD operations, search, filtering, booking
- **Categories**: 7 event types with metadata
- **Hosts**: Profile management, analytics, followers
- **Ratings**: Event ratings and reviews
- **Payments**: Transaction tracking

### ✅ Data Models

#### Event
```javascript
{
  id, title, category, emoji, date, location, description,
  price, xp, hostId, maxCapacity, attendees, spotsRemaining,
  rating, reviews, color, gallery, goingUsers, savedBy, shares,
  createdAt, updatedAt
}
```

#### Category
```javascript
{
  id, name, emoji, color, description, eventCount
}
```

#### Host
```javascript
{
  id, name, avatar, bio, verified, eventsHosted, rating,
  reviews, followers, following, hostRing, boostedVisibility,
  joinedAt, responseTime, cancellationRate
}
```

### ✅ Advanced Features
- Pagination support on all list endpoints
- Multiple sort options (newest, trending, rating)
- Comprehensive search across title, location, description
- Event booking with attendee limits
- Host follower system
- Event ratings and reviews
- Wishlist/save functionality
- XP reward system

---

## API Endpoints Overview

### Status Endpoints
- `GET /api/health` - Server health check
- `GET /api/stats` - Platform statistics
- `GET /api/bootstrap` - Initial data load

### Events (30+ methods)
```
GET  /api/events                    - Get all events
GET  /api/events?sort=trending      - Sort by trending/rating
GET  /api/events/category/:cat      - Events by category
GET  /api/events/search?q=term      - Search events
GET  /api/events/:id                - Get single event
POST /api/events                    - Create event
PUT  /api/events/:id                - Update event
DEL  /api/events/:id                - Delete event
POST /api/events/:id/book           - Book event
POST /api/events/:id/cancel-booking - Cancel booking
POST /api/events/:id/share          - Share event
GET  /api/events/:id/ratings        - Get ratings
POST /api/events/:id/ratings        - Add rating
POST /api/events/:id/save           - Save event
POST /api/events/:id/unsave         - Unsave event
```

### Categories
```
GET  /api/categories                - All categories
GET  /api/categories/:id            - Category details
GET  /api/categories/:id/events     - Category events
```

### Hosts
```
GET  /api/hosts/:id                 - Host profile
GET  /api/hosts/:id/analytics       - Host analytics
GET  /api/hosts/:id/events          - Host's events
GET  /api/hosts/:id/ratings         - Host ratings
PUT  /api/hosts/:id                 - Update profile
POST /api/hosts/:id/follow          - Follow host
POST /api/hosts/:id/unfollow        - Unfollow host
```

---

## Usage Examples

### Get All Events with Pagination
```javascript
fetch('/api/events?limit=20&offset=0&sort=trending')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

### Search Events
```javascript
fetch('/api/events/search?q=coffee&limit=10')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

### Get Events by Category
```javascript
fetch('/api/events/category/nightclub?limit=50')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Book an Event
```javascript
fetch('/api/events/1/book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user123' })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Create New Event
```javascript
fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Sunset Trek',
    category: 'trek',
    description: 'Enjoy nature at sunset',
    location: 'Mountain Peak',  
    hostId: 1,
    price: 0,
    maxCapacity: 30
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Get Host Analytics
```javascript
fetch('/api/hosts/1/analytics')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

### Follow a Host
```javascript
fetch('/api/hosts/1/follow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user123' })
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## Database Layer

### In-Memory Database Class

The `database.js` file contains the `Database` class that manages all data:

```javascript
class Database {
  // Event operations
  getAllEvents()
  getEventById(id)
  getEventsByCategory(category)
  searchEvents(query)
  createEvent(eventData)
  updateEvent(id, updates)
  deleteEvent(id)

  // Booking operations
  addBooking(eventId, userId)
  cancelBooking(eventId, userId)

  // Category operations
  getAllCategories()
  getCategoryById(id)
  getCategoryEvents(categoryId)

  // Host operations
  getAllHosts()
  getHostById(id)
  getHostEvents(hostId)

  // Payment operations
  createPayment(eventId, userId, amount)
  getPaymentHistory(userId)

  // Utilities
  getStats()
}
```

### Extending to Persistent Database

To use MongoDB:

```javascript
// config/database.js
const mongoose = require('mongoose');

class Database {
  constructor() {
    mongoose.connect(process.env.MONGODB_URI);
  }

  async getAllEvents() {
    return await Event.find();
  }

  async getEventById(id) {
    return await Event.findById(id);
  }

  // ... implement other methods with MongoDB queries
}
```

---

## Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/worldweave
CORS_ORIGIN=*
LOG_LEVEL=info
```

---

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### HTTP Status Codes Used
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

---

## Performance Considerations

### Current (In-Memory)
- ✅ Instant response times
- ✅ Perfect for development
- ❌ Data lost on restart
- ❌ Not suitable for production with persistence

### Optimization Tips
1. **Pagination**: Always use limit/offset for large datasets
2. **Caching**: Implement Redis for frequently accessed data
3. **Indexing**: Add database indexes on frequently searched fields
4. **Load Balancing**: Use PM2 or similar for clustering

---

## Testing the API

### Using cURL
```bash
# Get health
curl -X GET http://localhost:3000/api/health

# Get all categories
curl -X GET http://localhost:3000/api/categories

# Search events
curl -X GET "http://localhost:3000/api/events/search?q=run"

# Book an event
curl -X POST http://localhost:3000/api/events/1/book \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123"}'
```

### Using Postman
1. Import API collection
2. Set base URL to `http://localhost:3000`
3. Test each endpoint with provided examples

### Using JavaScript (Node.js)
```javascript
const fetch = require('node-fetch');

async function testAPI() {
  const response = await fetch('http://localhost:3000/api/events');
  const data = await response.json();
  console.log(data);
}

testAPI();
```

---

## Deployment

### Heroku
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t worldweave .
docker run -p 3000:3000 worldweave
```

### AWS/Google Cloud
Configure environment and deploy using your preferred platform's CLI.

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 node server.js
```

### Module Not Found
```bash
# Reinstall dependencies
rm package-lock.json node_modules -rf
npm install
```

### CORS Issues
```javascript
// Ensure CORS is properly configured in server.js
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

---

## Next Steps

1. ✅ Start the server: `node server.js`
2. ✅ Test endpoints: Use cURL or Postman
3. ✅ Integrate with frontend: Update API calls in frontend code
4. ✅ Add authentication: Implement JWT tokens
5. ✅ Setup database: Connect to MongoDB/PostgreSQL
6. ✅ Deploy: Push to production server

---

## Support & Documentation

- **Full API Docs**: See `API-DOCUMENTATION.md`
- **Code Comments**: All functions have JSDoc comments
- **Examples**: Check usage examples in this file

Enjoy building with WorldWeave Backend! 🚀
