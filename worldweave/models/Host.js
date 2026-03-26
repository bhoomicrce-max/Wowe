/**
 * Host Model  
 * Defines the structure for Event Hosts
 */

class Host {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.avatar = data.avatar;
    this.bio = data.bio || '';
    this.verified = data.verified || false;
    this.eventsHosted = data.eventsHosted || 0;
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.followers = data.followers || 0;
    this.following = data.following || [];
    this.hostRing = data.hostRing || { hosting: 0, engagement: 0, growth: 0 };
    this.boostedVisibility = data.boostedVisibility || false;
    this.joinedAt = data.joinedAt || new Date().toISOString();
    this.responseTime = data.responseTime || 'Quick';
    this.cancellationRate = data.cancellationRate || 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      bio: this.bio,
      verified: this.verified,
      eventsHosted: this.eventsHosted,
      rating: this.rating,
      reviews: this.reviews,
      followers: this.followers,
      following: this.following,
      hostRing: this.hostRing,
      boostedVisibility: this.boostedVisibility,
      joinedAt: this.joinedAt,
      responseTime: this.responseTime,
      cancellationRate: this.cancellationRate
    };
  }

  incrementEventsHosted() {
    this.eventsHosted++;
  }

  addFollower(userId) {
    if (!this.following.includes(userId)) {
      this.following.push(userId);
      this.followers++;
      return true;
    }
    return false;
  }

  removeFollower(userId) {
    const index = this.following.indexOf(userId);
    if (index > -1) {
      this.following.splice(index, 1);
      this.followers--;
      return true;
    }
    return false;
  }
}

module.exports = Host;
