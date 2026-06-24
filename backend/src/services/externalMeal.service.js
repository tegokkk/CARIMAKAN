const https = require('https');

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response from external API'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

class ExternalMealService {
  static async searchMeals(query = '') {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
    try {
      const result = await httpGet(url);
      return result.meals || [];
    } catch (error) {
      console.error('Error fetching from TheMealDB:', error);
      throw new Error('Failed to fetch data from TheMealDB');
    }
  }

  static async getMealDetail(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    try {
      const result = await httpGet(url);
      if (!result.meals || result.meals.length === 0) {
        return null;
      }
      return result.meals[0];
    } catch (error) {
      console.error('Error fetching meal detail from TheMealDB:', error);
      throw new Error('Failed to fetch meal detail from TheMealDB');
    }
  }
}

module.exports = ExternalMealService;
