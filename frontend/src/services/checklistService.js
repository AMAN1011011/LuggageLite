const API_BASE_URL = 'http://localhost:5000/api';

class ChecklistService {
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryItems(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist/categories/${categoryId}/items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching category items:', error);
      throw error;
    }
  }

  async searchItems(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  }

  async getPopularItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist/popular`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching popular items:', error);
      throw error;
    }
  }

  async getItemDetails(itemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist/items/${itemId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching item details:', error);
      throw error;
    }
  }

  async getChecklistStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching checklist stats:', error);
      throw error;
    }
  }
}

export const checklistService = new ChecklistService();
