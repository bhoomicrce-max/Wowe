/**
 * Event Model
 * Defines the structure and methods for Event objects
 */

class Event {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.category = data.category;
    this.emoji = data.emoji;
    this.date = data.date;
    this.location = data.location;
    this.description = data.description;
    this.price = data.price || 0;
    this.xp = data.xp || 10;
    this.hostId = data.hostId;
    this.maxCapacity = data.maxCapacity || 100;
    this.attendees = data.attendees || 0;
    this.spotsRemaining = (data.maxCapacity || 100) - (data.attendees || 0);
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.color = data.color || '#d4af37';
    this.gallery = data.gallery || [];
    this.goingUsers = data.goingUsers || [];
    this.savedBy = data.savedBy || [];
    this.shares = data.shares || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      emoji: this.emoji,
      date: this.date,
      location: this.location,
      description: this.description,
      price: this.price,
      xp: this.xp,
      hostId: this.hostId,
      maxCapacity: this.maxCapacity,
      attendees: this.attendees,
      spotsRemaining: this.spotsRemaining,
      rating: this.rating,
      reviews: this.reviews,
      color: this.color,
      gallery: this.gallery,
      goingUsers: this.goingUsers,
      savedBy: this.savedBy,
      shares: this.shares,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  isFull() {
    return this.spotsRemaining <= 0;
  }

  addAttendee(userId) {
    if (this.isFull()) {
      return false;
    }
    if (!this.goingUsers.find(u => u.id === userId)) {
      this.goingUsers.push({ id: userId, avatar: '👤', name: `User ${userId}` });
      this.attendees++;
      this.spotsRemaining--;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  removeAttendee(userId) {
    const index = this.goingUsers.findIndex(u => u.id === userId);
    if (index > -1) {
      this.goingUsers.splice(index, 1);
      this.attendees--;
      this.spotsRemaining++;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  saveBy(userId) {
    if (!this.savedBy.includes(userId)) {
      this.savedBy.push(userId);
      return true;
    }
    return false;
  }

  unsaveBy(userId) {
    const index = this.savedBy.indexOf(userId);
    if (index > -1) {
      this.savedBy.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = Event;
