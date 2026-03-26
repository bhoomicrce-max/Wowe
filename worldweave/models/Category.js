/**
 * Category Model
 * Defines the structure for Event Categories
 */

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.emoji = data.emoji;
    this.color = data.color;
    this.description = data.description || '';
    this.eventCount = data.eventCount || 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      emoji: this.emoji,
      color: this.color,
      description: this.description,
      eventCount: this.eventCount
    };
  }
}

module.exports = Category;
