import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkclinxvtsmoqexhzbwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY2xpbnh2dHNtb3FleGh6YndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzU2OTIsImV4cCI6MjA3MjcxMTY5Mn0.aCPCFpBiwae8iUmMdUwTKKpvXeZnaj1wuGO3Ww0BdpM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database service functions
export class DatabaseService {
  // Province services
  static async getProvinces() {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async getProvinceById(id: string) {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Attraction services
  static async getAttractionsByProvince(provinceId: string) {
    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .eq('province_id', provinceId)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Food services
  static async getFoodByProvince(provinceId: string) {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('province_id', provinceId)
      .order('name');
    
    if (error) throw error;
    return data;
  }

  // Activity services
  static async getActivitiesByProvince(provinceId: string) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('province_id', provinceId)
      .order('name');
    
    if (error) throw error;
    return data;
  }

  // Trip services
  static async createTrip(trip: any) {
    const { data, error } = await supabase
      .from('trips')
      .insert([trip])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserTrips(userId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        provinces(name, name_en)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getTripById(tripId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        provinces(name, name_en),
        trip_items(
          *,
          attractions(*),
          foods(*),
          activities(*)
        )
      `)
      .eq('id', tripId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTripByShareCode(shareCode: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        provinces(name, name_en),
        trip_items(
          *,
          attractions(*),
          foods(*),
          activities(*)
        )
      `)
      .eq('share_code', shareCode)
      .eq('is_public', true)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTrip(tripId: string, updates: any) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTrip(tripId: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);
    
    if (error) throw error;
  }

  // Trip items services
  static async addTripItem(tripItem: any) {
    const { data, error } = await supabase
      .from('trip_items')
      .insert([tripItem])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async removeTripItem(itemId: string) {
    const { error } = await supabase
      .from('trip_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
  }
}