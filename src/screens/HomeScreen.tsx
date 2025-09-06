import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const popularProvinces = [
    {
      id: '1',
      name: 'กรุงเทพมหานคร',
      name_en: 'Bangkok',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      description: 'เมืองหลวงที่เต็มไปด้วยวัฒนธรรมและความทันสมัย',
    },
    {
      id: '2',
      name: 'เชียงใหม่',
      name_en: 'Chiang Mai',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      description: 'ดินแดนแห่งวัฒนธรรมล้านนาและธรรมชาติ',
    },
    {
      id: '3',
      name: 'ภูเก็ต',
      name_en: 'Phuket',
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400',
      description: 'มุกดาหารแห่งอันดามันที่สวยงาม',
    },
    {
      id: '4',
      name: 'กระบี่',
      name_en: 'Krabi',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
      description: 'หาดทรายขาวและหน้าผาหินปูนสุดงาม',
    },
  ];

  const handleProvincePress = (provinceId: string) => {
    navigation.navigate('ProvinceDetail', { provinceId });
  };

  const handleExploreAllPress = () => {
    navigation.navigate('ProvinceSelection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>สวัสดี! 👋</Text>
          <Text style={styles.headerSubtitle}>
            วันนี้อยากไปเที่ยวที่ไหนดี?
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1552550049-db097c9480d1?w=800',
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>ค้นพบเสน่ห์ไทย</Text>
            <Text style={styles.heroSubtitle}>
              จัดทริปท่องเที่ยวในประเทศไทยได้ง่ายๆ
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={handleExploreAllPress}
            >
              <Text style={styles.heroButtonText}>เริ่มสำรวจ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>จังหวัดยอดนิยม</Text>
            <TouchableOpacity onPress={handleExploreAllPress}>
              <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {popularProvinces.map((province) => (
              <TouchableOpacity
                key={province.id}
                style={styles.provinceCard}
                onPress={() => handleProvincePress(province.id)}
              >
                <Image
                  source={{ uri: province.image }}
                  style={styles.provinceImage}
                />
                <View style={styles.provinceInfo}>
                  <Text style={styles.provinceName}>{province.name}</Text>
                  <Text style={styles.provinceDescription}>
                    {province.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ฟีเจอร์เด่น</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <Text style={styles.featureTitle}>เลือกจังหวัด</Text>
              <Text style={styles.featureDescription}>
                เลือกจังหวัดที่อยากไป
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureTitle}>จัดแผนทริป</Text>
              <Text style={styles.featureDescription}>
                สร้างแผนการเดินทางส่วนตัว
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🍜</Text>
              <Text style={styles.featureTitle}>อาหารท้องถิ่น</Text>
              <Text style={styles.featureDescription}>
                ค้นหาอาหารขึ้นชื่อ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureTitle}>กิจกรรมสนุก</Text>
              <Text style={styles.featureDescription}>
                กิจกรรมยอดฮิตในแต่ละจังหวัด
              </Text>
            </TouchableOpacity>
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  heroSection: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  provinceCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  provinceImage: {
    width: '100%',
    height: 160,
  },
  provinceInfo: {
    padding: 16,
  },
  provinceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  provinceDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default HomeScreen;