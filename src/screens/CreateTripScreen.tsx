import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Province, Attraction, Food, Activity, TripItem } from '../types';
import DatePicker from 'react-native-date-picker';

type CreateTripRouteProp = RouteProp<RootStackParamList, 'CreateTrip'>;
type CreateTripNavigationProp = StackNavigationProp<RootStackParamList, 'CreateTrip'>;

const CreateTripScreen: React.FC = () => {
  const navigation = useNavigation<CreateTripNavigationProp>();
  const route = useRoute<CreateTripRouteProp>();
  const { provinceId } = route.params;

  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedItems, setSelectedItems] = useState<TripItem[]>([]);
  const [province, setProvince] = useState<Province | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'attractions' | 'foods' | 'activities'>('attractions');

  // Mock data
  const mockProvince: Province = {
    id: provinceId,
    name: 'เชียงใหม่',
    name_en: 'Chiang Mai',
    region: 'north',
    description: 'ดินแดนแห่งวัฒนธรรมล้านนา',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    coordinates: { lat: 18.7883, lng: 98.9853 },
  };

  const mockAttractions: Attraction[] = [
    {
      id: '1',
      province_id: provinceId,
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
    {
      id: '2',
      province_id: provinceId,
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
  ];

  const mockFoods: Food[] = [
    {
      id: '1',
      province_id: provinceId,
      name: 'ข้าวซอย',
      name_en: 'Khao Soi',
      type: 'local_dish',
      description: 'อาหารพื้นเมืองเชียงใหม่ที่มีชื่อเสียง',
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
      description: 'แกงพื้นเมืองล้านนา',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      price_range: { min: 60, max: 120 },
      recommended_places: ['ร้านอาหารพื้นเมือง'],
    },
  ];

  const mockActivities: Activity[] = [
    {
      id: '1',
      province_id: provinceId,
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
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // ใช้ข้อมูล mock
    setProvince(mockProvince);
    setAttractions(mockAttractions);
    setFoods(mockFoods);
    setActivities(mockActivities);
    
    // ตั้งชื่อทริปเริ่มต้น
    setTripName(`ทริป${mockProvince.name}`);
  };

  const calculateTotalDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleAddItem = (type: 'attraction' | 'food' | 'activity', item: Attraction | Food | Activity) => {
    const newItem: TripItem = {
      id: `${type}_${item.id}_${Date.now()}`,
      type,
      item,
      day: 1, // จะจัดลำดับใหม่ตอนสร้างทริป
      order: selectedItems.length + 1,
    };
    
    setSelectedItems([...selectedItems, newItem]);
    Alert.alert('เพิ่มแล้ว', `เพิ่ม ${item.name} เข้าทริปแล้ว`);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const organizeItemsByDays = (items: TripItem[], totalDays: number) => {
    const itemsPerDay = Math.ceil(items.length / totalDays);
    const organizedItems = items.map((item, index) => ({
      ...item,
      day: Math.floor(index / itemsPerDay) + 1,
      order: (index % itemsPerDay) + 1,
    }));
    
    return organizedItems;
  };

  const handleCreateTrip = async () => {
    if (!tripName.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาใส่ชื่อทริป');
      return;
    }

    if (selectedItems.length === 0) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาเลือกสถานที่หรือกิจกรรมอย่างน้อย 1 รายการ');
      return;
    }

    try {
      const totalDays = calculateTotalDays();
      const organizedItems = organizeItemsByDays(selectedItems, totalDays);
      
      const newTrip = {
        name: tripName,
        province_id: provinceId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_days: totalDays,
        items: organizedItems,
        is_public: false,
        share_code: `TR${Date.now().toString().slice(-6)}`,
      };

      // await DatabaseService.createTrip(newTrip);
      
      Alert.alert(
        'สร้างทริปสำเร็จ!',
        `สร้างทริป "${tripName}" เรียบร้อยแล้ว`,
        [
          {
            text: 'ตกลง',
            onPress: () => navigation.navigate('MyTrips'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถสร้างทริปได้');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderItemList = () => {
    let items: (Attraction | Food | Activity)[] = [];
    
    switch (activeTab) {
      case 'attractions':
        items = attractions;
        break;
      case 'foods':
        items = foods;
        break;
      case 'activities':
        items = activities;
        break;
    }

    return items.map((item) => {
      const isSelected = selectedItems.some(selected => 
        selected.type === activeTab.slice(0, -1) && selected.item.id === item.id
      );

      return (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            
            {activeTab === 'attractions' && (
              <Text style={styles.itemDetail}>
                ⭐ {(item as Attraction).rating} | ⏱️ {(item as Attraction).estimated_duration} ชม.
              </Text>
            )}
            
            {activeTab === 'foods' && (
              <Text style={styles.itemDetail}>
                💰 {(item as Food).price_range.min}-{(item as Food).price_range.max} บาท
              </Text>
            )}
            
            {activeTab === 'activities' && (
              <Text style={styles.itemDetail}>
                ⏱️ {(item as Activity).duration} ชม. | 📊 {(item as Activity).difficulty_level}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.addButton, isSelected && styles.addButtonSelected]}
            onPress={() => {
              if (isSelected) {
                const selectedItem = selectedItems.find(selected => 
                  selected.type === activeTab.slice(0, -1) && selected.item.id === item.id
                );
                if (selectedItem) {
                  handleRemoveItem(selectedItem.id);
                }
              } else {
                handleAddItem(activeTab.slice(0, -1) as any, item);
              }
            }}
          >
            <Text style={[styles.addButtonText, isSelected && styles.addButtonTextSelected]}>
              {isSelected ? '✓' : '+'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trip Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลทริป</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ชื่อทริป</Text>
            <TextInput
              style={styles.textInput}
              value={tripName}
              onChangeText={setTripName}
              placeholder="ใส่ชื่อทริป"
            />
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.inputLabel}>วันที่เริ่มต้น</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateItem}>
              <Text style={styles.inputLabel}>วันที่สิ้นสุด</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.tripSummary}>
            รวม {calculateTotalDays()} วัน | เลือกแล้ว {selectedItems.length} รายการ
          </Text>
        </View>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>รายการที่เลือก</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedItems.map((item) => (
                <View key={item.id} style={styles.selectedItem}>
                  <Text style={styles.selectedItemName}>{item.item.name}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'attractions' && styles.activeTab]}
            onPress={() => setActiveTab('attractions')}
          >
            <Text style={[styles.tabText, activeTab === 'attractions' && styles.activeTabText]}>
              สถานที่
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'foods' && styles.activeTab]}
            onPress={() => setActiveTab('foods')}
          >
            <Text style={[styles.tabText, activeTab === 'foods' && styles.activeTabText]}>
              อาหาร
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

        {/* Items List */}
        <View style={styles.itemsList}>
          {renderItemList()}
        </View>
      </ScrollView>

      {/* Create Trip Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.createTripButton} onPress={handleCreateTrip}>
          <Text style={styles.createTripButtonText}>สร้างทริป</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <Modal visible={showStartDatePicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.datePickerContainer}>
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
              mode="date"
              locale="th"
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowStartDatePicker(false)}
            >
              <Text style={styles.datePickerButtonText}>ตกลง</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showEndDatePicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.datePickerContainer}>
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
              mode="date"
              locale="th"
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowEndDatePicker(false)}
            >
              <Text style={styles.datePickerButtonText}>ตกลง</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  tripSummary: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedItemName: {
    fontSize: 12,
    color: '#1e40af',
    marginRight: 8,
  },
  removeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  itemsList: {
    backgroundColor: '#fff',
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: '#9ca3af',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonSelected: {
    backgroundColor: '#10b981',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButtonTextSelected: {
    fontSize: 16,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  datePickerButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateTripScreen;