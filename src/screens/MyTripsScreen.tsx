import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Trip } from '../types';
import { DatabaseService } from '../services/supabase';

type MyTripsNavigationProp = StackNavigationProp<RootStackParamList, 'MyTrips'>;

const MyTripsScreen: React.FC = () => {
  const navigation = useNavigation<MyTripsNavigationProp>();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data สำหรับทริปตัวอย่าง
  const mockTrips: Trip[] = [
    {
      id: '1',
      name: 'ทริปเชียงใหม่ 3 วัน 2 คืน',
      province_id: '2',
      start_date: '2024-12-15',
      end_date: '2024-12-17',
      total_days: 3,
      items: [],
      created_at: '2024-09-06T12:00:00Z',
      updated_at: '2024-09-06T12:00:00Z',
      is_public: false,
      share_code: 'CM2024001',
    },
    {
      id: '2',
      name: 'เที่ยวภูเก็ต สุดฟิน',
      province_id: '3',
      start_date: '2024-12-20',
      end_date: '2024-12-24',
      total_days: 5,
      items: [],
      created_at: '2024-09-05T10:30:00Z',
      updated_at: '2024-09-05T10:30:00Z',
      is_public: true,
      share_code: 'PK2024002',
    },
    {
      id: '3',
      name: 'กรุงเทพฯ วันหยุดสั้น',
      province_id: '1',
      start_date: '2024-12-10',
      end_date: '2024-12-11',
      total_days: 2,
      items: [],
      created_at: '2024-09-04T15:45:00Z',
      updated_at: '2024-09-04T15:45:00Z',
      is_public: false,
    },
  ];

  const provinceImages: { [key: string]: string } = {
    '1': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    '2': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    '3': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400',
  };

  const provinceNames: { [key: string]: string } = {
    '1': 'กรุงเทพมหานคร',
    '2': 'เชียงใหม่',
    '3': 'ภูเก็ต',
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTrips();
    }, [])
  );

  const loadTrips = async () => {
    try {
      setLoading(true);
      // ใช้ข้อมูล mock ก่อน
      // const userId = 'current-user-id'; // จะได้จาก auth context
      // const data = await DatabaseService.getUserTrips(userId);
      setTrips(mockTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลทริปได้');
    } finally {
      setLoading(false);
    }
  };

  const handleTripPress = (tripId: string) => {
    navigation.navigate('TripDetail', { tripId });
  };

  const handleDeleteTrip = (tripId: string, tripName: string) => {
    Alert.alert(
      'ลบทริป',
      `คุณต้องการลบทริป "${tripName}" หรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            try {
              // await DatabaseService.deleteTrip(tripId);
              setTrips(trips.filter(trip => trip.id !== tripId));
              Alert.alert('สำเร็จ', 'ลบทริปเรียบร้อยแล้ว');
            } catch (error) {
              console.error('Error deleting trip:', error);
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบทริปได้');
            }
          },
        },
      ]
    );
  };

  const handleShareTrip = (trip: Trip) => {
    if (trip.share_code) {
      Alert.alert(
        'แชร์ทริป',
        `รหัสแชร์: ${trip.share_code}\n\nคุณสามารถแชร์รหัสนี้ให้เพื่อนเพื่อดูทริปของคุณได้`,
        [
          { text: 'ตกลง' },
          {
            text: 'คัดลอก',
            onPress: () => {
              // Clipboard.setString(trip.share_code!);
              Alert.alert('คัดลอกแล้ว', 'คัดลอกรหัสแชร์เรียบร้อยแล้ว');
            },
          },
        ]
      );
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

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => handleTripPress(item.id)}
    >
      <Image
        source={{ uri: provinceImages[item.province_id] || 'https://images.unsplash.com/photo-1552550049-db097c9480d1?w=400' }}
        style={styles.tripImage}
      />
      <View style={styles.tripInfo}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripName}>{item.name}</Text>
          <View style={styles.tripActions}>
            {item.share_code && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShareTrip(item)}
              >
                <Text style={styles.actionButtonText}>📤</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteTrip(item.id, item.name)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.provinceName}>
          📍 {provinceNames[item.province_id] || 'ไม่ระบุจังหวัด'}
        </Text>
        
        <View style={styles.tripDetails}>
          <Text style={styles.tripDate}>
            📅 {formatDate(item.start_date)} - {formatDate(item.end_date)}
          </Text>
          <Text style={styles.tripDuration}>
            ⏱️ {item.total_days} วัน
          </Text>
        </View>
        
        <View style={styles.tripMeta}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.is_public ? '🌐 สาธารณะ' : '🔒 ส่วนตัว'}
            </Text>
          </View>
          {item.share_code && (
            <View style={styles.shareCodeBadge}>
              <Text style={styles.shareCodeText}>รหัส: {item.share_code}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✈️</Text>
      <Text style={styles.emptyTitle}>ยังไม่มีทริป</Text>
      <Text style={styles.emptyDescription}>
        เริ่มสร้างทริปแรกของคุณกันเถอะ!
      </Text>
      <TouchableOpacity
        style={styles.createFirstTripButton}
        onPress={() => navigation.navigate('ProvinceSelection')}
      >
        <Text style={styles.createFirstTripButtonText}>สร้างทริปแรก</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>กำลังโหลดทริปของคุณ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ทริปของฉัน</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProvinceSelection')}
        >
          <Text style={styles.addButtonText}>+ เพิ่มทริป</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.tripList,
          trips.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tripList: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripImage: {
    width: '100%',
    height: 120,
  },
  tripInfo: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tripName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 12,
  },
  tripActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  provinceName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 12,
    color: '#64748b',
  },
  tripDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
  shareCodeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shareCodeText: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstTripButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  createFirstTripButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyTripsScreen;