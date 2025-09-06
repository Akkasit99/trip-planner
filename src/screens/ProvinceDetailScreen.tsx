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
import { RootStackParamList, Province, Attraction, Food, Activity } from '../types';
import { DatabaseService } from '../services/supabase';

type ProvinceDetailRouteProp = RouteProp<RootStackParamList, 'ProvinceDetail'>;
type ProvinceDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProvinceDetail'
>;

const ProvinceDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProvinceDetailNavigationProp>();
  const route = useRoute<ProvinceDetailRouteProp>();
  const { provinceId } = route.params;

  const [province, setProvince] = useState<Province | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'attractions' | 'foods' | 'activities'>('attractions');

  // Mock data
  const mockProvince: Province = {
    id: provinceId,
    name: 'เชียงใหม่',
    name_en: 'Chiang Mai',
    region: 'north',
    description: 'ดินแดนแห่งวัฒนธรรมล้านนาและธรรมชาติที่สวยงาม เต็มไปด้วยวัด โบราณสถาน และภูเขาที่งดงาม',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    coordinates: { lat: 18.7883, lng: 98.9853 },
  };

  const mockAttractions: Attraction[] = [
    {
      id: '1',
      province_id: provinceId,
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
    {
      id: '2',
      province_id: provinceId,
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
  ];

  const mockFoods: Food[] = [
    {
      id: '1',
      province_id: provinceId,
      name: 'ข้าวซอย',
      name_en: 'Khao Soi',
      type: 'local_dish',
      description: 'อาหารพื้นเมืองเชียงใหม่ที่มีชื่อเสียง เส้นใหญ่ในน้ำแกงกะทิ',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      price_range: { min: 40, max: 80 },
      recommended_places: ['ข้าวซอยแม่สาย', 'ข้าวซอยลำดวน'],
    },
    {
      id: '2',
      province_id: provinceId,
      name: 'แกงฮังเล',
      name_en: 'Gaeng Hang Le',
      type: 'local_dish',
      description: 'แกงพื้นเมืองล้านนา รสชาติเข้มข้น หวานนิดๆ',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      price_range: { min: 60, max: 120 },
      recommended_places: ['ร้านอาหารพื้นเมือง', 'ตลาดต้นผยอง'],
    },
  ];

  const mockActivities: Activity[] = [
    {
      id: '1',
      province_id: provinceId,
      name: 'ขี่ช้างและอาบน้ำช้าง',
      name_en: 'Elephant Riding and Bathing',
      type: 'adventure',
      description: 'ประสบการณ์ใกล้ชิดกับช้างในสภาพแวดล้อมธรรมชาติ',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      duration: 4,
      difficulty_level: 'easy',
      price_range: { min: 1500, max: 3000 },
      season: 'ตลอดปี',
    },
    {
      id: '2',
      province_id: provinceId,
      name: 'เที่ยวดอยอินทนนท์',
      name_en: 'Doi Inthanon National Park',
      type: 'hiking',
      description: 'ยอดเขาที่สูงที่สุดในประเทศไทย ชมพระอาทิตย์ขึ้น',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      duration: 8,
      difficulty_level: 'medium',
      price_range: { min: 800, max: 1500 },
      season: 'ตุลาคม - กุมภาพันธ์',
    },
  ];

  useEffect(() => {
    loadProvinceData();
  }, [provinceId]);

  const loadProvinceData = async () => {
    try {
      setLoading(true);
      // ใช้ข้อมูล mock ก่อน
      setProvince(mockProvince);
      setAttractions(mockAttractions);
      setFoods(mockFoods);
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading province data:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    navigation.navigate('CreateTrip', { provinceId });
  };

  const renderAttractionItem = (item: Attraction) => (
    <View key={item.id} style={styles.itemCard}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemNameEn}>{item.name_en}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>⭐ {item.rating}</Text>
          <Text style={styles.itemDetail}>⏱️ {item.estimated_duration} ชม.</Text>
          <Text style={styles.itemDetail}>💰 {item.entrance_fee === 0 ? 'ฟรี' : `${item.entrance_fee} บาท`}</Text>
        </View>
      </View>
    </View>
  );

  const renderFoodItem = (item: Food) => (
    <View key={item.id} style={styles.itemCard}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemNameEn}>{item.name_en}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>💰 {item.price_range.min}-{item.price_range.max} บาท</Text>
        </View>
        <Text style={styles.recommendedPlaces}>
          แนะนำ: {item.recommended_places.join(', ')}
        </Text>
      </View>
    </View>
  );

  const renderActivityItem = (item: Activity) => (
    <View key={item.id} style={styles.itemCard}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemNameEn}>{item.name_en}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>⏱️ {item.duration} ชม.</Text>
          <Text style={styles.itemDetail}>📊 {item.difficulty_level}</Text>
          <Text style={styles.itemDetail}>💰 {item.price_range.min}-{item.price_range.max} บาท</Text>
        </View>
        <Text style={styles.seasonText}>ฤดูกาล: {item.season}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!province) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ไม่พบข้อมูลจังหวัด</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: province.image_url }} style={styles.headerImage} />
          <View style={styles.headerOverlay}>
            <Text style={styles.provinceName}>{province.name}</Text>
            <Text style={styles.provinceNameEn}>{province.name_en}</Text>
          </View>
        </View>

        {/* Province Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.description}>{province.description}</Text>
          
          <TouchableOpacity style={styles.createTripButton} onPress={handleCreateTrip}>
            <Text style={styles.createTripButtonText}>สร้างทริปในจังหวัดนี้</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'attractions' && styles.activeTab]}
            onPress={() => setActiveTab('attractions')}
          >
            <Text style={[styles.tabText, activeTab === 'attractions' && styles.activeTabText]}>
              สถานที่ท่องเที่ยว
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'foods' && styles.activeTab]}
            onPress={() => setActiveTab('foods')}
          >
            <Text style={[styles.tabText, activeTab === 'foods' && styles.activeTabText]}>
              อาหารท้องถิ่น
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
            onPress={() => setActiveTab('activities')}
          >
            <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
              กิจกรรม
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'attractions' && attractions.map(renderAttractionItem)}
          {activeTab === 'foods' && foods.map(renderFoodItem)}
          {activeTab === 'activities' && activities.map(renderActivityItem)}
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
  headerContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  provinceName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  provinceNameEn: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  createTripButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createTripButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  itemCard: {
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
  itemImage: {
    width: '100%',
    height: 160,
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemNameEn: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  itemDetail: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  recommendedPlaces: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
  },
  seasonText: {
    fontSize: 12,
    color: '#7c3aed',
    fontStyle: 'italic',
  },
});

export default ProvinceDetailScreen;