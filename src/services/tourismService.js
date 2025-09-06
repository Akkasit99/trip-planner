// Tourism Data Service
// บริการจัดการข้อมูลการท่องเที่ยวจาก Supabase

import { supabase } from './supabase';

export class TourismService {
  // Get all provinces
  static async getAllProvinces() {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return { data: null, error };
    }
  }

  // Get province by ID
  static async getProvinceById(provinceId) {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .eq('id', provinceId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching province:', error);
      return { data: null, error };
    }
  }

  // Get all attractions
  static async getAllAttractions() {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching attractions:', error);
      return { data: null, error };
    }
  }

  // Get attractions by province
  static async getAttractionsByProvince(provinceId) {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .eq('province_id', provinceId)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching attractions by province:', error);
      return { data: null, error };
    }
  }

  // Get all foods
  static async getAllFoods() {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching foods:', error);
      return { data: null, error };
    }
  }

  // Get foods by province
  static async getFoodsByProvince(provinceId) {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('province_id', provinceId)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching foods by province:', error);
      return { data: null, error };
    }
  }

  // Get all activities
  static async getAllActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return { data: null, error };
    }
  }

  // Get activities by province
  static async getActivitiesByProvince(provinceId) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('province_id', provinceId)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching activities by province:', error);
      return { data: null, error };
    }
  }

  // Get complete tourism data by province
  static async getProvinceTourismData(provinceId) {
    try {
      const { data, error } = await supabase
        .rpc('get_province_tourism_data', {
          province_id_param: provinceId
        });
      
      if (error) throw error;
      return { data: data[0] || { attractions: [], foods: [], activities: [] }, error: null };
    } catch (error) {
      console.error('Error fetching province tourism data:', error);
      return { data: { attractions: [], foods: [], activities: [] }, error };
    }
  }

  // Search tourism data
  static async searchTourismData(searchTerm) {
    try {
      const { data, error } = await supabase
        .rpc('search_tourism_data', {
          search_term: searchTerm
        });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error searching tourism data:', error);
      return { data: null, error };
    }
  }

  // Get attractions by type
  static async getAttractionsByType(type) {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .eq('type', type)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching attractions by type:', error);
      return { data: null, error };
    }
  }

  // Get foods by type
  static async getFoodsByType(type) {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .eq('type', type)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching foods by type:', error);
      return { data: null, error };
    }
  }

  // Get activities by type
  static async getActivitiesByType(type) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .eq('type', type)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching activities by type:', error);
      return { data: null, error };
    }
  }

  // Get top rated attractions
  static async getTopRatedAttractions(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .order('rating', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching top rated attractions:', error);
      return { data: null, error };
    }
  }

  // Get attractions by region
  static async getAttractionsByRegion(region) {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .eq('provinces.region', region)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching attractions by region:', error);
      return { data: null, error };
    }
  }

  // Get random attractions for recommendations
  static async getRandomAttractions(limit = 5) {
    try {
      // Get total count first
      const { count } = await supabase
        .from('attractions')
        .select('*', { count: 'exact', head: true });
      
      if (!count || count === 0) {
        return { data: [], error: null };
      }

      // Generate random offset
      const randomOffset = Math.floor(Math.random() * Math.max(0, count - limit));
      
      const { data, error } = await supabase
        .from('attractions')
        .select(`
          *,
          provinces!inner(name, name_en, region)
        `)
        .range(randomOffset, randomOffset + limit - 1);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching random attractions:', error);
      return { data: null, error };
    }
  }

  // Add new attraction
  static async addAttraction(attraction) {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .insert([attraction])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding attraction:', error);
      return { data: null, error };
    }
  }

  // Add new food
  static async addFood(food) {
    try {
      const { data, error } = await supabase
        .from('foods')
        .insert([food])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding food:', error);
      return { data: null, error };
    }
  }

  // Add new activity
  static async addActivity(activity) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding activity:', error);
      return { data: null, error };
    }
  }

  // Parse coordinates from JSON string or object
  static parseCoordinates(coords) {
    if (!coords) return null;
    
    if (typeof coords === 'string') {
      try {
        const parsed = JSON.parse(coords);
        return { lat: parsed.lat, lng: parsed.lng };
      } catch (e) {
        return null;
      }
    }
    
    if (coords.lat && coords.lng) {
      return { lat: coords.lat, lng: coords.lng };
    }
    
    return null;
  }

  // Parse price range from JSON string
  static parsePriceRange(priceRange) {
    if (!priceRange) return null;
    
    if (typeof priceRange === 'string') {
      try {
        return JSON.parse(priceRange);
      } catch (e) {
        return null;
      }
    }
    
    return priceRange;
  }

  // Parse recommended places from JSON string
  static parseRecommendedPlaces(places) {
    if (!places) return [];
    
    if (typeof places === 'string') {
      try {
        return JSON.parse(places);
      } catch (e) {
        return [];
      }
    }
    
    if (Array.isArray(places)) {
      return places;
    }
    
    return [];
  }
}

export default TourismService;