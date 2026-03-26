# WorldWeave Backend API Documentation

## Overview
WorldWeave is a premium event discovery platform with a modular, scalable backend built with Express.js. The backend provides RESTful API endpoints for managing events, categories, hosts, and user interactions.

## Architecture

### Folder Structure
```
worldweave/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── config/
│   └── database.js          # In-memory database with seed data
├── models/
│   ├── Event.js             # Event data model
│   ├── Category.js          # Category data model
│   └── Host.js              # Host data model
├── controllers/
│   ├── eventController.js   # Event business logic
│   ├── categoryController.js # Category business logic
│   └── hostController.js    # Host business logic
├── routes/
│   ├── events.js            # Event API routes
│   ├── categories.js        # Category routes
│   └── hosts.js             # Host routes
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── utils/
│   └── validators.js        # Input validation utilities
├── index.html               # Home page
├── events.html              # Events page
└── profile.html             # Profile page
```

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: In-memory (extensible to MongoDB/PostgreSQL)
- **Middleware**: CORS, body-parser, error handling

## API Endpoints

### Health & Status

#### Get Health Status
```
GET /api/health
```
Returns server status and version.

**Response:**
```json
{
  "ok": true,
  "app": "worldweave-backend",
  "version": "1.0.0",
  "timestamp": "2026-03-26T12:00:00.000Z"
}
```

#### Get Statistics
```
GET /api/stats
```
Returns platform statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEvents": 9,
    "totalHosts": 3,
    "totalCategories": 7,
    "totalAttendees": 800,
    "totalRevenue": 5000
  }
}
```

#### Bootstrap Data
```
GET /api/bootstrap
```
Returns all initial data (events, categories, hosts, stats).

---

## Events API

### Get All Events
```
GET /api/events?limit=50&offset=0&sort=newest
```

**Query Parameters:**
- `limit` (optional): Number of events to return (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)
- `sort` (optional): Sort order - 'newest', 'trending', 'rating' (default: newest)

**Response:**
```json
{
  "success": true,
  "data": [...events],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100
  }
}
```

### Get Events by Category
```
GET /api/events/category/:category?limit=50&offset=0
```

**Parameters:**
- `category`: Event category (run, nightclub, cafe, comedy, workshop, trek, party)

**Response:**
```json
{
  "success": true,
  "category": "run",
  "data": [...events],
  "pagination": {...}
}
```

### Search Events
```
GET /api/events/search?q=query&limit=50&offset=0
```

**Query Parameters:**
- `q` (required): Search query (max 200 characters)
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "query": "run",
  "data": [...events],
  "pagination": {...}
}
```

### Get Single Event
```
GET /api/events/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Morning Run Club",
    "category": "run",
    "emoji": "🏃",
    "date": "2026-03-28 06:30 AM",
    "location": "Central Park, Downtown",
    "description": "...",
    "price": 0,
    "xp": 15,
    "hostId": 1,
    "maxCapacity": 50,
    "attendees": 24,
    "spotsRemaining": 26,
    "rating": 4.8,
    "reviews": 12,
    "color": "#FF6B6B",
    "gallery": [],
    "goingUsers": [...],
    "savedBy": [],
    "shares": 0,
    "createdAt": "2026-03-26T...",
    "updatedAt": "2026-03-26T..."
  }
}
```

### Create Event
```
POST /api/events
```

**Request Body:**
```json
{
  "title": "New Event",
  "category": "workshop",
  "description": "Event description",
  "location": "Venue location",
  "date": "2026-04-15 07:00 PM",
  "price": 25,
  "maxCapacity": 100,
  "hostId": 1
}
```

**Required Fields:** title, category, description, location, hostId
**Optional Fields:** date, price (default: 0), maxCapacity (default: 100)

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {...event}
}
```

### Update Event
```
PUT /api/events/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 30,
  "maxCapacity": 120
}
```

**Allowed Fields:** title, description, location, date, price, maxCapacity

**Response:**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {...event}
}
```

### Delete Event
```
DELETE /api/events/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Book Event
```
POST /api/events/:id/book
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event booked successfully",
  "data": {
    "booking": {...},
    "event": {...},
    "xpAwarded": 5
  }
}
```

### Cancel Booking
```
POST /api/events/:id/cancel-booking
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### Share Event
```
POST /api/events/:id/share
```

**Response:**
```json
{
  "success": true,
  "message": "Event shared successfully",
  "data": {
    "eventId": 1,
    "shares": 5
  }
}
```

### Get Event Ratings
```
GET /api/events/:id/ratings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": 1,
    "rating": 4.8,
    "reviews": 12
  }
}
```

