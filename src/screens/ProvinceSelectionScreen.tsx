import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Province } from '../types';
import { DatabaseService } from '../services/supabase';

type ProvinceSelectionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProvinceSelection'
>;

const ProvinceSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ProvinceSelectionNavigationProp>();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // ข้อมูลจังหวัดตัวอย่าง (จะถูกแทนที่ด้วยข้อมูลจาก Supabase)
  const mockProvinces: Province[] = [
    {
      id: '1',
      name: 'กรุงเทพมหานคร',
      name_en: 'Bangkok',
      region: 'central',
      description: 'เมืองหลวงที่เต็มไปด้วยวัฒนธรรมและความทันสมัย',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      coordinates: { lat: 13.7563, lng: 100.5018 },
    },
    {
      id: '2',
      name: 'เชียงใหม่',
      name_en: 'Chiang Mai',
      region: 'north',
      description: 'ดินแดนแห่งวัฒนธรรมล้านนาและธรรมชาติ',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      coordinates: { lat: 18.7883, lng: 98.9853 },
    },
    {
      id: '3',
      name: 'ภูเก็ต',
      name_en: 'Phuket',
      region: 'south',
      description: 'มุกดาหารแห่งอันดามันที่สวยงาม',
      image_url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400',
      coordinates: { lat: 7.8804, lng: 98.3923 },
    },
    {
      id: '4',
      name: 'กระบี่',
      name_en: 'Krabi',
      region: 'south',
      description: 'หาดทรายขาวและหน้าผาหินปูนสุดงาม',
      image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
      coordinates: { lat: 8.0863, lng: 98.9063 },
    },
    {
      id: '5',
      name: 'เชียงราย',
      name_en: 'Chiang Rai',
      region: 'north',
      description: 'ดินแดนสามเหลี่ยมทองคำและวัดขาว',
      image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
      coordinates: { lat: 19.9105, lng: 99.8406 },
    },
    {
      id: '6',
      name: 'อยุธยา',
      name_en: 'Ayutthaya',
      region: 'central',
      description: 'อดีตราชธานีที่เต็มไปด้วยโบราณสถาน',
      image_url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
      coordinates: { lat: 14.3692, lng: 100.5877 },
    },
    {
      id: '7',
      name: 'สุราษฎร์ธานี',
      name_en: 'Surat Thani',
      region: 'south',
      description: 'ประตูสู่เกาะสมุย เกาะพะงัน และเกาะเต่า',
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      coordinates: { lat: 9.1382, lng: 99.3215 },
    },
    {
      id: '8',
      name: 'ขอนแก่น',
      name_en: 'Khon Kaen',
      region: 'northeast',
      description: 'หัวใจของภาคอีสานที่เต็มไปด้วยวัฒนธรรม',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      coordinates: { lat: 16.4322, lng: 102.8236 },
    },
  ];

  const regions = [
    { key: 'all', name: 'ทั้งหมด' },
    { key: 'north', name: 'ภาคเหนือ' },
    { key: 'northeast', name: 'ภาคอีสาน' },
    { key: 'central', name: 'ภาคกลาง' },
    { key: 'south', name: 'ภาคใต้' },
  ];

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    filterProvinces();
  }, [provinces, searchQuery, selectedRegion]);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      // ใช้ข้อมูล mock ก่อน จนกว่าจะตั้งค่า Supabase เสร็จ
      // const data = await DatabaseService.getProvinces();
      setProvinces(mockProvinces);
    } catch (error) {
      console.error('Error loading provinces:', error);
      // ใช้ข้อมูล mock เมื่อเกิดข้อผิดพลาด
      setProvinces(mockProvinces);
    } finally {
      setLoading(false);
    }
  };

  const filterProvinces = () => {
    let filtered = provinces;

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(province => province.region === selectedRegion);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(province =>
        province.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        province.name_en.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProvinces(filtered);
  };

  const handleProvincePress = (provinceId: string) => {
    navigation.navigate('ProvinceDetail', { provinceId });
  };

  const renderProvinceItem = ({ item }: { item: Province }) => (
    <TouchableOpacity
      style={styles.provinceCard}
      onPress={() => handleProvincePress(item.id)}
    >
      <Image source={{ uri: item.image_url }} style={styles.provinceImage} />
      <View style={styles.provinceInfo}>
        <Text style={styles.provinceName}>{item.name}</Text>
        <Text style={styles.provinceNameEn}>{item.name_en}</Text>
        <Text style={styles.provinceDescription}>{item.description}</Text>
        <View style={styles.regionBadge}>
          <Text style={styles.regionText}>
            {regions.find(r => r.key === item.region)?.name || item.region}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRegionFilter = ({ item }: { item: { key: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.regionButton,
        selectedRegion === item.key && styles.regionButtonActive,
      ]}
      onPress={() => setSelectedRegion(item.key)}
    >
      <Text
        style={[
          styles.regionButtonText,
          selectedRegion === item.key && styles.regionButtonTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูลจังหวัด...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาจังหวัด..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Region Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={regions}
          renderItem={renderRegionFilter}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionList}
        />
      </View>

      {/* Province List */}
      <FlatList
        data={filteredProvinces}
        renderItem={renderProvinceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.provinceList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
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
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  regionList: {
    paddingRight: 16,
  },
  regionButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  regionButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  regionButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  regionButtonTextActive: {
    color: '#fff',
  },
  provinceList: {
    padding: 16,
  },
  provinceCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 4,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  provinceImage: {
    width: '100%',
    height: 120,
  },
  provinceInfo: {
    padding: 12,
  },
  provinceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  provinceNameEn: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  provinceDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 8,
  },
  regionBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  regionText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
});

export default ProvinceSelectionScreen;