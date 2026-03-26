/* ============================================
   WORLDWEAVE - Event Platform JavaScript
   Core Game Logic & Event Management
   ============================================ */

// ============================================
// DATA STRUCTURES
// ============================================

const API_BASE_URL = window.location.origin;

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Host data
let HOSTS_DATA = {
    1: {
        id: 1,
        name: "Alex Runner",
        avatar: "🏃",
        bio: "Running enthusiast & community builder",
        eventsHosted: 12,
        rating: 4.8,
        reviews: 34,
        followers: 156,
        hostRing: { hosting: 45, engagement: 38, growth: 42 },
        verified: true
    },
    2: {
        id: 2,
        name: "DJ Nova",
        avatar: "🎧",
        bio: "Music curator & nightlife expert",
        eventsHosted: 28,
        rating: 4.9,
        reviews: 89,
        followers: 523,
        hostRing: { hosting: 92, engagement: 88, growth: 85 },
        verified: true,
        boostedVisibility: true
    },
    3: {
        id: 3,
        name: "Coffee Connoisseur",
        avatar: "☕",
        bio: "Coffee lover connecting bean enthusiasts",
        eventsHosted: 8,
        rating: 4.7,
        reviews: 19,
        followers: 89,
        hostRing: { hosting: 28, engagement: 25, growth: 31 },
        verified: false
    }
};

let EVENTS_DATABASE = [
    {
        id: 1,
        title: "Morning Run Club - Riverside Loop",
        category: "run",
        emoji: "🏃",
        date: "2026-03-28 06:30 AM",
        location: "Central Park, Downtown",
        attendees: 24,
        description: "Join us for an energetic morning run through scenic riverside paths. Perfect for beginners and experienced runners. We'll cover 5km at a moderate pace with a cool-down stretch.",
        xp: 15,
        color: "#FF6B6B",
        hostId: 1,
        price: 0,
        maxCapacity: 50,
        spotsRemaining: 26,
        rating: 4.8,
        reviews: 12,
        gallery: [],
        goingUsers: [
            { id: 101, name: "Sarah", avatar: "👩" },
            { id: 102, name: "Mike", avatar: "👨" },
            { id: 103, name: "Lisa", avatar: "👩" }
        ]
    },
    {
        id: 2,
        title: "Indie Dance Night at The Groove",
        category: "nightclub",
        emoji: "🎉",
        date: "2026-03-30 10:00 PM",
        location: "The Groove Club, Arts District",
        attendees: 342,
        description: "Experience cutting-edge indie and electronic music. Top local DJs spinning until 4 AM. Come solo or bring friends—everyone's welcome!",
        xp: 25,
        color: "#A78BFA"
    },
    {
        id: 3,
        title: "Specialty Coffee Tasting",
        category: "cafe",
        emoji: "☕",
        date: "2026-03-29 04:00 PM",
        location: "Bean Theory Café, Midtown",
        attendees: 18,
        description: "Discover single-origin coffees from around the world. Expert barista will guide you through flavor profiles and brewing techniques.",
        xp: 10,
        color: "#D4A574"
    },
    {
        id: 4,
        title: "Stand-Up Comedy Night - Raw & Unfiltered",
        category: "comedy",
        emoji: "🎭",
        date: "2026-03-31 08:00 PM",
        location: "The Comedy Vault, Downtown",
        attendees: 156,
        description: "Fresh local comedians bringing their best material. Intimate venue, hilarious performances. Arrive early for good seats!",
        xp: 20,
        color: "#FCD34D"
    },
    {
        id: 5,
        title: "Web Development & Design Workshop",
        category: "workshop",
        emoji: "🛠️",
        date: "2026-04-02 02:00 PM",
        location: "Tech Hub Campus, Innovation District",
        attendees: 45,
        description: "Build modern responsive websites from scratch. Learn HTML, CSS, and JavaScript fundamentals. Hands-on coding sessions included.",
        xp: 30,
        color: "#60A5FA"
    },
    {
        id: 6,
        title: "Mountain Trek to Crystal Peak",
        category: "trek",
        emoji: "⛰️",
        date: "2026-04-05 08:00 AM",
        location: "Trailhead at Mt. Vista, 1hr from city",
        attendees: 32,
        description: "Challenging 8-mile trek with stunning summit views. Moderate difficulty, full day experience. Bring water and snacks. Group size capped at 30.",
        xp: 50,
        color: "#34D399"
    },
    {
        id: 7,
        title: "Rooftop House Party - Spring Vibes",
        category: "party",
        emoji: "🎊",
        date: "2026-04-06 09:00 PM",
        location: "Central Tower Rooftop, Downtown",
        attendees: 89,
        description: "Exclusive rooftop gathering with live DJ, craft cocktails, and panoramic city views. RSVP required. Limited capacity.",
        xp: 35,
        color: "#EC4899"
    },
    {
        id: 8,
        title: "Book Club Meetup - Sci-Fi Edition",
        category: "workshop",
        emoji: "📚",
        date: "2026-04-08 06:30 PM",
        location: "The Reader's Corner, Booktown",
        attendees: 12,
        description: "Discuss this month's sci-fi selection. Open to all reading levels. New members always welcome!",
        xp: 12,
        color: "#8B5CF6"
    },
    {
        id: 9,
        title: "Trail Running - Sunset Canyon",
        category: "run",
        emoji: "🏃",
        date: "2026-04-09 05:30 PM",
        location: "Canyon Trail Entrance, Nature Reserve",
        attendees: 19,
        description: "Scenic evening trail run with stunning sunset views. 6km intermediate level. Trail shoes recommended.",
        xp: 20,
        color: "#FF8C42"
    },
    {
        id: 10,
        title: "Jazz Night - Live Performances",
        category: "nightclub",
        emoji: "🎉",
        date: "2026-04-10 09:00 PM",
        location: "Blue Note Lounge, Arts District",
        attendees: 78,
        description: "World-class jazz performances in an intimate setting. Craft cocktails and gourmet appetizers available.",
        xp: 22,
        color: "#4F46E5"
    },
    {
        id: 11,
        title: "Yoga Flow & Meditation",
        category: "workshop",
        emoji: "🧘",
        date: "2026-04-12 07:00 AM",
        location: "Zen Studio, Wellness District",
        attendees: 28,
        description: "Begin your day with guided yoga and meditation. All levels welcome. Mats provided.",
        xp: 8,
        color: "#06B6D4"
    },
    {
        id: 12,
        title: "Late Night Comedy Showcase",
        category: "comedy",
        emoji: "🎭",
        date: "2026-04-14 11:00 PM",
        location: "The Comedy Vault, Downtown",
        attendees: 203,
        description: "Extended comedy show with special guest performers. Limited seating. First come, first served.",
        xp: 25,
        color: "#FBBF24"
    }
];

// ============================================
// VIBE MATCHING SYSTEM
// ============================================

const VIBE_PREFERENCES = {
    energetic: { name: "⚡ Energetic", keywords: ['nightclub', 'run', 'party', 'trek'] },
    chill: { name: "😎 Chill", keywords: ['cafe', 'workshop', 'comedy'] },
    social: { name: "🤝 Social", keywords: ['nightclub', 'party', 'run', 'workshop'] },
    adventurous: { name: "🗺️ Adventurous", keywords: ['trek', 'run', 'party'] },
    creative: { name: "🎨 Creative", keywords: ['workshop', 'comedy', 'cafe'] },
    learning: { name: "📚 Learning", keywords: ['workshop', 'comedy', 'cafe'] }
};

const BUDGET_MULTIPLIERS = {
    free: { min: 0, max: 0 },
    budget: { min: 0, max: 25 },
    moderate: { min: 25, max: 75 },
    premium: { min: 75, max: 999 }
};

const CROWD_TYPES = {
    solo: { name: 'Solo', size: 'any' },
    couples: { name: 'Couples', size: 'small' },
    groupfriends: { name: 'Group/Friends', size: 'large' },
    meetups: { name: 'Meetups', size: 'medium' }
};

// Real-time events (next 2 hours)
const REALTIME_EVENTS = EVENTS_DATABASE.slice(0, 6).map((event, idx) => ({
    ...event,
    minutesUntilStart: 15 + (idx * 25),
    slotsRemaining: Math.max(5, Math.floor(Math.random() * 20))
}));

const CATEGORIES = {
    run: { name: "Run Clubs", emoji: "🏃", color: "#c5a059" },
    nightclub: { name: "Night Clubs", emoji: "🎉", color: "#c5a059" },
    cafe: { name: "Cafe Events", emoji: "☕", color: "#c5a059" },
    comedy: { name: "Standups", emoji: "🎭", color: "#c5a059" },
    workshop: { name: "Workshops", emoji: "🛠️", color: "#c5a059" },
    trek: { name: "Treks", emoji: "⛰️", color: "#c5a059" },
    party: { name: "House Parties", emoji: "🎊", color: "#c5a059" }
};

const PERKS = [
    {
        id: 1,
        name: "Early Bird",
        emoji: "🌅",
        description: "Early access to new events",
        unlockedAtLevel: 1
    },
    {
        id: 2,
        name: "Social Butterfly",
        emoji: "🦋",
        description: "Double XP from shared events",
        unlockedAtLevel: 5
    },
    {
        id: 3,
        name: "Explorer",
        emoji: "🗺️",
        description: "Unlock exclusive discovery events",
        unlockedAtLevel: 10
    },
    {
        id: 4,
        name: "Event Master",
        emoji: "👑",
        description: "Host your own events",
        unlockedAtLevel: 20
    },
    {
        id: 5,
        name: "VIP Pass",
        emoji: "🎫",
        description: "Free entry to premium events",
        unlockedAtLevel: 30
    }
];

const ACHIEVEMENTS = [
    {
        id: 1,
        name: "First Step",
        emoji: "🚀",
        description: "Attend your first event",
        condition: (user) => user.eventsAttended >= 1
    },
    {
        id: 2,
        name: "Event Junkie",
        emoji: "🔥",
        description: "Attend 10 events",
        condition: (user) => user.eventsAttended >= 10
    },
    {
        id: 3,
        name: "Category Explorer",
        emoji: "🌟",
        description: "Attend events from 5 different categories",
        condition: (user) => user.categoriesExplored >= 5
    },
    {
        id: 4,
        name: "Sharing is Caring",
        emoji: "💝",
        description: "Share 5 events with friends",
        condition: (user) => user.eventsShared >= 5
    },
    {
        id: 5,
        name: "Level 50 Legend",
        emoji: "💎",
        description: "Reach level 50",
        condition: (user) => user.level >= 50
    }
];

// ============================================
// SOCIAL & GROUP FEATURES SYSTEM
// ============================================

const HOST_RING_TIERS = {
    bronze: { min: 0, max: 40, name: '🥉 Bronze' },
    silver: { min: 41, max: 70, name: '🥈 Silver' },
    gold: { min: 71, max: 100, name: '🥇 Gold' }
};

const HOST_PERKS_MAP = {
    bronze: ['Event listing badge', '1 event slot'],
    silver: ['Boosted visibility', 'Featured placement', '10% fee reduction', '5 event slots'],
    gold: ['Maximum visibility', 'Priority support', '20% fee reduction', 'Unlimited events', 'Early feature access']
};

