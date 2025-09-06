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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Trip, TripItem } from '../types';
import { DatabaseService } from '../services/supabase';

type SharedTripRouteProp = RouteProp<RootStackParamList, 'SharedTrip'>;
type SharedTripNavigationProp = StackNavigationProp<RootStackParamList, 'SharedTrip'>;

const SharedTripScreen: React.FC = () => {
  const navigation = useNavigation<SharedTripNavigationProp>();
  const route = useRoute<SharedTripRouteProp>();
  const { shareCode } = route.params;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data สำหรับทริปที่แชร์
  const mockSharedTrip: Trip = {
    id: 'shared-1',
    name: 'ทริปเชียงใหม่สุดฟิน 🌸',
    province_id: '2',
    start_date: '2024-12-15',
    end_date: '2024-12-17',
    total_days: 3,
    created_at: '2024-09-06T12:00:00Z',
    updated_at: '2024-09-06T12:00:00Z',
    is_public: true,
    share_code: shareCode,
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
          description: 'วัดที่มีชื่อเสียงที่สุดของเชียงใหม่ ตั้งอยู่บนยอดดอยสุเทพ',
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
          description: 'อาหารพื้นเมืองเชียงใหม่ที่มีชื่อเสียง เส้นใหญ่ในน้ำแกงกะทิ',
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
          description: 'ตลาดเดินคืนวันอาทิตย์ที่มีชื่อเสียงของเชียงใหม่',
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
        day: 2,
        order: 2,
        item: {
          id: '1',
          province_id: '2',
          name: 'ขี่ช้างและอาบน้ำช้าง',
          name_en: 'Elephant Experience',
          type: 'adventure',
          description: 'ประสบการณ์ใกล้ชิดกับช้างในสภาพแวดล้อมธรรมชาติ',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          duration: 4,
          difficulty_level: 'easy',
          price_range: { min: 1500, max: 3000 },
          season: 'ตลอดปี',
        },
      },
      {
        id: '5',
        type: 'food',
        day: 3,
        order: 1,
        item: {
          id: '2',
          province_id: '2',
          name: 'แกงฮังเล',
          name_en: 'Gaeng Hang Le',
          type: 'local_dish',
          description: 'แกงพื้นเมืองล้านนา รสชาติเข้มข้น หวานนิดๆ',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          price_range: { min: 60, max: 120 },
          recommended_places: ['ร้านอาหารพื้นเมือง', 'ตลาดต้นผยอง'],
        },
      },
    ],
  };

  useEffect(() => {
    loadSharedTrip();
  }, [shareCode]);

  const loadSharedTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ตรวจสอบว่า shareCode ถูกต้องหรือไม่
      if (!shareCode || shareCode.length < 6) {
        setError('รหัสแชร์ไม่ถูกต้อง');
        return;
      }
      
      // ใช้ข้อมูล mock ก่อน
      // const data = await DatabaseService.getTripByShareCode(shareCode);
      
      // จำลองการตรวจสอบรหัสแชร์
      if (shareCode === 'CM2024001' || shareCode === 'DEMO123') {
        setTrip(mockSharedTrip);
      } else {
        setError('ไม่พบทริปที่ต้องการ หรือทริปนี้ไม่ได้เปิดให้สาธารณะ');
      }
    } catch (error) {
      console.error('Error loading shared trip:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = () => {
    if (!trip) return;
    
    Alert.alert(
      'คัดลอกทริป',
      'คุณต้องการคัดลอกทริปนี้ไปยังบัญชีของคุณหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'คัดลอก',
          onPress: () => {
            // สร้างทริปใหม่จากทริปที่แชร์
            Alert.alert('สำเร็จ', 'คัดลอกทริปเรียบร้อยแล้ว');
            navigation.navigate('MyTrips');
          },
        },
      ]
    );
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
        <Text style={styles.loadingText}>กำลังโหลดทริปที่แชร์...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>😔</Text>
        <Text style={styles.errorTitle}>ไม่พบทริป</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>กลับ</Text>
        </TouchableOpacity>
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
        {/* Shared Trip Header */}
        <View style={styles.header}>
          <View style={styles.sharedBadge}>
            <Text style={styles.sharedBadgeText}>🌐 ทริปที่แชร์</Text>
          </View>
          
          <Text style={styles.tripName}>{trip.name}</Text>
          <View style={styles.tripMeta}>
            <Text style={styles.tripDate}>
              📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </Text>
            <Text style={styles.tripDuration}>⏱️ {trip.total_days} วัน</Text>
          </View>
          
          <View style={styles.shareInfo}>
            <Text style={styles.shareCode}>รหัสแชร์: {trip.share_code}</Text>
          </View>
          
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyTrip}>
            <Text style={styles.copyButtonText}>📋 คัดลอกทริปนี้</Text>
          </TouchableOpacity>
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

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>ชอบทริปนี้ใช่ไหม? 🤔</Text>
          <Text style={styles.ctaDescription}>
            คัดลอกทริปนี้ไปยังบัญชีของคุณ แล้วปรับแต่งตามใจชอบได้เลย!
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleCopyTrip}>
            <Text style={styles.ctaButtonText}>คัดลอกทริปนี้</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sharedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  sharedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 14,
    color: '#64748b',
  },
  tripDuration: {
    fontSize: 14,
    color: '#64748b',
  },
  shareInfo: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  shareCode: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
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
    borderBottomColor: '#10b981',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
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
    borderLeftColor: '#10b981',
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
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    color: '#16a34a',
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
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  ctaContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SharedTripScreen;