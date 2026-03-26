/**
 * Frontend-Backend Integration Examples
 * Examples of how to use the WorldWeave API from your frontend
 */

// ============================================
// API BASE URL
// ============================================
const API_BASE_URL = 'http://localhost:3000/api';

// ============================================
// UTILITY: API Request Function
// ============================================

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// EVENTS API INTEGRATION
// ============================================

// Get all events
async function getAllEvents(limit = 50, offset = 0, sort = 'newest') {
  return await apiRequest(`/events?limit=${limit}&offset=${offset}&sort=${sort}`);
}

// Get events by category
async function getEventsByCategory(category, limit = 50, offset = 0) {
  return await apiRequest(`/events/category/${category}?limit=${limit}&offset=${offset}`);
}

// Search events
async function searchEvents(query, limit = 50, offset = 0) {
  return await apiRequest(`/events/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
}

// Get single event
async function getEventById(eventId) {
  return await apiRequest(`/events/${eventId}`);
}

// Create event
async function createEvent(eventData) {
  return await apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
}

// Update event
async function updateEvent(eventId, updates) {
  return await apiRequest(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// Delete event
async function deleteEvent(eventId) {
  return await apiRequest(`/events/${eventId}`, {
    method: 'DELETE'
  });
}

// Book event
async function bookEvent(eventId, userId) {
  return await apiRequest(`/events/${eventId}/book`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// Cancel booking
async function cancelBooking(eventId, userId) {
  return await apiRequest(`/events/${eventId}/cancel-booking`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// Share event
async function shareEvent(eventId) {
  return await apiRequest(`/events/${eventId}/share`, {
    method: 'POST'
  });
}

// Get event ratings
async function getEventRatings(eventId) {
  return await apiRequest(`/events/${eventId}/ratings`);
}

// Add rating to event
async function addEventRating(eventId, userId, rating, review) {
  return await apiRequest(`/events/${eventId}/ratings`, {
    method: 'POST',
    body: JSON.stringify({ userId, rating, review })
  });
}

// Save event
async function saveEvent(eventId, userId) {
  return await apiRequest(`/events/${eventId}/save`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// Unsave event
async function unsaveEvent(eventId, userId) {
  return await apiRequest(`/events/${eventId}/unsave`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// ============================================
// CATEGORIES API INTEGRATION
// ============================================

// Get all categories
async function getAllCategories() {
  return await apiRequest('/categories');
}

// Get category by ID
async function getCategoryById(categoryId) {
  return await apiRequest(`/categories/${categoryId}`);
}

// Get category events
async function getCategoryEvents(categoryId, limit = 50, offset = 0, sort = 'newest') {
  return await apiRequest(`/categories/${categoryId}/events?limit=${limit}&offset=${offset}&sort=${sort}`);
}

// ============================================
// HOSTS API INTEGRATION
// ============================================

// Get host profile
async function getHostProfile(hostId) {
  return await apiRequest(`/hosts/${hostId}`);
}

// Get host analytics
async function getHostAnalytics(hostId) {
  return await apiRequest(`/hosts/${hostId}/analytics`);
}

// Get host events
async function getHostEvents(hostId, limit = 50, offset = 0) {
  return await apiRequest(`/hosts/${hostId}/events?limit=${limit}&offset=${offset}`);
}

// Get host ratings
async function getHostRatings(hostId) {
  return await apiRequest(`/hosts/${hostId}/ratings`);
}

// Update host profile
async function updateHostProfile(hostId, updates) {
  return await apiRequest(`/hosts/${hostId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// Follow host
async function followHost(hostId, userId) {
  return await apiRequest(`/hosts/${hostId}/follow`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// Unfollow host
async function unfollowHost(hostId, userId) {
  return await apiRequest(`/hosts/${hostId}/unfollow`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

// ============================================
// UTILITY ENDPOINTS
// ============================================

// Get health status
async function getHealthStatus() {
  return await apiRequest('/health');
}

// Get platform statistics
async function getPlatformStats() {
  return await apiRequest('/stats');
}

// Get bootstrap data
async function getBootstrapData() {
  return await apiRequest('/bootstrap');
}

// ============================================
// USAGE EXAMPLES IN COMPONENTS
// ============================================

// Example 1: Display all events on events page
async function loadEventsPage() {
  try {
    const response = await getAllEvents(20, 0, 'newest');
    const events = response.data;

    // Render events to DOM
    const container = document.getElementById('eventsContainer');
    container.innerHTML = events
      .map(event => `
        <div class="event-card">
          <h3>${event.title}</h3>
          <p>${event.location}</p>
          <span>${event.attendees}/${event.maxCapacity} attending</span>
          <button onclick="handleBookEvent(${event.id})">Book Now</button>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}

// Example 2: Search functionality
async function handleSearch(query) {
  try {
    const response = await searchEvents(query, 50, 0);
    const results = response.data;
    console.log(`Found ${results.length} events`, results);
    // Update UI with results
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 3: Book event
async function handleBookEvent(eventId) {
  try {
    const userId = getCurrentUserId(); // Get from localStorage/auth
    const response = await bookEvent(eventId, userId);

    if (response.success) {
      alert(`Successfully booked! You earned ${response.data.xpAwarded} XP`);
      // Update UI
    }
  } catch (error) {
    console.error('Booking failed:', error);
  }
}

// Example 4: Load category carousel
async function loadCategoryCarousel(categoryId) {
  try {
    const response = await getCategoryEvents(categoryId, 10, 0, 'newest');
    const events = response.data;

    // Create carousel with events
    const carousel = document.getElementById(`carousel-${categoryId}`);
    carousel.innerHTML = events
      .map(event => `
        <div class="carousel-card" onclick="openEventModal(${event.id})">
          <div class="card-emoji">${event.emoji}</div>
          <h4>${event.title}</h4>
          <p>${event.location}</p>
          <span class="xp">+${event.xp} XP</span>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error('Failed to load carousel:', error);
  }
}

// Example 5: Load host profile
async function loadHostProfile(hostId) {
  try {
    const hostResponse = await getHostProfile(hostId);
    const analyticsResponse = await getHostAnalytics(hostId);

    const host = hostResponse.data;
    const analytics = analyticsResponse.data;

    // Update profile section
    document.getElementById('hostName').textContent = host.name;
    document.getElementById('hostAvatar').textContent = host.avatar;
    document.getElementById('hostBio').textContent = host.bio;
    document.getElementById('eventsHosted').textContent = analytics.totalEvents;
    document.getElementById('totalAttendees').textContent = analytics.totalAttendees;
    document.getElementById('averageRating').textContent = analytics.averageRating;
  } catch (error) {
    console.error('Failed to load host profile:', error);
  }
}

// Example 6: Initialize page with bootstrap data
async function initializePageWithBackend() {
  try {
    const bootstrap = await getBootstrapData();

    // Store data globally or in state management
    window.appData = {
      events: bootstrap.data.events,
      categories: bootstrap.data.categories,
      hosts: bootstrap.data.hosts,
      stats: bootstrap.data.stats
    };

    console.log('App initialized with backend data', window.appData);
    // Trigger UI updates
    renderHomePage();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Example 7: Handle rating submission
async function submitEventRating(eventId, userId, rating, review) {
  try {
    const response = await addEventRating(eventId, userId, rating, review);

    if (response.success) {
      alert('Rating submitted successfully!');
      // Update UI with new rating
      const { newRating, totalReviews } = response.data;
      document.getElementById('eventRating').textContent = newRating.toFixed(1);
      document.getElementById('reviewCount').textContent = totalReviews;
    }
  } catch (error) {
    console.error('Failed to submit rating:', error);
  }
}

// Example 8: Handle filtering by category
async function filterByCategory(category) {
  try {
    const response = await getEventsByCategory(category, 50, 0);
    const events = response.data;

    // Update events display
    displayFilteredEvents(events);
  } catch (error) {
    console.error('Failed to filter events:', error);
  }
}

// ============================================
// REACT HOOKS EXAMPLES
// ============================================

/*
import { useState, useEffect } from 'react';

// Hook to fetch events
function useEvents(category = null) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = category 
          ? await getEventsByCategory(category)
          : await getAllEvents();
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category]);

  return { events, loading, error };
}

// Hook to fetch host profile
function useHostProfile(hostId) {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const response = await getHostProfile(hostId);
        setHost(response.data);
      } catch (error) {
        console.error('Failed to load host:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHost();
  }, [hostId]);

  return { host, loading };
}

// Component example
function EventsList({ category }) {
  const { events, loading, error } = useEvents(category);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="events-grid">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
*/

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentUserId() {
  // Get from localStorage, session, or auth context
  return localStorage.getItem('userId') || 'guest_' + Date.now();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function handleAPIError(error) {
  console.error('API Error:', error);
  // Show user-friendly error message
  alert('Something went wrong. Please try again.');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Events
    getAllEvents,
    getEventsByCategory,
    searchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    bookEvent,
    cancelBooking,
    shareEvent,
    getEventRatings,
    addEventRating,
    saveEvent,
    unsaveEvent,
    // Categories
    getAllCategories,
    getCategoryById,
    getCategoryEvents,
    // Hosts
    getHostProfile,
    getHostAnalytics,
    getHostEvents,
    getHostRatings,
    updateHostProfile,
    followHost,
    unfollowHost,
    // Utilities
    getHealthStatus,
    getPlatformStats,
    getBootstrapData
  };
}