const NOTIFICATION_TYPES = {
    EVENT_ALERT: 'event_alert',
    LIMITED_SLOTS: 'limited_slots',
    FRIEND_ATTENDING: 'friend_attending',
    STREAK_REMINDER: 'streak_reminder',
    HOST_UPDATE: 'host_update',
    HOST_EARNED: 'host_earned',
    COMMENT_REPLY: 'comment_reply'
};

// ============================================
// RING-BASED XP AND GAMIFICATION SYSTEM
// ============================================

const RING_SYSTEM = {
    ACTIVITY: {
        name: 'Activity',
        goal: 500,
        colorStart: '#d4af37', // Gold
        colorEnd: '#1a1a1a',
        icon: '🎯',
        description: 'Events attended and completed'
    },
    SOCIAL: {
        name: 'Social',
        goal: 300,
        colorStart: '#c5a059', // Champagne
        colorEnd: '#2a2a2a',
        icon: '👥',
        description: 'Likes, comments, and follows'
    },
    EXPLORER: {
        name: 'Explorer',
        goal: 400,
        colorStart: '#8fb8d8', // Slate
        colorEnd: '#0f1c2d',
        icon: '🌍',
        description: 'New categories explored'
    }
};

const BADGES_DATABASE = [
    {
        id: 'first_event',
        name: 'First Timer',
        emoji: '🎫',
        description: 'Attend your first event',
        condition: (user) => user.eventsAttended >= 1
    },
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        emoji: '🦋',
        description: 'Follow 10 people',
        condition: (user) => user.following.size >= 10
    },
    {
        id: 'ring_master',
        name: 'Ring Master',
        emoji: '🏆',
        description: 'Complete all 3 rings',
        condition: (user) => user.rings.activity.current >= user.rings.activity.goal && 
                            user.rings.social.current >= user.rings.social.goal &&
                            user.rings.explorer.current >= user.rings.explorer.goal
    },
    {
        id: 'streak_king',
        name: 'Streak King',
        emoji: '🔥',
        description: 'Maintain 7-day event streak',
        condition: (user) => user.currentStreak >= 7
    },
    {
        id: 'category_master',
        name: 'Category Master',
        emoji: '🎨',
        description: 'Attend events in all 8 categories',
        condition: (user) => user.categoriesExplored.size >= 8
    },
    {
        id: 'top_collaborator',
        name: 'Top Collaborator',
        emoji: '⭐',
        description: 'Participate in 5 group events',
        condition: (user) => user.groupEventsParticipated >= 5
    }
];

const CHALLENGES_DATABASE = [
    {
        id: 'weekly_warrior',
        name: 'Weekly Warrior',
        description: 'Attend 3 events this week',
        type: 'weekly',
        goal: 3,
        category: 'attendance',
        reward: 100,
        icon: '⚔️'
    },
    {
        id: 'social_surge',
        name: 'Social Surge',
        description: 'Get 20 likes on your posts',
        type: 'weekly',
        goal: 20,
        category: 'engagement',
        reward: 75,
        icon: '❤️'
    },
    {
        id: 'explorer_quest',
        name: 'Explorer Quest',
        description: 'Try 3 new categories',
        type: 'weekly',
        goal: 3,
        category: 'exploration',
        reward: 80,
        icon: '🗺️'
    },
    {
        id: 'seasonal_summit',
        name: 'Seasonal Summit',
        description: 'Reach 1000 XP this season',
        type: 'seasonal',
        goal: 1000,
        category: 'xp',
        reward: 250,
        icon: '🏔️'
    }
];

const LEADERBOARD_TIERS = [
    { min: 0, max: 999, name: 'Bronze', emoji: '🥉', color: '#cd7f32' },
    { min: 1000, max: 4999, name: 'Silver', emoji: '🥈', color: '#c0c0c0' },
    { min: 5000, max: 9999, name: 'Gold', emoji: '🥇', color: '#ffd700' },
    { min: 10000, max: Infinity, name: 'Platinum', emoji: '💎', color: '#e5e4e2' }
];

const SEASONAL_CAMPAIGNS = {
    current: 'spring_vibes',
    campaigns: {
        spring_vibes: {
            name: '🌸 Spring Vibes',
            startDate: '2026-03-20',
            endDate: '2026-06-20',
            description: 'Outdoor activities and renewal theme',
            rewards: ['🌸 Bloom Badge', '2x XP multiplier on outdoor events'],
            activeCategories: ['outdoor', 'sports', 'social']
        },
        summer_adventure: {
            name: '☀️ Summer Adventure',
            startDate: '2026-06-21',
            endDate: '2026-09-22',
            description: 'Travel and exploration focus',
            rewards: ['✈️ Adventurer Badge', '2x XP multiplier on events 25+ miles away'],
            activeCategories: ['travel', 'adventure', 'outdoor']
        }
    }
};

const SOCIAL_FEATURES = {
    follows: new Set(),
    followers: new Map(),
    activityFeed: [],
    groupVotes: {},
    splitPayments: {},
    notifications: [],
    hostEngagement: {},
    gallery: {},
    streakDays: 0,
    lastEventDate: null
};

// ============================================
// PAYMENT & SPLIT BILLING SYSTEM (Razorpay)
// ============================================

const PAYMENT_CONFIG = {
    HOST_COMMISSION: 0.90,        // 90% to host
    PLATFORM_COMMISSION: 0.10,    // 10% to platform
    GST_RATE: 0.18,               // 18% GST (India)
    GST_ON_COMMISSION: true,      // GST only on platform commission
    RAZORPAY_KEY: 'YOUR_RAZORPAY_KEY', // Replace with actual key
    RAZORPAY_SECRET: 'YOUR_RAZORPAY_SECRET'
};

function calculateSplitPayment(totalAmount, hostTier = 'bronze') {
    // Commission reduces based on host tier
    const platformRate = hostTier === 'gold' ? 0.05 : (hostTier === 'silver' ? 0.08 : 0.10);
    const hostRate = 1 - platformRate;
    
    const platformCommission = totalAmount * platformRate;
    const gst = PAYMENT_CONFIG.GST_ON_COMMISSION ? platformCommission * PAYMENT_CONFIG.GST_RATE : 0;
    const hostAmount = totalAmount * hostRate;
    
    return {
        totalAmount: totalAmount,
        hostAmount: parseFloat(hostAmount.toFixed(2)),
        platformCommission: parseFloat(platformCommission.toFixed(2)),
        gst: parseFloat(gst.toFixed(2)),
        totalPlatformRevenue: parseFloat((platformCommission + gst).toFixed(2))
    };
}

async function initiateRazorpayPayment(eventId, amount) {
    const event = EVENTS_DATABASE.find(e => e.id === eventId);
    const split = calculateSplitPayment(amount, getHostTier(event.hostId));
    
    console.log(`[Razorpay] Initiating split payment: Host gets $${split.hostAmount}, Platform gets $${split.platformCommission} + $${split.gst} GST`);
    
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => resolve(`razorpay_pay_${Math.random().toString(36).substr(2, 9)}`), 1000);
    });
}

// Payment transactions store
const PAYMENT_TRANSACTIONS = {};

