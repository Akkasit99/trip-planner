import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Trip, TripItem } from '../types';
import { DatabaseService } from '../services/supabase';

type TripDetailRouteProp = RouteProp<RootStackParamList, 'TripDetail'>;
type TripDetailNavigationProp = StackNavigationProp<RootStackParamList, 'TripDetail'>;

const TripDetailScreen: React.FC = () => {
  const navigation = useNavigation<TripDetailNavigationProp>();
  const route = useRoute<TripDetailRouteProp>();
  const { tripId } = route.params;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockTrip: Trip = {
    id: tripId,
    name: 'ทริปเชียงใหม่ 3 วัน 2 คืน',
    province_id: '2',
    start_date: '2024-12-15',
    end_date: '2024-12-17',
    total_days: 3,
    created_at: '2024-09-06T12:00:00Z',
    updated_at: '2024-09-06T12:00:00Z',
    is_public: false,
    share_code: 'CM2024001',
    items: [
      {
        id: '1',
        type: 'attraction',
        day: 1,
        order: 1,
        item: {
          id: '1',
          province_id: '2',
          name: 'วัดพระธาตุดอยสุเทพ',
          name_en: 'Wat Phra That Doi Suthep',
          type: 'temple',
          description: 'วัดที่มีชื่อเสียงที่สุดของเชียงใหม่',
          image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
          coordinates: { lat: 18.8047, lng: 98.9217 },
          rating: 4.8,
          estimated_duration: 3,
          entrance_fee: 50,
          opening_hours: '06:00 - 18:00',
        },
      },
      {
        id: '2',
        type: 'food',
        day: 1,
        order: 2,
        item: {
          id: '1',
          province_id: '2',
          name: 'ข้าวซอย',
          name_en: 'Khao Soi',
          type: 'local_dish',
          description: 'อาหารพื้นเมืองเชียงใหม่ที่มีชื่อเสียง',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          price_range: { min: 40, max: 80 },
          recommended_places: ['ข้าวซอยแม่สาย', 'ข้าวซอยลำดวน'],
        },
      },
      {
        id: '3',
        type: 'attraction',
        day: 2,
        order: 1,
        item: {
          id: '2',
          province_id: '2',
          name: 'ตลาดวอร์กกิ้งสตรีท',
          name_en: 'Walking Street Market',
          type: 'market',
          description: 'ตลาดเดินคืนวันอาทิตย์',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          coordinates: { lat: 18.7883, lng: 98.9853 },
          rating: 4.5,
          estimated_duration: 4,
          entrance_fee: 0,
          opening_hours: 'วันอาทิตย์ 16:00 - 22:00',
        },
      },
      {
        id: '4',
        type: 'activity',
        day: 3,
        order: 1,
        item: {
          id: '1',
          province_id: '2',
          name: 'ขี่ช้างและอาบน้ำช้าง',
          name_en: 'Elephant Experience',
          type: 'adventure',
          description: 'ประสบการณ์ใกล้ชิดกับช้าง',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          duration: 4,
          difficulty_level: 'easy',
          price_range: { min: 1500, max: 3000 },
          season: 'ตลอดปี',
        },
      },
    ],
  };

  useEffect(() => {
    loadTripDetail();
  }, [tripId]);

  const loadTripDetail = async () => {
    try {
      setLoading(true);
      // ใช้ข้อมูล mock ก่อน
      // const data = await DatabaseService.getTripById(tripId);
      setTrip(mockTrip);
    } catch (error) {
      console.error('Error loading trip detail:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลทริปได้');
    } finally {
      setLoading(false);
    }
  };

  const handleShareTrip = async () => {
    if (!trip?.share_code) return;

    try {
      const shareUrl = `https://your-app.com/shared-trip/${trip.share_code}`;
      const message = `มาดูทริป "${trip.name}" ของฉันสิ! 🎒✈️\n\n${shareUrl}`;
      
      await Share.share({
        message,
        url: shareUrl,
        title: trip.name,
      });
    } catch (error) {
      console.error('Error sharing trip:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const groupItemsByDay = (items: TripItem[]) => {
    const grouped: { [key: number]: TripItem[] } = {};
    
    items.forEach(item => {
      if (!grouped[item.day]) {
        grouped[item.day] = [];
      }
      grouped[item.day].push(item);
    });
    
    // Sort items within each day by order
    Object.keys(grouped).forEach(day => {
      grouped[parseInt(day)].sort((a, b) => a.order - b.order);
    });
    
    return grouped;
  };

  const renderTripItem = (tripItem: TripItem) => {
    const { item, type } = tripItem;
    
    return (
      <View key={tripItem.id} style={styles.tripItemCard}>
        <Image 
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1552550049-db097c9480d1?w=400' }} 
          style={styles.tripItemImage} 
        />
        <View style={styles.tripItemInfo}>
          <View style={styles.tripItemHeader}>
            <Text style={styles.tripItemName}>{item.name}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {type === 'attraction' ? '🏛️ สถานที่' : 
                 type === 'food' ? '🍜 อาหาร' : '🎯 กิจกรรม'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.tripItemDescription}>{item.description}</Text>
          
          <View style={styles.tripItemDetails}>
            {type === 'attraction' && (
              <>
                <Text style={styles.tripItemDetail}>⭐ {(item as any).rating}</Text>
                <Text style={styles.tripItemDetail}>⏱️ {(item as any).estimated_duration} ชม.</Text>
                <Text style={styles.tripItemDetail}>
                  💰 {(item as any).entrance_fee === 0 ? 'ฟรี' : `${(item as any).entrance_fee} บาท`}
                </Text>
              </>
            )}
            
            {type === 'food' && (
              <Text style={styles.tripItemDetail}>
                💰 {(item as any).price_range.min}-{(item as any).price_range.max} บาท
              </Text>
            )}
            
            {type === 'activity' && (
              <>
                <Text style={styles.tripItemDetail}>⏱️ {(item as any).duration} ชม.</Text>
                <Text style={styles.tripItemDetail}>📊 {(item as any).difficulty_level}</Text>
                <Text style={styles.tripItemDetail}>
                  💰 {(item as any).price_range.min}-{(item as any).price_range.max} บาท
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>กำลังโหลดรายละเอียดทริป...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ไม่พบข้อมูลทริป</Text>
      </View>
    );
  }

  const groupedItems = groupItemsByDay(trip.items);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trip Header */}
        <View style={styles.header}>
          <Text style={styles.tripName}>{trip.name}</Text>
          <View style={styles.tripMeta}>
            <Text style={styles.tripDate}>
              📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </Text>
            <Text style={styles.tripDuration}>⏱️ {trip.total_days} วัน</Text>
          </View>
          
          {trip.share_code && (
            <TouchableOpacity style={styles.shareButton} onPress={handleShareTrip}>
              <Text style={styles.shareButtonText}>📤 แชร์ทริป</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Trip Itinerary */}
        <View style={styles.itineraryContainer}>
          <Text style={styles.sectionTitle}>กำหนดการเดินทาง</Text>
          
          {Object.keys(groupedItems)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(day => (
              <View key={day} style={styles.dayContainer}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>วันที่ {day}</Text>
                  <Text style={styles.dayDate}>
                    {formatDate(
                      new Date(
                        new Date(trip.start_date).getTime() + 
                        (parseInt(day) - 1) * 24 * 60 * 60 * 1000
                      ).toISOString().split('T')[0]
                    )}
                  </Text>
                </View>
                
                <View style={styles.dayItems}>
                  {groupedItems[parseInt(day)].map(renderTripItem)}
                </View>
              </View>
            ))
          }
        </View>

        {/* Trip Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>สรุปทริป</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{trip.total_days}</Text>
              <Text style={styles.statLabel}>วัน</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{trip.items.length}</Text>
              <Text style={styles.statLabel}>กิจกรรม</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {trip.items.filter(item => item.type === 'attraction').length}
              </Text>
              <Text style={styles.statLabel}>สถานที่</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {trip.items.filter(item => item.type === 'food').length}
              </Text>
              <Text style={styles.statLabel}>อาหาร</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tripDate: {
    fontSize: 14,
    color: '#64748b',
  },
  tripDuration: {
    fontSize: 14,
    color: '#64748b',
  },
  shareButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itineraryContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  dayDate: {
    fontSize: 14,
    color: '#64748b',
  },
  dayItems: {
    paddingLeft: 16,
  },
  tripItemCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  tripItemImage: {
    width: 80,
    height: 80,
  },
  tripItemInfo: {
    flex: 1,
    padding: 12,
  },
  tripItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tripItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 8,
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '500',
  },
  tripItemDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 18,
  },
  tripItemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tripItemDetail: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default TripDetailScreen;