### Add Rating
```
POST /api/events/:id/ratings
```

**Request Body:**
```json
{
  "userId": "user123",
  "rating": 5,
  "review": "Amazing event!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating added successfully",
  "data": {
    "eventId": 1,
    "newRating": 4.9,
    "totalReviews": 13
  }
}
```

### Save Event
```
POST /api/events/:id/save
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event saved successfully",
  "data": {
    "eventId": 1,
    "savedCount": 5
  }
}
```

### Unsave Event
```
POST /api/events/:id/unsave
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event removed from saved",
  "data": {
    "eventId": 1,
    "savedCount": 4
  }
}
```

---

## Categories API

### Get All Categories
```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "run",
      "name": "Run Clubs",
      "emoji": "🏃",
      "color": "#FF6B6B",
      "description": "",
      "eventCount": 3
    },
    ...
  ]
}
```

### Get Category by ID
```
GET /api/categories/:id
```

**Response:**
```json
{
  "success": true,
  "data": {...category}
}
```

### Get Category Events
```
GET /api/categories/:categoryId/events?limit=50&offset=0&sort=newest
```

**Response:**
```json
{
  "success": true,
  "category": {...},
  "data": [...events],
  "pagination": {...}
}
```

---

## Hosts API

### Get Host Profile
```
GET /api/hosts/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alex Runner",
    "avatar": "🏃",
    "bio": "Running enthusiast & community builder",
    "verified": true,
    "eventsHosted": 12,
    "rating": 4.8,
    "reviews": 34,
    "followers": 156,
    "following": [...],
    "hostRing": {...},
    "boostedVisibility": false,
    "joinedAt": "2026-01-15T...",
    "responseTime": "Quick",
    "cancellationRate": 0
  }
}
```

### Get Host Analytics
```
GET /api/hosts/:id/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hostId": 1,
    "hostName": "Alex Runner",
    "totalEvents": 12,
    "totalAttendees": 250,
    "totalRevenue": 3000,
    "averageRating": 4.8,
    "followers": 156,
    "verified": true,
    "responseTime": "Quick",
    "cancellationRate": 0,
    "events": [...]
  }
}
```

### Get Host Events
```
GET /api/hosts/:id/events?limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "host": {...},
  "data": [...events],
  "pagination": {...}
}
```

### Get Host Ratings
```
GET /api/hosts/:id/ratings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "host": {...},
    "hostRating": 4.8,
    "totalReviews": 34,
    "eventRatings": [...]
  }
}
```

### Update Host Profile
```
PUT /api/hosts/:id
```

**Request Body:**
```json
{
  "bio": "Updated bio",
  "avatar": "🎯",
  "responseTime": "Within 2 hours"
}
```

**Allowed Fields:** bio, avatar, responseTime

**Response:**
```json
{
  "success": true,
  "message": "Host profile updated successfully",
  "data": {...host}
}
```

### Follow Host
```
POST /api/hosts/:id/follow
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully followed host",
  "data": {
    "hostId": 1,
    "followers": 157
  }
}
```

### Unfollow Host
```
POST /api/hosts/:id/unfollow
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unfollowed host",
  "data": {
    "hostId": 1,
    "followers": 156
  }
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or missing required fields
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Installation & Setup

### Requirements
- Node.js 14+
- npm

### Installation
```bash
cd worldweave
npm install express cors
node server.js
```

### Starting the Server
```bash
npm start
# or
node server.js
```

The server will start on `http://localhost:3000`

---

## Database

### Current: In-Memory
The backend uses an in-memory database (`database.js`) that's initialized with sample data. All data is lost on server restart.

### Seed Data Includes
- **7 Categories**: Run Clubs, Night Clubs, Cafe Events, Standups, Workshops, Treks, House Parties
- **3 Hosts**: Alex Runner, DJ Nova, Coffee Connoisseur
- **9 Events**: Sample events across all categories

### Extending to Persistent Database

To use MongoDB, PostgreSQL, or another database:
1. Modify `config/database.js` to connect to your database
2. Replace in-memory methods with database queries
3. Update models if needed

---

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Role-based access control
- [ ] Payment integration (Stripe, PayPal)
- [ ] Real-time notifications (WebSockets)
- [ ] Image upload to cloud storage
- [ ] Advanced filtering and recommendations
- [ ] Event analytics dashboard
- [ ] Host verification system
- [ ] User reviews and reputation system
- [ ] Email notifications
- [ ] Mobile app API compatibility

---

## Support

For API questions or issues, please check the error responses and ensure all required fields are provided in POST/PUT requests.