function createPaymentTransaction(eventId, amount, attendeeId, hostId) {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const split = calculateSplitPayment(amount);
    
    PAYMENT_TRANSACTIONS[transactionId] = {
        id: transactionId,
        eventId: eventId,
        attendeeId: attendeeId,
        hostId: hostId,
        amount: amount,
        split: split,
        status: 'pending',
        razorpayId: null,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    return transactionId;
}

function processPayment(transactionId, razorpayPaymentId) {
    if (!PAYMENT_TRANSACTIONS[transactionId]) return false;
    
    const txn = PAYMENT_TRANSACTIONS[transactionId];
    txn.razorpayId = razorpayPaymentId;
    txn.status = 'completed';
    txn.completedAt = new Date().toISOString();
    
    // Update host payout pending
    updateHostPayoutPending(txn.hostId, txn.split.hostAmount);
    
    return true;
}

// ============================================
// HOST PORTAL & ANALYTICS
// ============================================

const HOST_PORTAL_STATE = {
    eventDrafts: {},
    publishedEvents: {},
    analytics: {},
    payoutTracking: {},
    aiDescriptions: {}
};

const AI_EVENT_TEMPLATES = {
    sports: "Get your adrenaline pumping at our exclusive {category} event! Join {attendees}+ sports enthusiasts for an unforgettable experience. Limited spots available - book now! 🏃‍♂️",
    music: "🎵 Vibe with us at {title}! Experience live {category} vibes with {attendees}+ music lovers. Limited capacity. Grab your spot before it fills up! ✨",
    networking: "🤝 Network with {attendees}+ professionals at our {category} event. Expand your circle and make meaningful connections. Reserve your seat today!",
    wellness: "🧘 Join our wellness community for an incredible {category} session. Perfect for beginners & experts. {attendees}+ participants. Book your wellness journey! 💆",
    food: "🍽️ Culinary adventure awaits! Experience {category} with {attendees}+ food enthusiasts. Limited tables - secure yours now! 👨‍🍳",
    travel: "✈️ Explore {title} with {attendees}+ adventurers! Unforgettable {category} experiences. Early bird discounts available! 🌍",
    default: "Join us at {title}! {attendees}+ people are already interested. Experience {category} like never before. Book your spot now! 🎉"
};

function generateAIDescription(event) {
    const template = AI_EVENT_TEMPLATES[event.category] || AI_EVENT_TEMPLATES.default;
    return template
        .replace('{title}', event.title)
        .replace('{category}', CATEGORIES[event.category]?.name || 'amazing')
        .replace('{attendees}', Math.floor(Math.random() * 100) + 50);
}

function createHostEvent(data) {
    const eventId = `event_${Date.now()}`;
    const description = data.description || generateAIDescription(data);
    
    HOST_PORTAL_STATE.eventDrafts[eventId] = {
        id: eventId,
        title: data.title,
        category: data.category,
        date: data.date,
        time: data.time,
        location: data.location,
        description: description,
        price: data.price || 0,
        maxCapacity: data.maxCapacity || 100,
        hostId: data.hostId,
        status: 'draft',
        createdAt: new Date().toISOString(),
        publishedAt: null
    };
    
    return eventId;
}

function publishHostEvent(eventId) {
    const draft = HOST_PORTAL_STATE.eventDrafts[eventId];
    if (!draft) return false;
    
    draft.status = 'published';
    draft.publishedAt = new Date().toISOString();
    HOST_PORTAL_STATE.publishedEvents[eventId] = draft;
    
    // Initialize analytics
    HOST_PORTAL_STATE.analytics[eventId] = {
        views: 0,
        bookings: 0,
        revenue: 0,
        attendees: [],
        ratings: []
    };
    
    return true;
}

function updateHostAnalytics(eventId, metric, value = 1) {
    if (!HOST_PORTAL_STATE.analytics[eventId]) return;
    
    const analytics = HOST_PORTAL_STATE.analytics[eventId];
    
    switch(metric) {
        case 'view':
            analytics.views += value;
            break;
        case 'booking':
            analytics.bookings += value;
            break;
        case 'revenue':
            analytics.revenue += value;
            break;
        case 'attendee':
            analytics.attendees.push(value);
            break;
    }
}

function updateHostPayoutPending(hostId, amount) {
    if (!HOST_PORTAL_STATE.payoutTracking[hostId]) {
        HOST_PORTAL_STATE.payoutTracking[hostId] = {
            hostId: hostId,
            pending: 0,
            processed: 0,
            totalEarned: 0,
            payoutHistory: []
        };
    }
    
    const payout = HOST_PORTAL_STATE.payoutTracking[hostId];
    payout.pending += amount;
    payout.totalEarned += amount;
}

function processHostPayout(hostId, bankDetails) {
    const payout = HOST_PORTAL_STATE.payoutTracking[hostId];
    if (!payout || payout.pending <= 0) return false;
    
    const payoutId = `payout_${Date.now()}`;
    payout.payoutHistory.push({
        id: payoutId,
        amount: payout.pending,
        status: 'processed',
        processedAt: new Date().toISOString(),
        bankDetails: bankDetails
    });
    
    payout.processed += payout.pending;
    payout.pending = 0;
    
    return payoutId;
}

async function handleAIEventCreation() {
    const title = document.getElementById('hostEventTitle').value;
    const category = document.getElementById('hostEventCategory').value;
    
    if (!title) return showToast('Please enter a title', 'error');

    try {
        await apiRequest('/api/host/events', {
            method: 'POST',
            body: JSON.stringify({
                title,
                category,
                hostId: 1,
                price: 15
            })
        });

        await loadBackendData();
        showToast('✨ AI generated description and published event!', 'success');
        playMicroSound('success');
        triggerConfetti();
        renderEvents();
        renderPersonalizedFeed();
        document.getElementById('hostEventTitle').value = '';
    } catch (error) {
        showToast(error.message || 'Unable to publish event', 'error');
    }
}

// ============================================
// MEMORY TIMELINE (Life Journey Tracker)
// ============================================

const MEMORY_TIMELINE = {
    events: [],
    achievements: [],
    photos: [],
    friendships: []
};

function addMemory(type, data) {
    const memory = {
        id: `mem_${Date.now()}`,
        type: type, // 'event', 'achievement', 'photo', 'friendship'
        data: data,
        timestamp: new Date().toISOString(),
        liked: false,
        likes: 0
    };
    
    const category = type === 'event' ? 'events' : type === 'achievement' ? 'achievements' : type === 'photo' ? 'photos' : 'friendships';
    MEMORY_TIMELINE[category].push(memory);
    renderMemoryTimeline();
    
    return memory;
}

function renderMemoryTimeline() {
    const container = document.getElementById('memoryTimeline');
    if (!container) return;
    
    const all = [
        ...MEMORY_TIMELINE.events.map(m => ({ ...m, icon: '📍' })),
        ...MEMORY_TIMELINE.achievements.map(m => ({ ...m, icon: '🏆' })),
        ...MEMORY_TIMELINE.photos.map(m => ({ ...m, icon: '📸' }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = all.map(m => `
        <div class="timeline-item glass">
            <div class="timeline-icon">${m.icon}</div>
            <div class="timeline-content">
                <div class="timeline-date">${new Date(m.timestamp).toLocaleDateString()}</div>
                <div class="timeline-title">${m.data.title || m.data.name}</div>
                <p>${m.data.description || ''}</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// GAME MECHANICS
// ============================================

const PROGRESSION = {
    BASE_XP_FOR_LEVEL: 100,
    XP_MULTIPLIER: 1.2,
    LEVELS: 100
};

function getXPForLevel(level) {
    const baseXP = PROGRESSION.BASE_XP_FOR_LEVEL;
    const multiplier = PROGRESSION.XP_MULTIPLIER;
    return Math.floor(baseXP * Math.pow(multiplier, level - 1));
}

function getTotalXPForLevel(level) {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += getXPForLevel(i);
    }
    return total;
}

function calculateLevel(totalXP) {
    let level = 1;
    while (level < PROGRESSION.LEVELS && getTotalXPForLevel(level + 1) <= totalXP) {
        level++;
    }
    return level;
}

function getProgressToNextLevel(totalXP) {
    const currentLevel = calculateLevel(totalXP);
    const currentLevelXP = getTotalXPForLevel(currentLevel);
    const nextLevelXP = getTotalXPForLevel(currentLevel + 1);
    const xpIntoLevel = totalXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    return {
        current: xpIntoLevel,
        needed: xpNeeded,
        percentage: (xpIntoLevel / xpNeeded) * 100
    };
}

// ============================================
// USER STATE MANAGEMENT
// ============================================

let userState = {
    name: "Explorer",
    totalXP: 0,
    level: 1,
    eventsAttended: 0,
    eventsBooked: [],
    eventsShared: 0,
    categoriesExplored: new Set(),
    unlockedPerks: [1],
    unlockedAchievements: [],
    // Vibe preferences
    vibe: null,
    budget: null,
    crowd: null,
    vibeScore: 0,
    // Behavior tracking for recommendations
    categoryInteractions: {},
    eventViews: new Set(),
    sharedEvents: new Set(),
    bookingTime: {},
    // Social features
    following: new Set(),
    followers: new Set(),
    streakDays: 0,
    lastEventDate: null,
    // Host features
    isHost: false,
    hostedEvents: [],
    hostRing: { hosting: 0, engagement: 0, growth: 0 },
    hostTier: 'bronze',
    // Gallery
    galleryPosts: [],
    galleryPostCount: 0,
    // Split payments
    splitPaymentGroups: {},
    // Ring System
    rings: {
        activity: { current: 0, goal: 500, progress: 0 },
        social: { current: 0, goal: 300, progress: 0 },
        explorer: { current: 0, goal: 400, progress: 0 }
    },
    // Gamification
    unlockedBadges: [],
    completedChallenges: [],
    currentChallenges: [],
    currentStreak: 0,
    bestStreak: 0,
    lastActivityDate: null,
    seasonalXP: 0,
    leaderboardTier: 'bronze',
    leaderboardRank: 0,
    groupEventsParticipated: 0,
    totalLikesReceived: 0,
    postCount: 0
};

// Load user state from localStorage
function loadUserState() {
    const saved = localStorage.getItem('worldweave_user');
    if (saved) {
        const loaded = JSON.parse(saved);
        userState = {
            ...userState,
            ...loaded,
            categoriesExplored: new Set(loaded.categoriesExplored || []),
            eventViews: new Set(loaded.eventViews || []),
            sharedEvents: new Set(loaded.sharedEvents || []),
            following: new Set(loaded.following || []),
            followers: new Set(loaded.followers || [])
        };
    }

    // Check if first time user
    if (!userState.vibe) {
        showSignupModal();
    }
}

// Save user state to localStorage
function saveUserState() {
    const toSave = {
        ...userState,
        categoriesExplored: Array.from(userState.categoriesExplored),
        eventViews: Array.from(userState.eventViews),
        sharedEvents: Array.from(userState.sharedEvents),
        following: Array.from(userState.following),
        followers: Array.from(userState.followers)
    };
    localStorage.setItem('worldweave_user', JSON.stringify(toSave));
}

// ============================================
// VIBE MATCHING ALGORITHM
// ============================================

function calculateVibeMatch(event) {
    if (!userState.vibe) return 0;

    let score = 0;
    const maxScore = 100;

    // Category matching based on vibe
    const vibeKeywords = VIBE_PREFERENCES[userState.vibe]?.keywords || [];
    if (vibeKeywords.includes(event.category)) {
        score += 30;
    }

    // Budget matching
    const estimatedCost = Math.floor(Math.random() * 100);
    const budget = BUDGET_MULTIPLIERS[userState.budget] || { min: 0, max: 999 };
    if (estimatedCost >= budget.min && estimatedCost <= budget.max) {
        score += 20;
    }

    // Crowd size matching
    const crowdSizes = {
        solo: event.attendees < 50,
        couples: event.attendees < 100,
        groupfriends: event.attendees > 50 && event.attendees < 300,
        meetups: event.attendees > 30
    };
    if (crowdSizes[userState.crowd]) {
        score += 20;
    }

    // Behavior-based adaptation
    if (userState.categoryInteractions[event.category]) {
        score += userState.categoryInteractions[event.category] * 10;
    }

    // Avoid showing already viewed events
    if (userState.eventViews.has(event.id)) {
        score -= 30;
    }

    return Math.max(0, Math.min(maxScore, score));
}

function getPersonalizedRecommendations(count = 6) {
    return EVENTS_DATABASE
        .map(event => ({
            ...event,
            vibeScore: calculateVibeMatch(event)
        }))
        .sort((a, b) => b.vibeScore - a.vibeScore)
        .slice(0, count);
}

function trackCategoryInteraction(category) {
    userState.categoryInteractions[category] = (userState.categoryInteractions[category] || 0) + 1;
}

// ============================================
// SOCIAL FEATURES
// ============================================

function followUser(userId) {
    if (!userState.following.has(userId)) {
        userState.following.add(userId);
        addActivity(`started following user ${userId}`);
        showToast('✓ Following!', 'success');
        saveUserState();
    }
}

function unfollowUser(userId) {
    if (userState.following.has(userId)) {
        userState.following.delete(userId);
        showToast('Unfollowed', 'info');
        saveUserState();
    }
}

function getActivityFeed() {
    return SOCIAL_FEATURES.activityFeed.slice(-20).reverse();
}

function addActivity(action, description = '', eventId = null) {
    SOCIAL_FEATURES.activityFeed.push({
        user: userState.name,
        userName: userState.name,
        userAvatar: '👤',
        action: action,
        description: description,
        eventId: eventId,
        timestamp: new Date().toISOString()
    });
}

// Social interaction helper functions

function likePost(postId) {
    userState.totalLikesReceived++;
    awardSocialXP('like');
    checkBadgeConditions();
    checkChallengeProgress();
    saveUserState();
}

function addComment(postId, comment) {
    userState.postCount++;
    const xp = userState.postCount === 1 ? 10 : 5;
    awardSocialXP(userState.postCount === 1 ? 'first_post' : 'comment');
    checkBadgeConditions();
    checkChallengeProgress();
    saveUserState();
}

function featurePost(postId, hostId) {
    // Award XP to post creator for being featured by host
    awardBonusXP('Post featured by host', 5);
    checkBadgeConditions();
    saveUserState();
}

// ============================================
// HOST RING SYSTEM
// ============================================

function getHostTier(hostId) {
    if (!HOSTS_DATA[hostId]) return 'bronze';
    const ring = HOSTS_DATA[hostId].hostRing;
    const avgScore = (ring.hosting + ring.engagement + ring.growth) / 3;
    
    if (avgScore >= 71) return 'gold';
    if (avgScore >= 41) return 'silver';
    return 'bronze';
}

function getHostPerks(hostId) {
    const tier = getHostTier(hostId);
    return HOST_PERKS_MAP[tier] || [];
}

function updateHostMetrics(hostId, action) {
    if (!HOSTS_DATA[hostId]) return;
    const host = HOSTS_DATA[hostId];
    
    switch(action) {
        case 'event_hosted':
            host.hostRing.hosting = Math.min(100, host.hostRing.hosting + 5);
            break;
        case 'high_engagement':
            host.hostRing.engagement = Math.min(100, host.hostRing.engagement + 3);
            break;
        case 'growth':
            host.hostRing.growth = Math.min(100, host.hostRing.growth + 2);
            break;
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function addNotification(type, title, message, actionUrl = null) {
    const notification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        timestamp: new Date(),
        read: false,
        actionUrl: actionUrl
    };
    SOCIAL_FEATURES.notifications.push(notification);
    return notification;
}

function checkLimitedSlots(event) {
    if (event.spotsRemaining < 10 && !userState.eventsBooked.includes(event.id)) {
        addNotification(
            NOTIFICATION_TYPES.LIMITED_SLOTS,
            `${event.title} Running Out!`,
            `Only ${event.spotsRemaining} spots left!`,
            `/event/${event.id}`
        );
        showToast(`⚠️ Limited slots: ${event.spotsRemaining} remaining!`, 'error');
    }
}

function checkStreakReminder() {
    const today = new Date().toDateString();
    if (userState.lastEventDate !== today && userState.eventsAttended > 0) {
        addNotification(
            NOTIFICATION_TYPES.STREAK_REMINDER,
            'Keep Your Streak!',
            `You have a ${userState.streakDays} day streak. Book an event today!`
        );
    }
}

function getUnreadNotifications() {
    return SOCIAL_FEATURES.notifications.filter(n => !n.read).length;
}

// ============================================
// SPLIT PAYMENTS
// ============================================

function createSplitPayment(eventId, participants, totalCost) {
    const splitId = `split_${Date.now()}`;
    const costPerPerson = totalCost / participants.length;
    
    SOCIAL_FEATURES.splitPayments[splitId] = {
        eventId: eventId,
        participants: participants,
        totalCost: totalCost,
        costPerPerson: costPerPerson,
        paid: new Set(),
        createdAt: new Date()
    };
    
    return {
        splitId: splitId,
        costPerPerson: costPerPerson.toFixed(2)
    };
}

function settleSplitPayment(splitId, userId) {
    if (SOCIAL_FEATURES.splitPayments[splitId]) {
        SOCIAL_FEATURES.splitPayments[splitId].paid.add(userId);
        return true;
    }
    return false;
}

// ============================================
// EVENT GALLERY
// ============================================

function addGalleryPost(eventId, imageUrl, caption = '') {
    if (userState.galleryPostCount >= 5) {
        showToast('Gallery limit reached (5 posts per event)', 'error');
        return false;
    }
    
    if (!EVENTS_DATABASE.find(e => e.id === eventId)) return false;
    
    const post = {
        id: `post_${Date.now()}`,
        eventId: eventId,
        userId: userState.name,
        imageUrl: imageUrl,
        caption: caption,
        likes: 0,
        timestamp: new Date(),
        approved: false
    };
    
    if (!SOCIAL_FEATURES.gallery[eventId]) {
        SOCIAL_FEATURES.gallery[eventId] = [];
    }
    
    SOCIAL_FEATURES.gallery[eventId].push(post);
    userState.galleryPostCount++;
    return true;
}

function getEventGallery(eventId) {
    return (SOCIAL_FEATURES.gallery[eventId] || []).filter(p => p.approved);
}

// ============================================
// GROUP VOTING
// ============================================

function createGroupVote(eventId, options) {
    const voteId = `vote_${Date.now()}`;
    SOCIAL_FEATURES.groupVotes[voteId] = {
        eventId: eventId,
        options: options.map(o => ({ text: o, votes: 0 })),
        voters: new Set(),
        createdAt: new Date()
    };
    return voteId;
}

function castVote(voteId, optionIndex) {
    const vote = SOCIAL_FEATURES.groupVotes[voteId];
    if (vote && !vote.voters.has(userState.name)) {
        vote.options[optionIndex].votes++;
        vote.voters.add(userState.name);
        return true;
    }
    return false;
}

// ============================================
// UI STATE MANAGEMENT
// ============================================

let uiState = {
    currentSection: 'discover',
    selectedCategory: 'all',
    searchQuery: '',
    selectedEvent: null,
    filteredEvents: EVENTS_DATABASE
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    // Navigation
    menuToggle: document.getElementById('menuToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    levelBadge: document.getElementById('levelBadge'),
    xpDisplay: document.getElementById('xpDisplay'),

    // Signup Modal
    signupModal: document.getElementById('signupModal'),
    signupForm: document.getElementById('signupForm'),
    moodBtns: document.querySelectorAll('.mood-btn'),
    budgetBtns: document.querySelectorAll('.budget-btn'),
    crowdBtns: document.querySelectorAll('.crowd-btn'),

    // Vibe & Real-time
    vibeSection: document.getElementById('vibeSection'),
    personalizedFeed: document.getElementById('personalizedFeed'),
    refreshVibeBtn: document.getElementById('refreshVibeBtn'),
    realtimeSection: document.getElementById('realtimeSection'),
    realtimeScroll: document.getElementById('realtimeScroll'),
    reelsFeed: document.getElementById('reelsFeed'),
    reelsCarousel: document.getElementById('reelsCarousel'),

    // Hero & Filter
    discoverBtn: document.getElementById('discoverBtn'),
    searchInput: document.getElementById('searchInput'),
    filterChips: document.querySelectorAll('.chip'),
    filterSection: document.getElementById('filterSection'),

    // Events Grid
    eventsGrid: document.getElementById('eventsGrid'),
    discoveryFeed: document.getElementById('discoveryFeed'),

    // Profile Section
    profileSection: document.getElementById('profileSection'),
    profileName: document.getElementById('profileName'),
    profileTitle: document.getElementById('profileTitle'),
    profileAvatar: document.getElementById('profileAvatar'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    eventsAttendedStat: document.getElementById('eventsAttended'),
    totalXPStat: document.getElementById('totalXP'),
    userLevelStat: document.getElementById('userLevel'),
    perksUnlockedStat: document.getElementById('perksUnlocked'),
    perksGrid: document.getElementById('perksGrid'),
    achievementsGrid: document.getElementById('achievementsGrid'),
    attendedList: document.getElementById('attendedList'),

    // Stats
    totalEventsStat: document.getElementById('totalEvents'),

    // Toast
    toastContainer: document.getElementById('toastContainer'),

    // Sections
    hero: document.getElementById('hero')
};

// ============================================
// SIGNUP & VIBE MODAL FUNCTIONS
// ============================================

function showSignupModal() {
    elements.signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    elements.signupModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleSignupSubmit(e) {
    e.preventDefault();

    if (!userState.vibe || !userState.budget || !userState.crowd) {
        showToast('Please select all preferences', 'error');
        return;
    }

    closeSignupModal();
    awardXP(20, 'Profile setup');
    renderPersonalizedFeed();
    renderRealtimeEvents();
    renderReels();
    showToast('🎉 Vibe matched! Ready to explore?', 'success');
    saveUserState();
}

function handleMoodSelection(e) {
    const btn = e.target.closest('.mood-btn');
    if (!btn) return;
    elements.moodBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    userState.vibe = btn.dataset.mood;
}

function handleBudgetSelection(e) {
    const btn = e.target.closest('.budget-btn');
    if (!btn) return;
    elements.budgetBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    userState.budget = btn.dataset.budget;
}

function handleCrowdSelection(e) {
    const btn = e.target.closest('.crowd-btn');
    if (!btn) return;
    elements.crowdBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    userState.crowd = btn.dataset.crowd;
}

// ============================================
// REAL-TIME EVENTS WITH COUNTDOWN
// ============================================

function formatCountdown(minutes) {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
}

function renderRealtimeEvents() {
    elements.realtimeScroll.innerHTML = '';

    REALTIME_EVENTS.forEach(event => {
        const card = document.createElement('div');
        card.className = 'realtime-card';

        const isUrgent = event.minutesUntilStart < 30;
        const fewSlots = event.slotsRemaining < 8;

        card.innerHTML = `
            <div class="realtime-image">
                ${event.emoji}
                ${isUrgent ? '<div class="urgency-badge">🔥 Starts Soon</div>' : ''}
                <div class="slots-badge ${fewSlots ? 'slots-limited' : ''}">
                    ${event.slotsRemaining} slots
                </div>
                <div class="countdown-timer ${isUrgent ? 'countdown-warning' : ''}">
                    ⏱️ ${formatCountdown(event.minutesUntilStart)}
                </div>
            </div>
            <div class="realtime-info">
                <div class="realtime-title">${event.title}</div>
                <div class="realtime-meta">📍 ${event.location}</div>
                <div class="realtime-timer">Starts in ${formatCountdown(event.minutesUntilStart)}</div>
            </div>
        `;

        card.addEventListener('click', () => openEventPageModal(event));
        elements.realtimeScroll.appendChild(card);
    });

    // Update timers every minute
    setInterval(updateRealtimeTimers, 60000);
}

function updateRealtimeTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    timers.forEach((timer, idx) => {
        if (REALTIME_EVENTS[idx]) {
            REALTIME_EVENTS[idx].minutesUntilStart = Math.max(0, REALTIME_EVENTS[idx].minutesUntilStart - 1);
            timer.textContent = `⏱️ ${formatCountdown(REALTIME_EVENTS[idx].minutesUntilStart)}`;
        }
    });
}

// ============================================
// PERSONALIZED FEED RENDERING
// ============================================

function renderPersonalizedFeed() {
    elements.personalizedFeed.innerHTML = '';
    const recommendations = getPersonalizedRecommendations(6);

    if (recommendations.length === 0) {
        elements.personalizedFeed.innerHTML = '<p class="empty-state">No events match your vibe yet. Try adjusting your preferences!</p>';
        return;
    }

    recommendations.forEach(event => {
        const card = createEventCard(event);
        const vibeScorePercent = event.vibeScore;

        // Add vibe match score
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'vibe-match-score';
        scoreDiv.textContent = `${vibeScorePercent}% Match`;
        card.querySelector('.event-image').appendChild(scoreDiv);

        elements.personalizedFeed.appendChild(card);
    });
}

// ============================================
// REELS FEED (INSTAGRAM-LIKE)
// ============================================

function renderReels() {
    elements.reelsCarousel.innerHTML = '';
    const shuffledEvents = EVENTS_DATABASE.sort(() => Math.random() - 0.5).slice(0, 8);

    shuffledEvents.forEach(event => {
        const reel = document.createElement('div');
        reel.className = 'reel-card';

        const stats = {
            likes: Math.floor(Math.random() * 5000) + 100,
            shares: Math.floor(Math.random() * 500) + 10,
            comments: Math.floor(Math.random() * 200) + 5
        };

        reel.innerHTML = `
            <div class="reel-preview">
                ${event.emoji}
                <div class="play-button">▶</div>
                <div class="autoplay-indicator">🔊 Autoplay on</div>
            </div>
            <div class="reel-overlay">
                <div class="reel-title">${event.title}</div>
                <div class="reel-meta">
                    <span>${event.location}</span>
                    <span style="margin-left: 1rem;">👥 ${event.attendees}</span>
                </div>
                <div class="reel-stats">
                    <span>❤️ ${stats.likes}</span>
                    <span>💬 ${stats.comments}</span>
                    <span>📤 ${stats.shares}</span>
                </div>
            </div>
        `;

        reel.addEventListener('click', () => openEventPageModal(event));
        elements.reelsCarousel.appendChild(reel);
    });
}

// ============================================
// INITIALIZATION
// ============================================

async function loadBackendData() {
    try {
        const data = await apiRequest('/api/bootstrap');
        HOSTS_DATA = data.hosts || HOSTS_DATA;
        EVENTS_DATABASE = data.events || EVENTS_DATABASE;
        uiState.filteredEvents = [...EVENTS_DATABASE];
    } catch (error) {
        console.warn('Backend unavailable, using local data.', error);
        uiState.filteredEvents = [...EVENTS_DATABASE];
    }
}

async function init() {
    // Initialize theme first
    initializeTheme();
    
    try {
        await loadBackendData();
        loadUserState();
        if (elements.eventsGrid) renderEvents();
        if (!userState.currentChallenges?.length) initializeChallenges();
        updateStreak();
        updateLeaderboardTier();
        checkBadgeConditions();
        updateAllUI();
        attachEventListeners();
        updateNotificationBadge();
        
        // Page-specific initializers
        if (elements.realtimeScroll) renderRealtimeEvents();
        if (document.getElementById('categoryCarousels')) {
            renderCategoryCarousels();
            // Hide discovery feed by default on the events page if carousels are present
            const discoveryFeed = document.getElementById('discoveryFeed');
            if (discoveryFeed) discoveryFeed.style.display = 'none';
        }

        if (userState.vibe) {
            if (elements.personalizedFeed) renderPersonalizedFeed();
            if (elements.reelsCarousel) renderReels();
        }
        saveUserState();
    } catch (err) { console.error("Init failed:", err); }
}

function attachEventListeners() {
    // Signup form
    elements.signupForm?.addEventListener('submit', handleSignupSubmit);
    elements.moodBtns.forEach(btn => btn.addEventListener('click', handleMoodSelection));
    elements.budgetBtns.forEach(btn => btn.addEventListener('click', handleBudgetSelection));
    elements.crowdBtns.forEach(btn => btn.addEventListener('click', handleCrowdSelection));
    elements.refreshVibeBtn?.addEventListener('click', renderPersonalizedFeed);

    elements.menuToggle?.addEventListener('click', toggleMobileMenu);
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            window.location.href = link.href;
        });
    });
    elements.discoverBtn?.addEventListener('click', () => {
        window.location.href = '/events';
    });

    // Search & Filter
    elements.searchInput?.addEventListener('input', handleSearch);
    elements.filterChips.forEach(chip => {
        chip.addEventListener('click', handleCategoryFilter);
    });

    // Notification Bell
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', handleNotificationBellClick);
    }
}

// ============================================
// THEME SYSTEM (Dark/Light Mode)
// ============================================

const THEME_SYSTEM = {
    current: localStorage.getItem('worldweave_theme') || 'dark',
    modes: {
        dark: {
            name: 'Dark',
            colors: {
                background: '#0F0F0F',
                surface: '#181818',
                primary: '#C1A27B',
                secondary: '#E05D5D',
                accent: '#D4AF37',
                text: '#F5F5F5',
                textSecondary: '#999999'
            }
        },
        light: {
            name: 'Light',
            colors: {
                background: '#f8f9fa',
                surface: '#ffffff',
                primary: '#6366f1',
                secondary: '#ec4899',
                accent: '#f59e0b',
                text: '#1a202c',
                textSecondary: '#6b7280'
            }
        }
    }
};

function initializeTheme() {
    applyTheme(THEME_SYSTEM.current);
    
    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newTheme = e.matches ? 'dark' : 'light';
            if (localStorage.getItem('worldweave_theme_auto') !== 'false') {
                applyTheme(newTheme);
            }
        });
    }
}

function applyTheme(theme) {
    const colors = THEME_SYSTEM.modes[theme]?.colors;
    if (!colors) return;
    
    THEME_SYSTEM.current = theme;
    localStorage.setItem('worldweave_theme', theme);
    
    // Apply CSS variables
    Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    
    // Set body data attribute for theme-specific styling
    document.body.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const newTheme = THEME_SYSTEM.current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    playMicroSound('switch');
}

// ============================================
// MICRO-INTERACTIONS & ANIMATIONS
// ============================================

function playMicroSound(type) {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    const sounds = {
        click: () => {
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        },
        success: () => {
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0, now + 0.2);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        },
        switch: () => {
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(600, now);
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0, now + 0.15);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        },
        xp: () => {
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0, now + 0.15);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    };
    
    sounds[type]?.();
}

function triggerConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    // Create simple confetti animation
    const confettiPieces = [];
    const colors = ['#9D4EDD', '#FF2E63', '#00F5D4', '#FFD60A', '#4CC9F0'];
    
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = x + 'px';
        piece.style.top = y + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 8 + 4) + 'px';
        piece.style.position = 'fixed';
        piece.style.pointerEvents = 'none';
        piece.style.borderRadius = '50%';
        piece.style.zIndex = '9999';
        
        document.body.appendChild(piece);
        
        const angle = (Math.random() * Math.PI * 2);
        const velocity = Math.random() * 5 + 3;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity - 5;
        let px = x;
        let py = y;
        
        const animate = () => {
            vy += 0.2; // gravity
            px += vx;
            py += vy;
            
            piece.style.left = px + 'px';
            piece.style.top = py + 'px';
            piece.style.opacity = Math.max(0, 1 - (py - y) / 200);
            
            if (py - y < 200) {
                requestAnimationFrame(animate);
            } else {
                piece.remove();
            }
        };
        
        animate();
    }
}

function rippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (event.clientX - rect.left) + 'px';
    ripple.style.top = (event.clientY - rect.top) + 'px';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ============================================
// MOBILE MENU
// ============================================

function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    elements.navMenu.classList.remove('active');
}

// ============================================
// SEARCH & FILTER
// ============================================

function handleSearch(e) {
    uiState.searchQuery = e.target.value.toLowerCase();
    applyFilters();
}

function handleCategoryFilter(e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    elements.filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    uiState.selectedCategory = chip.dataset.category;
    applyFilters();
}

function applyFilters() {
    let filtered = EVENTS_DATABASE;
    
    const carousels = document.getElementById('categoryCarousels');
    const discoveryFeed = document.getElementById('discoveryFeed');

    // Toggle visibility based on filtering state
    if (uiState.selectedCategory === 'all' && !uiState.searchQuery) {
        if (carousels) carousels.style.display = 'block';
        if (discoveryFeed) discoveryFeed.style.display = 'none';
    } else {
        if (carousels) carousels.style.display = 'none';
        if (discoveryFeed) discoveryFeed.style.display = 'block';
    }

    // Category filter
    if (uiState.selectedCategory !== 'all') {
        filtered = filtered.filter(e => e.category === uiState.selectedCategory);
    }

    // Search filter
    if (uiState.searchQuery) {
        filtered = filtered.filter(e =>
            e.title.toLowerCase().includes(uiState.searchQuery) ||
            e.location.toLowerCase().includes(uiState.searchQuery) ||
            e.description.toLowerCase().includes(uiState.searchQuery)
        );
    }

    uiState.filteredEvents = filtered;
    renderEvents();
}

// ============================================
// RENDER EVENTS
// ============================================

function renderEvents() {
    elements.eventsGrid.innerHTML = '';
    elements.totalEventsStat.textContent = EVENTS_DATABASE.length;

    uiState.filteredEvents.forEach(event => {
        const card = createEventCard(event);
        elements.eventsGrid.appendChild(card);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-image">
            ${event.emoji}
            <div class="event-category-badge">${CATEGORIES[event.category].name}</div>
        </div>
        <div class="event-info">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-meta">
                <div class="event-meta-item">📅 ${event.date}</div>
                <div class="event-meta-item">📍 ${event.location}</div>
                <div class="event-meta-item">👥 ${event.attendees} going</div>
            </div>
            <div class="event-footer">
                <span class="xp-badge">+${event.xp} XP</span>
                <span class="event-attendees">${event.attendees} attendees</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openEventPageModal(event));
    return card;
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(event) {
    uiState.selectedEvent = event;
    
    // Track event view for behavior-based recommendations
    userState.eventViews.add(event.id);
    trackCategoryInteraction(event.category);
    
    elements.modalImage.textContent = event.emoji;
    elements.modalTitle.textContent = event.title;
    elements.modalCategory.textContent = CATEGORIES[event.category].name;
    elements.modalDate.textContent = event.date;
    elements.modalLocation.textContent = event.location;
    elements.modalAttendees.textContent = `${event.attendees} explorers`;
    elements.modalXP.textContent = `+${event.xp} XP`;
    elements.modalDescription.textContent = event.description;

    // Update button state
    const isBooked = userState.eventsBooked.includes(event.id);
    elements.bookEventBtn.textContent = isBooked ? '✓ Event Booked' : 'Book Event';
    elements.bookEventBtn.disabled = isBooked;

    elements.eventModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.eventModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    uiState.selectedEvent = null;
}

// ============================================
// EVENT ACTIONS
// ============================================


// ============================================
// RING-BASED XP SYSTEM
// ============================================

function awardRingXP(ringType, amount, action = '') {
    if (!userState.rings[ringType]) return;
    
    userState.rings[ringType].current += amount;
    userState.seasonalXP += amount;
    
    // Calculate progress percentage
    userState.rings[ringType].progress = Math.min(
        100,
        (userState.rings[ringType].current / userState.rings[ringType].goal) * 100
    );

    // Check if ring is completed
    if (userState.rings[ringType].current >= userState.rings[ringType].goal) {
        checkBadgeConditions();
        checkChallengeProgress();
    }

    updateLeaderboardTier();
    saveUserState();
}

function awardActivityXP(eventId, type = 'attend') {
    const baseXP = type === 'attend' ? 50 : 25;
    awardRingXP('activity', baseXP, `Activity: ${type}`);
}

function awardSocialXP(action = 'like') {
    const xpMap = {
        like: 2,
        comment: 5,
        first_post: 10,
        follow: 3,
        share_social: 5
    };
    const amount = xpMap[action] || 2;
    awardRingXP('social', amount, `Social: ${action}`);
}

function awardExplorerXP(category = '') {
    // Award XP for trying new category
    awardRingXP('explorer', 50, `Explorer: New category ${category}`);
}

function awardBonusXP(reason = '', amount = 0) {
    // Award total XP that increases level
    userState.totalXP += amount;
    const newLevel = calculateLevel(userState.totalXP);
    if (newLevel > userState.level) {
        userState.level = newLevel;
        showLevelUpNotification(newLevel);
        checkNewPerks(newLevel);
    }
}

// ============================================
// STREAK SYSTEM
// ============================================

function updateStreak() {
    const today = new Date().toDateString();
    const lastDate = userState.lastActivityDate ? new Date(userState.lastActivityDate).toDateString() : null;
    
    if (lastDate === today) {
        return; // Already updated today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
        // Streak continues
        userState.currentStreak++;
    } else {
        // Streak broken or new
        if (userState.currentStreak > userState.bestStreak) {
            userState.bestStreak = userState.currentStreak;
        }
        userState.currentStreak = 1;
    }

    userState.lastActivityDate = new Date().toISOString();

    // Award streak bonus
    if (userState.currentStreak % 7 === 0) {
        awardBonusXP(`${userState.currentStreak}-day streak bonus!`, 200);
    }
}

// ============================================
// BADGE SYSTEM
// ============================================

function checkBadgeConditions() {
    BADGES_DATABASE.forEach(badge => {
        if (!userState.unlockedBadges.includes(badge.id) && badge.condition(userState)) {
            userState.unlockedBadges.push(badge.id);
            showToast(`🏆 Badge earned: ${badge.name} ${badge.emoji}`, 'success');
            awardBonusXP(`Earned badge: ${badge.name}`, 50);
        }
    });
}

function getBadgeProgress() {
    return {
        unlocked: userState.unlockedBadges.length,
        total: BADGES_DATABASE.length,
        percentage: (userState.unlockedBadges.length / BADGES_DATABASE.length) * 100
    };
}

// ============================================
// CHALLENGE SYSTEM
// ============================================

function initializeChallenges() {
    const now = new Date();
    const currentWeek = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    
    userState.currentChallenges = CHALLENGES_DATABASE.map(challenge => ({
        ...challenge,
        progress: 0,
        completed: false,
        weekInitialized: currentWeek
    }));
}

function checkChallengeProgress() {
    userState.currentChallenges.forEach(challenge => {
        let currentProgress = 0;

        switch (challenge.category) {
            case 'attendance':
                currentProgress = userState.eventsAttended;
                break;
            case 'engagement':
                currentProgress = userState.totalLikesReceived;
                break;
            case 'exploration':
                currentProgress = userState.categoriesExplored.size;
                break;
            case 'xp':
                currentProgress = userState.seasonalXP;
                break;
        }

        challenge.progress = Math.min(currentProgress, challenge.goal);

        if (challenge.progress >= challenge.goal && !challenge.completed) {
            challenge.completed = true;
            showToast(
                `⭐ Challenge Complete: ${challenge.name}! +${challenge.reward} XP`,
                'success'
            );
            awardBonusXP(`Completed challenge: ${challenge.name}`, challenge.reward);
            userState.completedChallenges.push(challenge.id);
        }
    });
}

// ============================================
// LEADERBOARD SYSTEM
// ============================================

function updateLeaderboardTier() {
    const tier = LEADERBOARD_TIERS.find(
        t => userState.totalXP >= t.min && userState.totalXP <= t.max
    );
    userState.leaderboardTier = tier?.name.toLowerCase() || 'bronze';
}

function getLeaderboardData() {
    // Simulate leaderboard data - in real app would come from server
    const friends = [
        { id: 1, name: 'You', xp: userState.totalXP, avatar: '👤', tier: userState.leaderboardTier },
        { id: 2, name: 'Alex Runner', xp: userState.totalXP - 50, avatar: '🏃', tier: 'gold' },
        { id: 3, name: 'DJ Nova', xp: userState.totalXP + 200, avatar: '🎧', tier: 'platinum' },
        { id: 4, name: 'Emma Explorer', xp: userState.totalXP - 150, avatar: '🗺️', tier: 'silver' }
    ].sort((a, b) => b.xp - a.xp);

    return friends.map((friend, index) => ({
        ...friend,
        rank: index + 1,
        icon: ['🥇', '🥈', '🥉', ''][index] || ''
    }));
}

// ============================================
// GAMIFICATION LOGIC
// ============================================

function awardXP(amount, reason = '') {
    const previousLevel = userState.level;
    userState.totalXP += amount;
    userState.level = calculateLevel(userState.totalXP);

    // Check for level up
    if (userState.level > previousLevel) {
        showLevelUpNotification(userState.level);
        checkNewPerks(userState.level);
        triggerConfetti();
        playMicroSound('success');
    }

    // Check achievements
    checkAchievements();

    saveUserState();
}

function attendEvent(eventId) {
    const event = EVENTS_DATABASE.find(e => e.id === eventId);
    if (!event) return;

    // Mark as attended
    if (!userState.eventsAttended) userState.eventsAttended = 0;
    userState.eventsAttended++;

    // Track category
    userState.categoriesExplored.add(event.category);

    // Award XP
    awardXP(event.xp, `Attended: ${event.title}`);

    showToast(`Event attended! +${event.xp} XP earned!`, 'success');
}

function showLevelUpNotification(newLevel) {
    const unlocked = PERKS.filter(p => p.unlockedAtLevel === newLevel);
    let message = `🎉 Level Up! You're now level ${newLevel}!`;
    if (unlocked.length > 0) {
        message += ` New perk unlocked: ${unlocked[0].name}`;
    }
    showToast(message, 'success');
}

function checkNewPerks(level) {
    const newPerks = PERKS.filter(p => p.unlockedAtLevel === level);
    newPerks.forEach(perk => {
        if (!userState.unlockedPerks.includes(perk.id)) {
            userState.unlockedPerks.push(perk.id);
        }
    });
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!userState.unlockedAchievements.includes(achievement.id)) {
            if (achievement.condition(userState)) {
                userState.unlockedAchievements.push(achievement.id);
                showToast(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success');
            }
        }
    });
}

function getLevelTitle(level) {
    if (level < 5) return 'Newcomer';
    if (level < 10) return 'Explorer';
    if (level < 20) return 'Adventurer';
    if (level < 30) return 'Pathfinder';
    if (level < 50) return 'Quest Master';
    return 'Legend';
}

// ============================================
// RENDER FUNCTIONS - RINGS & GAMIFICATION
// ============================================

function renderRings() {
    const ringsContainer = document.getElementById('ringsContainer');
    if (!ringsContainer) return;

    const rings = [
        { key: 'activity', instance: RING_SYSTEM.ACTIVITY },
        { key: 'social', instance: RING_SYSTEM.SOCIAL },
        { key: 'explorer', instance: RING_SYSTEM.EXPLORER }
    ];

    let html = '<div class="rings-container">';

    rings.forEach(({ key, instance }) => {
        const ringData = userState.rings[key];
        const isComplete = ringData.progress >= 100;
        const progress = Math.min(ringData.progress, 100);

        html += `
            <div class="ring-card">
                <div class="ring-svg">
                    <div class="ring-background">
                        <div class="ring-percentage" style="
                            --ring-color-start: ${instance.colorStart}; 
                            --ring-color-end: ${instance.colorEnd}; 
                            --progress: ${progress}">
                        </div>
                        <div class="ring-status">
                            <div class="ring-status-text">${Math.round(progress)}%</div>
                            <div class="ring-status-label">${isComplete ? '✓ Complete' : 'In Progress'}</div>
                        </div>
                    </div>
                </div>
                <div class="ring-info">
                    <div class="ring-title">${instance.icon} ${instance.name}</div>
                    <div class="ring-description">${instance.description}</div>
                    <div class="ring-progress-label">
                        <span>${ringData.current} XP</span>
                        <span>${ringData.goal} Goal</span>
                    </div>
                    <div class="ring-progress-bar">
                        <div class="ring-progress-fill" style="--ring-color: ${instance.color}; --progress: ${progress}%"></div>
                    </div>
                    ${isComplete ? '<div class="ring-completion-badge" style="--ring-color: ' + instance.color + '">RING COMPLETE 🎯</div>' : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    ringsContainer.innerHTML = html;
}

function renderBadges() {
    const badgesContainer = document.getElementById('badgesContainer');
    if (!badgesContainer) return;

    const progress = getBadgeProgress();

    let html = `
        <div class="badges-section">
            <div class="badges-header">
                <h3>Badges Unlocked</h3>
                <span class="badges-progress">${progress.unlocked} / ${progress.total}</span>
            </div>
            <div class="badges-grid">
    `;

    BADGES_DATABASE.forEach(badge => {
        const isUnlocked = userState.unlockedBadges.includes(badge.id);
        html += `
            <div class="badge-item ${isUnlocked ? '' : 'locked'}" title="${badge.description}">
                <div class="badge-emoji">${badge.emoji}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
                ${!isUnlocked ? '<div class="badge-lock">🔒</div>' : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    badgesContainer.innerHTML = html;
}

function renderChallenges() {
    const challengesContainer = document.getElementById('challengesContainer');
    if (!challengesContainer) return;

    if (!userState.currentChallenges || userState.currentChallenges.length === 0) {
        initializeChallenges();
    }

    let html = `
        <div class="challenges-section">
            <div class="challenges-header">
                <h3>⭐ Weekly Challenges</h3>
            </div>
            <div class="challenges-grid">
    `;

    userState.currentChallenges.forEach(challenge => {
        const progressPercent = Math.min((challenge.progress / challenge.goal) * 100, 100);

        html += `
            <div class="challenge-card ${challenge.completed ? 'completed' : ''}">
                <div class="challenge-header">
                    <div class="challenge-title">
                        <span class="challenge-icon">${challenge.icon}</span>
                        <span class="challenge-name">${challenge.name}</span>
                    </div>
                    <span class="challenge-reward">${challenge.completed ? '✓' : '+' + challenge.reward}</span>
                </div>
                <div class="challenge-description">${challenge.description}</div>
                <div class="challenge-progress">
                    <span>Progress</span>
                    <span>${challenge.progress} / ${challenge.goal}</span>
                </div>
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                ${challenge.completed ? '<div class="challenge-status">✓ Completed</div>' : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    challengesContainer.innerHTML = html;
}

function renderLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    if (!leaderboardContainer) return;

    const leaderboard = getLeaderboardData();

    let html = `
        <div class="leaderboard-section">
            <div class="leaderboard-header">
                <h3>🏆 Leaderboard</h3>
                <div class="leaderboard-tabs">
                    <button class="leaderboard-tab active" onclick="switchLeaderboardTab('friends')">Friends</button>
                    <button class="leaderboard-tab" onclick="switchLeaderboardTab('global')">Global</button>
                </div>
            </div>
            <div class="leaderboard-list">
    `;

    leaderboard.forEach(user => {
        html += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">${user.icon || user.rank}</div>
                <div class="leaderboard-user">
                    <div class="leaderboard-avatar">${user.avatar}</div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${user.name}</div>
                        <div class="leaderboard-tier">${user.tier}</div>
                    </div>
                </div>
                <div class="leaderboard-xp">
                    <div class="leaderboard-xp-value">${user.xp.toLocaleString()}</div>
                    <div class="leaderboard-xp-label">XP</div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    leaderboardContainer.innerHTML = html;
}

function renderStreaksAndSeasonal() {
    const streakContainer = document.getElementById('streakContainer');
    if (!streakContainer) return;

    const campaign = SEASONAL_CAMPAIGNS.campaigns[SEASONAL_CAMPAIGNS.current] || {};
    const endDate = new Date(campaign.endDate);
    const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

    let html = `
        <div class="streak-display">
            <div class="streak-card">
                <div class="streak-icon">🔥</div>
                <div class="streak-info">
                    <div class="streak-label">Current Streak</div>
                    <div class="streak-count">${userState.currentStreak}</div>
                </div>
            </div>
            <div class="streak-card" style="background: linear-gradient(135deg, rgba(255, 215, 61, 0.1) 0%, rgba(255, 215, 61, 0.05) 100%); border-left: 4px solid #ffd73d;">
                <div class="streak-icon">⭐</div>
                <div class="streak-info">
                    <div class="streak-label">Best Streak</div>
                    <div class="streak-count">${userState.bestStreak}</div>
                </div>
            </div>
        </div>

        <div class="seasonal-campaign">
            <div class="seasonal-header">
                <div class="seasonal-title">${campaign.name}</div>
                <div class="seasonal-timer">⏰ ${daysRemaining} days left</div>
            </div>
            <div class="seasonal-description">${campaign.description}</div>
            <div class="seasonal-rewards">
                ${campaign.rewards?.map(r => `<div class="seasonal-reward">${r}</div>`).join('') || ''}
            </div>
        </div>
    `;

    streakContainer.innerHTML = html;
}

function switchLeaderboardTab(tab) {
    // In a real app, would switch between friends/global leaderboard
    // For now just highlight the active tab
    document.querySelectorAll('.leaderboard-tab').forEach(t => {
        t.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ============================================
// UPDATE UI
// ============================================

function updateAllUI() {
    updateHeader();
    updateProfileSection();
    
    // Update gamification UI
    renderRings();
    renderBadges();
    renderChallenges();
    renderLeaderboard();
    renderStreaksAndSeasonal();
    updateNotificationBadge();
}

function updateHeader() {
    elements.levelBadge.textContent = `Lvl ${userState.level}`;
    elements.xpDisplay.textContent = `${userState.totalXP} XP`;
}

function updateProfileSection() {
    // User Info
    elements.profileName.textContent = userState.name;
    elements.profileTitle.textContent = getLevelTitle(userState.level);

    // Progress to next level
    const progress = getProgressToNextLevel(userState.totalXP);
    elements.progressFill.style.width = progress.percentage + '%';
    elements.progressText.textContent = `${progress.current} / ${progress.needed} XP`;

    // Stats
    elements.eventsAttendedStat.textContent = userState.eventsAttended;
    elements.totalXPStat.textContent = userState.totalXP;
    elements.userLevelStat.textContent = userState.level;
    elements.perksUnlockedStat.textContent = userState.unlockedPerks.length;

    // Perks
    renderPerks();

    // Achievements
    renderAchievements();

    // Attended Events
    renderAttendedEvents();
}

function renderPerks() {
    elements.perksGrid.innerHTML = '';
    PERKS.forEach(perk => {
        if (userState.unlockedPerks.includes(perk.id)) {
            const perkCard = document.createElement('div');
            perkCard.className = 'perk-card';
            perkCard.innerHTML = `
                <div class="perk-icon">${perk.emoji}</div>
                <div class="perk-name">${perk.name}</div>
                <div class="perk-desc">${perk.description}</div>
            `;
            elements.perksGrid.appendChild(perkCard);
        } else {
            const perkCard = document.createElement('div');
            perkCard.className = 'perk-card';
            perkCard.style.opacity = '0.5';
            perkCard.style.borderStyle = 'dashed';
            perkCard.innerHTML = `
                <div class="perk-icon">${perk.emoji}</div>
                <div class="perk-name">${perk.name}</div>
                <div class="perk-desc">Level ${perk.unlockedAtLevel}</div>
            `;
            elements.perksGrid.appendChild(perkCard);
        }
    });
}

function renderAchievements() {
    elements.achievementsGrid.innerHTML = '';
    ACHIEVEMENTS.forEach(achievement => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        if (!userState.unlockedAchievements.includes(achievement.id)) {
            card.style.opacity = '0.5';
            card.style.borderStyle = 'dashed';
        }
        card.innerHTML = `
            <div class="achievement-icon">${achievement.emoji}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        elements.achievementsGrid.appendChild(card);
    });
}

function renderAttendedEvents() {
    elements.attendedList.innerHTML = '';

    if (userState.eventsBooked.length === 0) {
        elements.attendedList.innerHTML = '<p class="empty-state">No events booked yet. Book your first event to get started!</p>';
        return;
    }

    userState.eventsBooked.forEach(eventId => {
        const event = EVENTS_DATABASE.find(e => e.id === eventId);
        if (event) {
            const item = document.createElement('div');
            item.className = 'attended-item';
            item.innerHTML = `
                <div class="attended-img">${event.emoji}</div>
                <div class="attended-info">
                    <h4>${event.title}</h4>
                    <p>${event.date} • ${event.location}</p>
                </div>
                <div class="attended-xp">+${event.xp} XP</div>
            `;
            elements.attendedList.appendChild(item);
        }
    });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;

    elements.toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (document.contains(toast)) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ============================================
// ENHANCED EVENT PAGE MODAL
// ============================================

function openEventPageModal(event) {
    if (!event) return;
    
    uiState.selectedEvent = event;
    userState.eventViews.add(event.id);
    trackCategoryInteraction(event.category);
    
    // Create or update event page modal
    let eventPageModal = document.getElementById('eventPageModal');
    if (!eventPageModal) {
        eventPageModal = document.createElement('div');
        eventPageModal.id = 'eventPageModal';
        eventPageModal.className = 'modal event-page-modal';
        document.body.appendChild(eventPageModal);
    }

    const host = HOSTS_DATA[event.hostId];
    const hostRing = getHostTier(event.hostId);
    const isBooked = userState.eventsBooked.includes(event.id);
    const isFollowing = userState.following.has(event.hostId);

    eventPageModal.innerHTML = `
        <div class="modal-content event-page-modal">
            <button class="modal-close" onclick="closeEventPageModal()">&times;</button>
            
            <!-- EVENT HERO -->
            <div class="event-page-hero">
                <div class="event-page-image">${event.emoji}</div>
                <div class="event-page-overlay">
                    <span class="event-page-category">${CATEGORIES[event.category].name}</span>
                    <span class="event-rating">★ ${event.rating} (${event.reviews})</span>
                </div>
            </div>

            <!-- MAIN CONTENT GRID -->
            <div class="event-page-container">
                <div class="event-page-main">
                    <!-- CTA SECTION (PROMINENT) -->
                    <div class="event-cta-section">
                        <h1>${event.title}</h1>
                        <div class="cta-row">
                            <div class="event-price">$${event.price}</div>
                            <button class="btn-cta-primary" onclick="bookEvent('${event.id}')" 
                                ${isBooked ? 'disabled' : ''}>
                                ${isBooked ? '✓ Event Booked' : 'Book Event'}
                            </button>
                        </div>
                        ${event.spotsRemaining < 10 ? `
                            <div class="event-urgency">
                                🔥 Only ${event.spotsRemaining} spots remaining!
                            </div>
                        ` : ''}
                    </div>

                    <!-- EVENT INFO GRID -->
                    <div class="event-info-grid">
                        <div class="info-item">
                            <span class="info-label">📅 Date</span>
                            <span>${event.date}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📍 Location</span>
                            <span>${event.location}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">👥 Capacity</span>
                            <span>${event.maxCapacity - event.spotsRemaining}/${event.maxCapacity}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">⭐ XP Reward</span>
                            <span>+${event.xp} XP</span>
                        </div>
                    </div>

                    <!-- DESCRIPTION -->
                    <div class="event-description-section">
                        <h3>About This Event</h3>
                        <p>${event.description}</p>
                    </div>

                    <!-- WHO'S GOING (SOCIAL PROOF) -->
                    <div class="whos-going-section">
                        <h3>Who's Going</h3>
                        <div class="going-avatars" id="goingAvatars">
                            ${event.goingUsers.slice(0, 4).map((user, i) => `
                                <div class="going-avatar" title="${user.name}">${user.avatar}</div>
                            `).join('')}
                            ${event.goingUsers.length > 4 ? `
                                <div class="going-avatar" style="background: var(--primary);">+${event.goingUsers.length - 4}</div>
                            ` : ''}
                        </div>
                        ${event.goingUsers.length > 0 ? `
                            <p><strong>${event.goingUsers.length}</strong> people are already going</p>
                        ` : ''}
                        <button class="btn-secondary-large" onclick="viewAllAttendees('${event.id}')">
                            View All Attendees →
                        </button>
                    </div>

                    <!-- GROUP ACTIONS -->
                    <div style="background: white; padding: var(--spacing-lg); border: 1px solid var(--card-border); border-radius: var(--spacing-md);">
                        <h3 style="margin-bottom: var(--spacing-md);">Group Actions</h3>
                        <div class="group-actions">
                            <button class="btn-secondary-large" onclick="handleGroupVote('${event.id}')">
                                🗳️ Vote
                            </button>
                            <button class="btn-secondary-large" onclick="handleSplitPayment('${event.id}')">
                                💰 Split Payment
                            </button>
                            <button class="btn-secondary-large" onclick="handleFollowHost(${event.hostId})">
                                ${isFollowing ? '✓ Following' : '➕ Follow Host'}
                            </button>
                        </div>
                    </div>

                    <!-- EVENT GALLERY -->
                    <div class="event-gallery-section">
                        <h3>Event Gallery</h3>
                        <div class="gallery-grid" id="eventGallery">
                            ${getEventGallery(event.id).slice(0, 6).map((post, i) => `
                                <div class="gallery-item">
                                    <img src="${post.imageUrl}" alt="Gallery" class="gallery-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
                                    <div class="gallery-item-poster">${post.caption}</div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn-secondary-large" onclick="uploadGalleryPhoto('${event.id}')">
                            📸 Add Photo
                        </button>
                    </div>

                    <!-- ACTIVITY FEED -->
                    <div class="activity-feed-section">
                        <h3>Activity</h3>
                        <div class="activity-feed" id="activityFeed">
                            ${getActivityFeed().filter(a => a.eventId === event.id).slice(0, 5).map((activity, i) => `
                                <div class="activity-item">
                                    <div class="activity-avatar">${activity.userAvatar}</div>
                                    <div class="activity-content">
                                        <div class="activity-user">${activity.userName}</div>
                                        <div class="activity-action">${activity.action}</div>
                                        <div class="activity-time">${new Date(activity.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- SIDEBAR -->
                <div class="event-page-sidebar">
                    <!-- HOST CARD -->
                    <div class="host-card-section">
                        <h3>Host</h3>
                        <div class="host-card">
                            <div class="host-avatar">${host.avatar}</div>
                            <div>
                                <div class="host-name">
                                    ${host.name}
                                    ${host.verified ? '<span class="host-verified-badge">✓ Verified</span>' : ''}
                                </div>
                                <div class="host-bio">${host.bio}</div>
                                <div class="host-stats">
                                    <div class="host-stat">
                                        <span class="host-stat-value">${host.eventsHosted}</span>
                                        <span class="host-stat-label">Events</span>
                                    </div>
                                    <div class="host-stat">
                                        <span class="host-stat-value">★${host.rating}</span>
                                        <span class="host-stat-label">Rating</span>
                                    </div>
                                    <div class="host-stat">
                                        <span class="host-stat-value">${host.followers}</span>
                                        <span class="host-stat-label">Followers</span>
                                    </div>
                                </div>
                                <!-- HOST RING -->
                                <div class="host-ring-display">
                                    <div class="ring-item">
                                        <div class="ring-circle" style="--progress: ${host.hostRing.hosting}%;">
                                            ${host.hostRing.hosting}
                                        </div>
                                        <div class="ring-label">Hosting</div>
                                    </div>
                                    <div class="ring-item">
                                        <div class="ring-circle" style="--progress: ${host.hostRing.engagement}%;">
                                            ${host.hostRing.engagement}
                                        </div>
                                        <div class="ring-label">Engagement</div>
                                    </div>
                                    <div class="ring-item">
                                        <div class="ring-circle" style="--progress: ${host.hostRing.growth}%;">
                                            ${host.hostRing.growth}
                                        </div>
                                        <div class="ring-label">Growth</div>
                                    </div>
                                </div>
                                <div style="margin-top: var(--spacing-md); padding: var(--spacing-sm); background: var(--bg-light); border-radius: var(--spacing-sm); text-align: center; font-weight: 600; color: var(--primary);">
                                    Tier: ${hostRing.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SHARE & SAVE -->
                    <button class="btn-secondary-large" onclick="shareEvent('${event.id}')">
                        📤 Share Event
                    </button>
                    <button class="btn-secondary-large" onclick="saveEvent('${event.id}')">
                        🔖 Save Event
                    </button>
                </div>
            </div>
        </div>
    `;

    eventPageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add close event listener
    eventPageModal.addEventListener('click', (e) => {
        if (e.target === eventPageModal) closeEventPageModal();
    });
}

function closeEventPageModal() {
    const modal = document.getElementById('eventPageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    uiState.selectedEvent = null;
}

async function bookEvent(eventId) {
    const event = EVENTS_DATABASE.find(e => e.id === parseInt(eventId));
    if (!event) return;

    if (userState.eventsBooked.includes(event.id)) {
        showToast('You\'ve already booked this event!', 'info');
        return;
    }

    try {
        if (event.price > 0) {
            showToast('🔒 Opening secure checkout...', 'info');
            await apiRequest('/api/payments/create', {
                method: 'POST',
                body: JSON.stringify({
                    eventId: event.id,
                    attendeeId: userState.name
                })
            });
        }

        const bookingResponse = await apiRequest(`/api/events/${event.id}/book`, {
            method: 'POST',
            body: JSON.stringify({
                attendeeId: userState.name
            })
        });

        const updatedEvent = bookingResponse.event;
        const eventIndex = EVENTS_DATABASE.findIndex(e => e.id === updatedEvent.id);
        if (eventIndex >= 0) {
            EVENTS_DATABASE[eventIndex] = updatedEvent;
        }

        // Update streak
        updateStreak();

        userState.eventsBooked.push(updatedEvent.id);
        userState.eventsAttended++;
        userState.bookingTime[updatedEvent.id] = new Date().getTime();
        trackCategoryInteraction(updatedEvent.category);
        
        if (!userState.categoriesExplored.has(updatedEvent.category)) {
            userState.categoriesExplored.add(updatedEvent.category);
            awardExplorerXP(updatedEvent.category);
        }
        
        awardActivityXP(updatedEvent.id, 'attend');
        
        addMemory('event', { 
            title: updatedEvent.title, 
            description: `Attended ${updatedEvent.title} at ${updatedEvent.location}` 
        });

        const baseXP = bookingResponse.booking?.awardedXP ?? Math.floor(updatedEvent.xp * 0.3);
        awardBonusXP(`Booked ${updatedEvent.title}`, baseXP);
        
        checkChallengeProgress();
        checkBadgeConditions();
        updateHostMetrics(updatedEvent.hostId, 'booking');
        addActivity('booking', `Booked ${updatedEvent.title}`, updatedEvent.id);
        checkLimitedSlots(updatedEvent);
        
        showToast(`🎉 Event booked! +${baseXP} XP | Activity Ring +50 XP`, 'success');
        
        playMicroSound('xp');
        openEventPageModal(updatedEvent);
        saveUserState();
        updateAllUI();
    } catch (error) {
        showToast(error.message || 'Booking failed', 'error');
    }
}

async function shareEvent(eventId) {
    const event = EVENTS_DATABASE.find(e => e.id === parseInt(eventId));
    if (!event) return;

    try {
        await apiRequest(`/api/events/${event.id}/share`, {
            method: 'POST'
        });

        userState.sharedEvents.add(event.id);
        awardSocialXP('share_social');
        awardBonusXP(`Shared ${event.title}`, 10);
        addActivity('sharing', `Shared ${event.title}`, event.id);
        
        showToast('📤 Event shared! +10 XP | Social Ring +5 XP', 'success');
        saveUserState();
        updateAllUI();
    } catch (error) {
        showToast(error.message || 'Share failed', 'error');
    }
}

function saveEvent(eventId) {
    showToast('💾 Event saved to your collection', 'success');
}

function handleGroupVote(eventId) {
    const event = EVENTS_DATABASE.find(e => e.id === parseInt(eventId));
    if (!event) return;

    const options = [
        'Tomorrow at 6 PM',
        'Weekend morning',
        'Next Saturday',
        'Next weekend'
    ];

    let voteContent = `<div style="padding: var(--spacing-md); text-align: center;">
        <h3 style="margin-bottom: var(--spacing-md);">When should we do this?</h3>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">`;
    
    options.forEach((option, i) => {
        voteContent += `
            <button class="btn-secondary-large" onclick="castGroupVote(${eventId}, ${i})">
                ${option}
            </button>
        `;
    });
    
    voteContent += `</div></div>`;

    showVoteModal(voteContent);
}

function castGroupVote(eventId, optionIndex) {
    addActivity('voting', `Voted on timing for event`, eventId);
    showToast('✓ Vote recorded!', 'success');
    closeVoteModal();
}

function handleSplitPayment(eventId) {
    const event = EVENTS_DATABASE.find(e => e.id === parseInt(eventId));
    if (!event) return;

    showToast('💰 Open split payment with friends in your group', 'info');
}

function handleFollowHost(hostId) {
    const isFollowing = userState.following.has(hostId);
    
    if (isFollowing) {
        unfollowUser(hostId);
        showToast('Unfollowed host', 'info');
    } else {
        followUser(hostId);
        updateHostMetrics(hostId, 'follow');
        showToast('✓ Now following this host', 'success');
    }
    
    // Refresh modal
    if (uiState.selectedEvent) {
        openEventPageModal(uiState.selectedEvent);
    }
}

function viewAllAttendees(eventId) {
    const event = EVENTS_DATABASE.find(e => e.id === parseInt(eventId));
    if (!event) return;

    let attendeeContent = `<div style="padding: var(--spacing-lg);">
        <h3 style="margin-bottom: var(--spacing-md);">People Going (${event.goingUsers.length})</h3>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">`;
    
    event.goingUsers.forEach(user => {
        attendeeContent += `
            <div style="display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--bg-light); border-radius: var(--spacing-sm);">
                <span style="font-size: 1.5rem;">${user.avatar}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${user.name}</div>
                </div>
                <button class="btn-secondary-large" style="padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-size-sm);" onclick="followUser(${user.id})">
                    Follow
                </button>
            </div>
        `;
    });
    
    attendeeContent += `</div></div>`;
    showVoteModal(attendeeContent);
}

function uploadGalleryPhoto(eventId) {
    showToast('📸 Feature coming soon - Photo gallery upload', 'info');
}

// ============================================
// NOTIFICATION MANAGEMENT
// ============================================

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const unreadCount = getUnreadNotifications();
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
            if (section === 'profile') renderMemoryTimeline();
        }
    }
}

function handleNotificationBellClick() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'notificationModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; max-height: 600px; overflow-y: auto;">
            <button class="modal-close" onclick="document.getElementById('notificationModal').remove()">&times;</button>
            <h2 style="margin-bottom: var(--spacing-lg);">Notifications</h2>
            <div id="notificationsList" style="display: flex; flex-direction: column; gap: var(--spacing-md);"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const notificationsList = modal.querySelector('#notificationsList');
    const notifications = SOCIAL_FEATURES.notifications.slice(0, 20);

    if (notifications.length === 0) {
        notificationsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No notifications yet</p>';
    } else {
        notifications.forEach(notif => {
            const notifEl = document.createElement('div');
            notifEl.style.cssText = `
                padding: var(--spacing-md);
                background: ${notif.read ? 'white' : '#f0f4ff'};
                border: 1px solid var(--card-border);
                border-radius: var(--spacing-sm);
                cursor: pointer;
                transition: var(--transition);
            `;
            notifEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">${notif.title}</div>
                        <div style="color: var(--text-secondary); font-size: var(--font-size-sm);">${notif.message}</div>
                        <div style="color: var(--text-light); font-size: var(--font-size-xs); margin-top: 4px;">${new Date(notif.timestamp).toLocaleString()}</div>
                    </div>
                    ${!notif.read ? '<span style="background: var(--primary); width: 12px; height: 12px; border-radius: 50%; margin-top: 4px;"></span>' : ''}
                </div>
            `;
            notifEl.addEventListener('click', () => {
                notif.read = true;
                updateNotificationBadge();
                if (notif.actionUrl) {
                    // Navigate to action URL
                }
            });
            notificationsList.appendChild(notifEl);
        });
    }
}

// Modal helpers
function showVoteModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'voteModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeVoteModal()">&times;</button>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeVoteModal();
    });
}

function closeVoteModal() {
    const modal = document.getElementById('voteModal');
    if (modal) modal.remove();
}

// ============================================
// DEMO FUNCTIONS
// ============================================

function simulateAttendance() {
    // Simulate attending random events
    const randomEvent = uiState.filteredEvents[Math.floor(Math.random() * uiState.filteredEvents.length)];
    if (randomEvent) {
        attendEvent(randomEvent.id);
        updateAllUI();
    }
}

// Expose demo function for testing
window.attendRandomEvent = simulateAttendance;

// ============================================
// CATEGORY CAROUSELS (COMING SOON)
// ============================================

function renderCategoryCarousels() {
    const container = document.getElementById('categoryCarousels');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const section = document.createElement('div');
        section.className = 'category-carousel-wrapper';
        
        // Filter actual events for this category
        const categoryEvents = EVENTS_DATABASE.filter(e => e.category === key);

        section.innerHTML = `
            <div class="category-row-header">
                <div>
                    <h3 class="glow-text" style="font-size: 1.8rem; margin-bottom: 0.25rem;">${cat.emoji} ${cat.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem;">Curated ${cat.name.toLowerCase()} experiences</p>
                </div>
                <span class="coming-soon-tag">Premium Collections</span>
            </div>
            <div class="realtime-scroll carousel-events">
                ${categoryEvents.map(event => {
                    const eventDate = new Date(event.date);
                    const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    
                    return `
                        <div class="event-card carousel-event-card" onclick="window.openEventById(${event.id})">
                            <div class="event-image carousel-event-image" style="font-size: 2.8rem; position: relative;">
                                ${event.emoji}
                                <span class="carousel-status-badge">Coming Soon</span>
                            </div>
                            <div class="event-info carousel-event-info">
                                <h4 class="event-title" style="font-size: 1rem; margin-bottom: 0.6rem; line-height: 1.3;">${event.title}</h4>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-soft);">
                                    <div>📅 ${dateStr} at ${timeStr}</div>
                                    <div>📍 ${event.location}</div>
                                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--line);">
                                        <span>👥 ${event.attendees} attending</span>
                                        <span style="color: var(--gold);">⭐ ${event.xp} XP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
                <div class="coming-soon-card glass carousel-coming-soon">
                    <div class="coming-soon-content">
                        <span class="lock-icon" style="font-size: 2.2rem;">✨</span>
                        <h4 style="font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.75rem;">Exclusive ${cat.name}</h4>
                        <p style="font-size: 0.9rem; line-height: 1.4; color: var(--text-soft);">New curated ${cat.name.toLowerCase()} being vetted by our premium selection team</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(section);
    });
}

window.openEventById = (id) => {
    const event = EVENTS_DATABASE.find(e => e.id === id);
    if (event) openEventPageModal(event);
};

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', init);
