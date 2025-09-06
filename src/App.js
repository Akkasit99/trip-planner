import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import TourismService from './services/tourismService';

// Fallback mock data (used only when Supabase fails)
const mockAttractions = [
  { id: '1', name: 'วัดพระแก้ว', name_en: 'Temple of the Emerald Buddha', type: 'temple', description: 'วัดที่สำคัญที่สุดในประเทศไทย ประดิษฐานพระแก้วมรกต', coordinates: { lat: 13.7515, lng: 100.4927 }, rating: 4.8, estimated_duration: 2, entrance_fee: 500, opening_hours: '08:30 - 15:30', province_id: '1', province_name: 'กรุงเทพมหานคร' },
  { id: '2', name: 'วัดพระธาตุดอยสุเทพ', name_en: 'Wat Phra That Doi Suthep', type: 'temple', description: 'วัดที่มีชื่อเสียงที่สุดของเชียงใหม่ ตั้งอยู่บนยอดดอยสุเทพ', coordinates: { lat: 18.8047, lng: 98.9217 }, rating: 4.8, estimated_duration: 3, entrance_fee: 50, opening_hours: '06:00 - 18:00', province_id: '2', province_name: 'เชียงใหม่' },
  { id: '3', name: 'หาดป่าตอง', name_en: 'Patong Beach', type: 'beach', description: 'หาดที่มีชื่อเสียงที่สุดของภูเก็ต', coordinates: { lat: 7.8971, lng: 98.2966 }, rating: 4.3, estimated_duration: 4, entrance_fee: 0, opening_hours: '24 ชั่วโมง', province_id: '3', province_name: 'ภูเก็ต' }
];

const mockFoods = [
  { id: '1', name: 'ผัดไทย', name_en: 'Pad Thai', type: 'local_dish', description: 'เส้นผัดรสชาติหวานเปรี้ยว อาหารไทยที่มีชื่อเสียงระดับโลก', price_range: '{"min": 40, "max": 120}', recommended_places: '["ร้านผัดไทยท่าเตียน", "ผัดไทยเจ๊แดง", "ตลาดจตุจักร"]', province_id: '1', province_name: 'กรุงเทพมหานคร' },
  { id: '2', name: 'ข้าวซอย', name_en: 'Khao Soi', type: 'local_dish', description: 'อาหารพื้นเมืองเชียงใหม่ที่มีชื่อเสียง เส้นใหญ่ในน้ำแกงกะทิ', price_range: '{"min": 40, "max": 80}', recommended_places: '["ข้าวซอยแม่สาย", "ข้าวซอยลำดวน", "ข้าวซอยนิมมาน"]', province_id: '2', province_name: 'เชียงใหม่' }
];

const mockActivities = [
  { id: '1', name: 'ล่องเรือแม่น้ำเจ้าพระยา', name_en: 'Chao Phraya River Cruise', type: 'cultural', description: 'ชมวิวกรุงเทพฯ จากมุมมองบนแม่น้ำเจ้าพระยา', coordinates: { lat: 13.7563, lng: 100.5018 }, duration: 2, difficulty_level: 'easy', price_range: '{"min": 100, "max": 500}', season: 'ตลอดปี', province_id: '1', province_name: 'กรุงเทพมหานคร' },
  { id: '2', name: 'ดำน้ำดูปะการัง', name_en: 'Snorkeling', type: 'diving', description: 'ดำน้ำชมปะการังและสัตว์น้ำสีสันสวยงาม', coordinates: { lat: 7.8804, lng: 98.3923 }, duration: 6, difficulty_level: 'easy', price_range: '{"min": 1500, "max": 3500}', season: 'พฤศจิกายน - เมษายน', province_id: '3', province_name: 'ภูเก็ต' }
];

// Mock data สำหรับจังหวัด
const mockProvinces = [
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
  }
];

function App() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [showMap, setShowMap] = useState(false);
  
  // Data from Supabase
  const [provinces, setProvinces] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoadError, setDataLoadError] = useState(null);
  
  // Trip management states
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem('thai-trip-app-trips');
    return savedTrips ? JSON.parse(savedTrips) : [];
  });
  const [currentTrip, setCurrentTrip] = useState(null);
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedItems = localStorage.getItem('thai-trip-app-selected-items');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  // Create trip form states
  const [tripName, setTripName] = useState('');
  const [tripDays, setTripDays] = useState(3);
  

  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Random trip generator data
  const [randomTrips, setRandomTrips] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '' });
  
  // Generate random trip for a province
  const generateRandomTrip = (province) => {
    const provinceAttractions = attractions.filter(a => a.province_id === province.id);
    const provinceFoods = foods.filter(f => f.province_id === province.id);
    const provinceActivities = activities.filter(a => a.province_id === province.id);
    
    // Randomly select items (1-2 attractions, 1-2 foods, 1 activity)
    const selectedAttractions = provinceAttractions
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);
    
    const selectedFoods = provinceFoods
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);
    
    const selectedActivities = provinceActivities
      .sort(() => 0.5 - Math.random())
      .slice(0, 1);
    
    const allItems = [
      ...selectedAttractions.map(item => ({ ...item, type: 'attraction' })),
      ...selectedFoods.map(item => ({ ...item, type: 'food' })),
      ...selectedActivities.map(item => ({ ...item, type: 'activity' }))
    ];
    
    const days = Math.min(Math.max(Math.ceil(allItems.length / 2), 1), 4);
    
    return {
      id: `random-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `ทริป${province.name} ${days} วัน`,
      province: province.name,
      days: days,
      items: allItems,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 200) + 20,
      createdAt: new Date().toISOString(),
      isRandom: true
    };
  };
  
  // Generate random trips for available provinces
  useEffect(() => {
    if (provinces.length > 0 && attractions.length > 0 && foods.length > 0 && activities.length > 0) {
      const shuffledProvinces = provinces.sort(() => 0.5 - Math.random());
      const trips = shuffledProvinces.slice(0, 4).map(province => generateRandomTrip(province));
      setRandomTrips(trips);
    }
  }, [provinces, attractions, foods, activities]);

  // Save trips to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem('thai-trip-app-trips', JSON.stringify(trips));
  }, [trips]);

  // Save selected items to localStorage whenever selectedItems change
  useEffect(() => {
    localStorage.setItem('thai-trip-app-selected-items', JSON.stringify(selectedItems));
  }, [selectedItems]);

  // Load data from Supabase on component mount
  useEffect(() => {
    loadSupabaseData();
    
    // Check for shared trip in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTripData = urlParams.get('shared');
    
    if (sharedTripData) {
      try {
        // Fix for Thai characters: decode base64 first, then decode URI
        const decodedString = decodeURIComponent(atob(sharedTripData));
        const tripData = JSON.parse(decodedString);
        // Add shared trip to trips list
        setTrips(prev => {
          const existingTrip = prev.find(trip => trip.id === tripData.id);
          if (!existingTrip) {
            return [...prev, { ...tripData, isShared: true }];
          }
          return prev;
        });
        
        // Show notification
        setTimeout(() => {
          alert(`ได้รับทริป "${tripData.name}" จากการแชร์แล้ว! ดูได้ในหน้า My Trip`);
        }, 1000);
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing shared trip:', error);
      }
    }
  }, []);

  const loadSupabaseData = async () => {
    setIsLoading(true);
    setDataLoadError(null);
    
    try {
      // Load all data in parallel
      const [provincesResult, attractionsResult, foodsResult, activitiesResult] = await Promise.all([
        TourismService.getAllProvinces(),
        TourismService.getAllAttractions(),
        TourismService.getAllFoods(),
        TourismService.getAllActivities()
      ]);
      
      if (provincesResult.error || attractionsResult.error || foodsResult.error || activitiesResult.error) {
        throw new Error('ไม่สามารถโหลดข้อมูลได้ครบถ้วน');
      }
      
      // Update state with real data
      setProvinces(provincesResult.data || []);
      setAttractions(attractionsResult.data || []);
      setFoods(foodsResult.data || []);
      setActivities(activitiesResult.data || []);
      
    } catch (error) {
      setDataLoadError(`เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}`);
      console.error('Error loading Supabase data:', error);
      
      // Fallback to mock data if Supabase fails
      setProvinces(mockProvinces);
      setAttractions(mockAttractions);
      setFoods(mockFoods);
      setActivities(mockActivities);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceSelectFromMap = (province) => {
    setSelectedProvince(province);
    setShowMap(false);
    setCurrentView('detail');
  };

  // Trip management functions
  const addToTrip = (item, type) => {
    const tripItem = {
      id: Date.now().toString(),
      ...item,
      type: type, // 'attraction', 'food', 'activity'
      addedAt: new Date().toISOString()
    };
    setSelectedItems(prev => [...prev, tripItem]);
  };

  const createTrip = (tripName, days) => {
    const newTrip = {
      id: Date.now().toString(),
      name: tripName,
      days: days,
      items: [...selectedItems],
      createdAt: new Date().toISOString(),
      province: selectedProvince?.name || 'ไม่ระบุ'
    };
    setTrips(prev => [...prev, newTrip]);
    setSelectedItems([]);
    setTripName('');
    setTripDays(3);
    setCurrentTrip(newTrip);
    setCurrentView('trip-detail');
  };

  const addNewPlace = async () => {
    if (!placeName.trim()) {
      alert('กรุณากรอกชื่อสถานที่');
      return;
    }
    
    const newPlace = {
      id: Date.now().toString(),
      name: placeName,
      name_en: placeName,
      type: placeType,
      description: placeDescription,
      opening_hours: placeOpeningHours,
      entrance_fee: placeEntranceFee ? parseInt(placeEntranceFee) : 0,
      coordinates: selectedCoordinates || selectedProvince?.coordinates || { lat: 13.7563, lng: 100.5018 },
      rating: 0,
      estimated_duration: 2,
      province_id: selectedProvince?.id || '1'
    };
    
    try {
      let result;
      
      // Save to Supabase database based on type
      if (placeType === 'attraction') {
        result = await TourismService.addAttraction(newPlace);
        if (result.data) {
          mockAttractions.push(result.data);
          setAttractions(prev => [...prev, result.data]);
        }
      } else if (placeType === 'food') {
         const foodPlace = {
           ...newPlace,
           price_range: { min: 50, max: 200 },
           recommended_places: [placeName]
         };
         result = await TourismService.addFood(foodPlace);
         if (result.data) {
           mockFoods.push(result.data);
           setFoods(prev => [...prev, result.data]);
         }
       } else if (placeType === 'activity') {
         const activityPlace = {
           ...newPlace,
           duration: 2,
           difficulty_level: 'easy',
           price_range: { min: 100, max: 500 },
           season: 'ตลอดปี'
         };
         result = await TourismService.addActivity(activityPlace);
         if (result.data) {
           mockActivities.push(result.data);
           setActivities(prev => [...prev, result.data]);
         }
       }
      
      if (result?.error) {
        throw new Error(result.error.message);
      }
      
      // Clear form
      setPlaceName('');
      setPlaceDescription('');
      setPlaceOpeningHours('');
      setPlaceEntranceFee('');
      setPlaceType('attraction');
      setSelectedCoordinates(null);
      
      alert(`บันทึกสถานที่ "${placeName}" ในจังหวัด${selectedProvince?.name || 'กรุงเทพมหานคร'}ลงฐานข้อมูลเรียบร้อยแล้ว!`);
      setCurrentView('detail');
      
    } catch (error) {
      console.error('Error saving place:', error);
      alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
    }
  };

  const viewMyTrips = () => {
    setCurrentView('my-trips');
  };

  // Delete functions
  const removeFromSelectedItems = (itemId, itemType) => {
    setSelectedItems(prev => prev.filter(item => !(item.id === itemId && item.type === itemType)));
  };

  const deleteTrip = (tripId) => {
    if (window.confirm('คุณต้องการลบทริปนี้หรือไม่?')) {
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip(null);
        setCurrentView('my-trips');
      }
    }
  };

  const removeItemFromTrip = (tripId, itemId, itemType) => {
    if (window.confirm('คุณต้องการลบรายการนี้ออกจากทริปหรือไม่?')) {
      setTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            items: trip.items.filter(item => !(item.id === itemId && item.type === itemType))
          };
        }
        return trip;
      }));
      
      // Update currentTrip if it's the same trip
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip(prev => ({
          ...prev,
          items: prev.items.filter(item => !(item.id === itemId && item.type === itemType))
        }));
      }
    }
  };

  // Navigation functions
  const openGoogleMapsNavigation = (item) => {
    if (item.coordinates) {
      const { lat, lng } = item.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      // Fallback: search by name
      const searchQuery = encodeURIComponent(item.name);
      const url = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(url, '_blank');
    }
  };

  const moveItemInTrip = (tripId, fromIndex, toIndex, dayNumber) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const newItems = [...trip.items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return { ...trip, items: newItems };
      }
      return trip;
    }));
    
    // Update currentTrip if it's the same trip
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(prev => {
        const newItems = [...prev.items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return { ...prev, items: newItems };
      });
    }
  };

  // Share trip functions
  const generateShareableLink = (trip) => {
    const tripData = {
      id: trip.id,
      name: trip.name,
      days: trip.days,
      province: trip.province,
      items: trip.items,
      createdAt: trip.createdAt
    };
    
    // Fix for Thai characters: encode to UTF-8 first, then base64
    const jsonString = JSON.stringify(tripData);
    const encodedData = btoa(encodeURIComponent(jsonString));
    const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`;
    return shareUrl;
  };

  const generateQRCode = (url) => {
    // Simple QR code generation using Google Charts API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrUrl;
  };

  // Search function - ค้นหาจังหวัด
  const searchPlaces = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Search provinces
    const results = [];
    
    provinces.forEach(province => {
      if (province.name.toLowerCase().includes(query.toLowerCase()) ||
          province.name_en?.toLowerCase().includes(query.toLowerCase()) ||
          province.description.toLowerCase().includes(query.toLowerCase()) ||
          province.region.toLowerCase().includes(query.toLowerCase())) {
        results.push({ ...province, type: 'province' });
      }
    });
    
    // Sort by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase().includes(query.toLowerCase());
      const bExact = b.name.toLowerCase().includes(query.toLowerCase());
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
    
    setSearchResults(results); // Show all matching provinces
    setIsSearching(false);
  };
  
  // Use random trip
  const useRandomTrip = (randomTrip) => {
    const newTrip = {
      ...randomTrip,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRandom: true
    };
    
    setTrips(prev => [...prev, newTrip]);
    alert(`เพิ่มทริป "${randomTrip.name}" เรียบร้อยแล้ว! 🎲`);
  };
  
  // Toggle item completion status
  const toggleItemCompletion = (tripId, itemId, itemType) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          items: trip.items.map(item => {
            if (item.id === itemId && item.type === itemType) {
              return {
                ...item,
                completed: !item.completed,
                completedAt: !item.completed ? new Date().toISOString() : null
              };
            }
            return item;
          })
        };
      }
      return trip;
    }));
    
    // Update currentTrip if it's the same trip
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(prev => ({
        ...prev,
        items: prev.items.map(item => {
          if (item.id === itemId && item.type === itemType) {
            return {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : null
            };
          }
          return item;
        })
      }));
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchPlaces(query);
    }, 300);
  };



  const shareTrip = (trip) => {
    const shareUrl = generateShareableLink(trip);
    const qrCodeUrl = generateQRCode(shareUrl);
    
    // Create and show modal using DOM methods instead of template strings
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; border-radius: 12px; max-width: 400px; width: 90%; max-height: 80vh; overflow-y: auto; text-align: center; padding: 20px;';
    
    // Title
    const title = document.createElement('h3');
    title.textContent = `แชร์ทริป: ${trip.name}`;
    modalContent.appendChild(title);
    
    // Description
    const desc = document.createElement('p');
    desc.textContent = 'สแกน QR Code หรือคัดลอกลิงก์เพื่อแชร์ทริปนี้';
    modalContent.appendChild(desc);
    
    // QR Code
    const qrImg = document.createElement('img');
    qrImg.src = qrCodeUrl;
    qrImg.alt = 'QR Code';
    qrImg.style.cssText = 'margin: 20px 0; border: 1px solid #ddd; border-radius: 8px;';
    modalContent.appendChild(qrImg);
    
    // URL Input
    const inputDiv = document.createElement('div');
    inputDiv.style.cssText = 'margin: 20px 0;';
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = shareUrl;
    urlInput.readOnly = true;
    urlInput.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';
    inputDiv.appendChild(urlInput);
    modalContent.appendChild(inputDiv);
    
    // Buttons
    const buttonDiv = document.createElement('div');
    buttonDiv.style.cssText = 'display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;';
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 คัดลอกลิงก์';
    copyBtn.style.cssText = 'background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(shareUrl);
      alert('คัดลอกลิงก์แล้ว!');
    };
    
    const whatsappBtn = document.createElement('button');
    whatsappBtn.textContent = '📱 แชร์ WhatsApp';
    whatsappBtn.style.cssText = 'background: #25d366; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;';
    whatsappBtn.onclick = () => {
      window.open(`https://wa.me/?text=${encodeURIComponent('มาดูทริปของฉันสิ: ' + shareUrl)}`, '_blank');
    };
    
    buttonDiv.appendChild(copyBtn);
    buttonDiv.appendChild(whatsappBtn);
    modalContent.appendChild(buttonDiv);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'ปิด';
    closeBtn.style.cssText = 'background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;';
    closeBtn.onclick = () => modal.remove();
    modalContent.appendChild(closeBtn);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };

  const renderSearch = () => (
    <div className="container">
      <div className="card">
        <h2>🔍 ค้นหาจังหวัด</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="ค้นหาจังหวัดที่ต้องการเที่ยว..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        
        {isSearching && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            🔄 กำลังค้นหา...
          </div>
        )}
        
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            😔 ไม่พบจังหวัดที่ตรงกับ "{searchQuery}"
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div>
            <h3>ผลการค้นหา ({searchResults.length} จังหวัด)</h3>
            <div className="grid">
              {searchResults.map((province) => (
                <div 
                  key={province.id} 
                  className="province-card"
                  onClick={() => {
                    setSelectedProvince(province);
                    setCurrentView('detail');
                  }}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={province.image_url} 
                    alt={province.name}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=200&fit=crop';
                    }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                      color: '#1f2937'
                    }}>
                      {province.name}
                    </h3>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#10b981',
                      backgroundColor: '#f0fdf4',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      {province.region === 'north' && '🏔️ ภาคเหนือ'}
                      {province.region === 'northeast' && '🌾 ภาคอีสาน'}
                      {province.region === 'central' && '🏛️ ภาคกลาง'}
                      {province.region === 'south' && '🏖️ ภาคใต้'}
                      {province.region === 'east' && '🌊 ภาคตะวันออก'}
                      {province.region === 'west' && '⛰️ ภาคตะวันตก'}
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      {province.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentView('home')}
          className="btn"
          style={{ backgroundColor: '#dc2626', marginTop: '20px' }}
        >
          ← กลับหน้าหลัก
        </button>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setShowMap(false)}
          style={{ backgroundColor: '#dc2626' }}
        >
          ← กลับหน้าหลัก
        </button>
      </div>
      
      <div className="card">
        <h2>🗺️ แผนที่จังหวัดท่องเที่ยวไทย</h2>
        <p>คลิกที่จุดสีแดงบนแผนที่เพื่อดูรายละเอียดจังหวัด หรือคลิกปุ่ม "ตำแหน่งฉัน" เพื่อดูตำแหน่งปัจจุบันของคุณ</p>
        
        <MapComponent 
          provinces={provinces}
          attractions={attractions}
          foods={foods}
          activities={activities}
          onProvinceSelect={handleProvinceSelectFromMap}
          selectedProvince={selectedProvince}
        />
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img src="/logo.svg" alt="Thai Trip Planner" style={{ height: '80px', width: 'auto' }} />
          <h2 style={{ margin: '8px 0 0 0', color: '#2D5A5A', fontSize: '24px', fontWeight: 'bold' }}>Thai Trip Planner</h2>
        </div>
        <p style={{ textAlign: 'center', marginTop: '8px' }}>Mini App จัดทริปท่องเที่ยวในประเทศไทย</p>
        

        
        {dataLoadError && (
          <div style={{ 
            marginBottom: '20px',
            padding: '12px', 
            background: '#fef2f2', 
            borderRadius: '8px',
            border: '1px solid #fecaca',
            color: '#dc2626'
          }}>
            ⚠️ {dataLoadError}
            <br />
            <small>กำลังใช้ข้อมูลตัวอย่างแทน</small>
          </div>
        )}
        

        
        <div className="grid" style={{ marginTop: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setCurrentView('provinces')}
            disabled={isLoading}
            style={{ 
              backgroundColor: '#10b981',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📋</span>
            เลือกจังหวัดจากรายการ
          </button>
          
          <button 
            className="btn" 
            onClick={() => setCurrentView('search')}
            disabled={isLoading}
            style={{ 
              backgroundColor: '#f59e0b',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🔍</span>
            ค้นหาสถานที่ท่องเที่ยว
          </button>
          
          <button 
            className="btn" 
            onClick={() => setShowMap(true)}
            disabled={isLoading}
            style={{ 
              backgroundColor: '#059669',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🗺️</span>
            เลือกจังหวัดจากแผนที่
          </button>
          
          <button 
            className="btn" 
            onClick={viewMyTrips}
            style={{ 
              backgroundColor: '#7c3aed', 
              position: 'relative',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🎒</span>
            ทริปของฉัน
            {trips.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {trips.length}
              </span>
            )}
          </button>
        </div>
        
        {selectedItems.length > 0 && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '12px',
            border: '2px solid #f59e0b',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#92400e'
              }}>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>🎒</span>
                เลือกไว้ {selectedItems.length} รายการ
              </div>
              
              <button
                onClick={() => setCurrentView('createTrip')}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease',
                  minWidth: '120px',
                  justifyContent: 'center',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  zIndex: 10
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span>🎯</span>
                สร้างทริป
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {selectedItems.map((item, index) => (
                 <div key={index} style={{
                   display: 'flex',
                   alignItems: 'center',
                   backgroundColor: 'rgba(255, 255, 255, 0.8)',
                   borderRadius: '20px',
                   padding: '4px 12px',
                   fontSize: '12px',
                   color: '#92400e',
                   border: '1px solid rgba(245, 158, 11, 0.3)',
                   position: 'relative'
                 }}>
                   <span style={{ marginRight: '4px' }}>
                     {item.type === 'attraction' && '🏛️'}
                     {item.type === 'food' && '🍜'}
                     {item.type === 'activity' && '🎯'}
                   </span>
                   {item.name}
                   <span style={{ marginLeft: '4px', color: '#16a34a' }}>✓</span>
                   <button
                     onClick={() => removeFromSelectedItems(item.id, item.type)}
                     style={{
                       position: 'absolute',
                       top: '-6px',
                       right: '-6px',
                       backgroundColor: '#ef4444',
                       color: 'white',
                       border: 'none',
                       borderRadius: '50%',
                       width: '16px',
                       height: '16px',
                       fontSize: '10px',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       lineHeight: '1'
                     }}
                     title="ลบออกจากรายการ"
                   >
                     ×
                   </button>
                 </div>
               ))}
            </div>
          </div>
        )}
        
        {/* Random Trip Generator Section */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ color: '#374151', marginBottom: '16px' }}>🎲 ทริปจัดให้</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', margin: 0 }}>ระบบสุ่มสถานที่ ร้านอาหาร และกิจกรรมให้คุณ</p>
            <button
               onClick={() => {
                 if (provinces.length > 0) {
                   const shuffledProvinces = provinces.sort(() => 0.5 - Math.random());
                   const trips = shuffledProvinces.slice(0, 4).map(province => generateRandomTrip(province));
                   setRandomTrips(trips);
                 }
               }}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🎲</span>
              สุ่มใหม่
            </button>
          </div>
          
          <div className="grid">
            {randomTrips.map((trip) => (
              <div key={trip.id} className="card" style={{ backgroundColor: '#fef7ff', border: '2px solid #e879f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, flex: 1 }}>{trip.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#f59e0b' }}>⭐</span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>{trip.rating}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>({trip.reviews})</span>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  📍 {trip.province} • 📅 {trip.days} วัน • 📝 {trip.items.length} รายการ
                </p>
                
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {trip.items.slice(0, 3).map((item, index) => (
                    <span key={index} style={{
                      fontSize: '12px',
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      {item.type === 'attraction' && '🏛️'}
                      {item.type === 'food' && '🍜'}
                      {item.type === 'activity' && '🎯'}
                      {item.name}
                    </span>
                  ))}
                  {trip.items.length > 3 && (
                    <span style={{
                      fontSize: '12px',
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      +{trip.items.length - 3} อื่นๆ
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => useRandomTrip(trip)}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🎯</span>
                  ใช้ทริปนี้
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </div>
  );

  const renderProvinces = () => (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setCurrentView('home')}
          style={{ backgroundColor: '#dc2626' }}
        >
          ← กลับหน้าหลัก
        </button>
      </div>
      
      <div className="card">
        <h2>เลือกจังหวัดที่ต้องการเที่ยว</h2>
        <p>เลือกจังหวัดเพื่อดูสถานที่ท่องเที่ยว อาหาร และกิจกรรมแนะนำ</p>
      </div>
      
      <div className="grid">
        {provinces.map((province) => (
          <div 
            key={province.id} 
            className="province-card"
            onClick={() => {
              setSelectedProvince(province);
              setCurrentView('detail');
            }}
          >
            <img 
              src={province.image_url} 
              alt={province.name}
              className="province-image"
            />
            <div className="province-info">
              <div className="province-name">{province.name}</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                {province.name_en} • {province.region === 'north' ? 'ภาคเหนือ' : 
                 province.region === 'south' ? 'ภาคใต้' : 
                 province.region === 'central' ? 'ภาคกลาง' : 'ภาคอีสาน'}
              </div>
              <div className="province-description">{province.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProvinceDetail = () => (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setCurrentView('provinces')}
          style={{ backgroundColor: '#dc2626' }}
        >
          ← กลับรายการจังหวัด
        </button>
      </div>
      
      {selectedProvince && (
        <>
          <div className="card">
            <img 
              src={selectedProvince.image_url} 
              alt={selectedProvince.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
            />
            <h1>{selectedProvince.name}</h1>
            <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '20px' }}>
              {selectedProvince.description}
            </p>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

              
              <button 
                className="btn" 
                onClick={() => setShowMap(true)}
                style={{ backgroundColor: '#059669' }}
              >
                🗺️ ดูบนแผนที่
              </button>
            </div>
          </div>
          
          <div className="tabs">
            <button className="tab active">🏛️ สถานที่ท่องเที่ยว</button>
            <button className="tab">🍜 อาหารท้องถิ่น</button>
            <button className="tab">🎯 กิจกรรม</button>
          </div>
          
          {/* สถานที่ท่องเที่ยว */}
          <div className="card">
            <h3>🏛️ สถานที่ท่องเที่ยวแนะนำ ({attractions.filter(a => a.province_id === selectedProvince.id || !a.province_id).length})</h3>
            <div className="grid">
              {attractions.filter(a => a.province_id === selectedProvince.id || !a.province_id).map((attraction) => (
                <div key={attraction.id} className="card" style={{ position: 'relative' }}>
                  <h4>{attraction.name}</h4>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{attraction.name_en}</p>
                  <p>{attraction.description}</p>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                    {attraction.rating && `⭐ ${attraction.rating}`}
                    {attraction.estimated_duration && ` | ⏱️ ${attraction.estimated_duration} ชม.`}
                    {attraction.entrance_fee !== undefined && ` | 💰 ${attraction.entrance_fee === 0 ? 'ฟรี' : attraction.entrance_fee + ' บาท'}`}
                  </div>
                  {(() => {
                    const isSelected = selectedItems.some(item => item.id === attraction.id && item.type === 'attraction');
                    return (
                      <button 
                        onClick={() => !isSelected && addToTrip(attraction, 'attraction')}
                        disabled={isSelected}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: isSelected ? '#16a34a' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: isSelected ? 'default' : 'pointer',
                          fontWeight: 'bold',
                          opacity: isSelected ? 0.8 : 1
                        }}
                      >
                        {isSelected ? '✓ เลือกแล้ว' : '+ เพิ่มเข้าทริป'}
                      </button>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
          
          {/* อาหารท้องถิ่น */}
          <div className="card">
            <h3>🍜 อาหารท้องถิ่น ({foods.filter(f => f.province_id === selectedProvince.id || !f.province_id).length})</h3>
            <div className="grid">
              {foods.filter(f => f.province_id === selectedProvince.id || !f.province_id).map((food) => {
                let priceRange = null;
                try {
                  priceRange = food.price_range && typeof food.price_range === 'string' ? JSON.parse(food.price_range) : food.price_range;
                } catch (e) {
                  console.warn('Invalid price_range JSON:', food.price_range);
                }
                return (
                  <div key={food.id} className="card" style={{ position: 'relative' }}>
                    <h4>{food.name}</h4>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{food.name_en}</p>
                    <p>{food.description}</p>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                      {priceRange && `💰 ${priceRange.min}-${priceRange.max} บาท`}
                    </div>
                    {(() => {
                      const isSelected = selectedItems.some(item => item.id === food.id && item.type === 'food');
                      return (
                        <button 
                          onClick={() => !isSelected && addToTrip(food, 'food')}
                          disabled={isSelected}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: isSelected ? '#16a34a' : '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: isSelected ? 'default' : 'pointer',
                            fontWeight: 'bold',
                            opacity: isSelected ? 0.8 : 1
                          }}
                        >
                          {isSelected ? '✓ เลือกแล้ว' : '+ เพิ่มเข้าทริป'}
                        </button>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* กิจกรรม */}
          <div className="card">
            <h3>🎯 กิจกรรมแนะนำ ({activities.filter(a => a.province_id === selectedProvince.id || !a.province_id).length})</h3>
            <div className="grid">
              {activities.filter(a => a.province_id === selectedProvince.id || !a.province_id).map((activity) => {
                let priceRange = null;
                try {
                  priceRange = activity.price_range && typeof activity.price_range === 'string' ? JSON.parse(activity.price_range) : activity.price_range;
                } catch (e) {
                  console.warn('Invalid price_range JSON:', activity.price_range);
                }
                return (
                  <div key={activity.id} className="card" style={{ position: 'relative' }}>
                    <h4>{activity.name}</h4>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{activity.name_en}</p>
                    <p>{activity.description}</p>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                      {activity.duration && `⏱️ ${activity.duration} ชม.`}
                      {activity.difficulty_level && ` | 📊 ${activity.difficulty_level === 'easy' ? 'ง่าย' : activity.difficulty_level === 'medium' ? 'ปานกลาง' : 'ยาก'}`}
                      {priceRange && ` | 💰 ${priceRange.min}-${priceRange.max} บาท`}
                    </div>
                    {(() => {
                       const isSelected = selectedItems.some(item => item.id === activity.id && item.type === 'activity');
                       return (
                         <button 
                           onClick={() => !isSelected && addToTrip(activity, 'activity')}
                           disabled={isSelected}
                           style={{
                             position: 'absolute',
                             top: '12px',
                             right: '12px',
                             backgroundColor: isSelected ? '#16a34a' : '#8b5cf6',
                             color: 'white',
                             border: 'none',
                             borderRadius: '20px',
                             padding: '6px 12px',
                             fontSize: '12px',
                             cursor: isSelected ? 'default' : 'pointer',
                             fontWeight: 'bold',
                             opacity: isSelected ? 0.8 : 1
                           }}
                         >
                           {isSelected ? '✓ เลือกแล้ว' : '+ เพิ่มเข้าทริป'}
                         </button>
                       );
                     })()}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render Add Place Page
  const renderAddPlace = () => {
    return (
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setCurrentView('home')}
            style={{ backgroundColor: '#dc2626' }}
          >
            ← กลับหน้าหลัก
          </button>
        </div>
        
        <div className="card">
          <h2>📍 บันทึกสถานที่ใหม่</h2>
          <p>เพิ่มสถานที่ท่องเที่ยว ร้านอาหาร หรือกิจกรรมใหม่</p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ประเภทสถานที่:</label>
            <select 
              value={placeType}
              onChange={(e) => setPlaceType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              <option value="attraction">🏛️ สถานที่ท่องเที่ยว</option>
              <option value="food">🍜 ร้านอาหาร</option>
              <option value="activity">🎯 กิจกรรม</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ชื่อสถานที่:</label>
            <input 
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="เช่น วัดพระแก้ว, ร้านข้าวซอยแม่สาย"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>รายละเอียด:</label>
            <textarea 
              value={placeDescription}
              onChange={(e) => setPlaceDescription(e.target.value)}
              placeholder="อธิบายเกี่ยวกับสถานที่นี้..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>เวลาเปิด-ปิด:</label>
            <select 
              value={placeOpeningHours}
              onChange={(e) => setPlaceOpeningHours(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              <option value="">เลือกเวลาเปิด-ปิด</option>
              <option value="24 ชั่วโมง">24 ชั่วโมง</option>
              <option value="06:00 - 18:00">06:00 - 18:00</option>
              <option value="07:00 - 19:00">07:00 - 19:00</option>
              <option value="08:00 - 17:00">08:00 - 17:00</option>
              <option value="08:00 - 18:00">08:00 - 18:00</option>
              <option value="08:30 - 15:30">08:30 - 15:30</option>
              <option value="09:00 - 17:00">09:00 - 17:00</option>
              <option value="09:00 - 18:00">09:00 - 18:00</option>
              <option value="10:00 - 20:00">10:00 - 20:00</option>
              <option value="10:00 - 22:00">10:00 - 22:00</option>
              <option value="11:00 - 21:00">11:00 - 21:00</option>
              <option value="17:00 - 24:00">17:00 - 24:00</option>
              <option value="18:00 - 02:00">18:00 - 02:00</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ค่าเข้า (บาท):</label>
            <input 
              type="number"
              value={placeEntranceFee}
              onChange={(e) => setPlaceEntranceFee(e.target.value)}
              placeholder="0"
              min="0"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ตำแหน่งบนแผนที่:</label>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              คลิกบนแผนที่เพื่อเลือกตำแหน่งที่แน่นอน {selectedCoordinates && `(${selectedCoordinates.lat.toFixed(4)}, ${selectedCoordinates.lng.toFixed(4)})`}
            </p>
            <div style={{ height: '300px', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
               <MapComponent
                 provinces={[]}
                 attractions={[]}
                 foods={[]}
                 activities={[]}
                 selectedProvince={null}
                 onProvinceSelect={() => {}}
                 showAttractions={false}
                 showFoods={false}
                 showActivities={false}
                 selectedCoordinates={selectedCoordinates}
                 onMapClick={(coordinates) => {
                   setSelectedCoordinates(coordinates);
                 }}
               />
             </div>
          </div>
          
          <button 
            onClick={addNewPlace}
            disabled={!placeName.trim()}
            className="btn"
            style={{ 
              backgroundColor: placeName.trim() ? '#10b981' : '#9ca3af',
              width: '100%',
              padding: '12px'
            }}
          >
            💾 บันทึกสถานที่
          </button>
        </div>
      </div>
    );
  };
  
  // Render Create Trip Page
  const renderCreateTrip = () => {
    
    return (
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setCurrentView('home')}
            style={{ backgroundColor: '#dc2626' }}
          >
            ← กลับหน้าหลัก
          </button>
        </div>
        
        <div className="card">
          <h2>🎒 สร้างทริปใหม่</h2>
          <p>คุณได้เลือกไว้ {selectedItems.length} รายการแล้ว</p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ชื่อทริป:</label>
            <input 
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="เช่น ทริปเชียงใหม่ 3 วัน 2 คืน"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>จำนวนวัน:</label>
            <select 
              value={tripDays}
              onChange={(e) => setTripDays(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              {[1,2,3,4,5,6,7].map(day => (
                <option key={day} value={day}>{day} วัน</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>รายการที่เลือก:</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {selectedItems.map((item, index) => (
                <div key={index} style={{
                  padding: '8px',
                  margin: '4px 0',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  {item.type === 'attraction' && '🏛️'}
                  {item.type === 'food' && '🍜'}
                  {item.type === 'activity' && '🎯'}
                  {' '}{item.name}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => createTrip(tripName, tripDays)}
            disabled={!tripName.trim()}
            className="btn"
            style={{ 
              backgroundColor: tripName.trim() ? '#10b981' : '#9ca3af',
              width: '100%',
              padding: '12px'
            }}
          >
            🎯 สร้างทริปและจัดตารางอัตโนมัติ
          </button>
        </div>
      </div>
    );
  };
  
  // Render My Trips Page
  const renderMyTrips = () => (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setCurrentView('home')}
          style={{ backgroundColor: '#dc2626' }}
        >
          ← กลับหน้าหลัก
        </button>
      </div>
      
      <div className="card">
        <h2>🎒 My Trip ({trips.length})</h2>
        <p>รายการทริปทั้งหมดของคุณ</p>
      </div>
      
      {trips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</div>
          <h3>ยังไม่มีทริป</h3>
          <p>เริ่มสร้างทริปแรกของคุณกันเถอะ!</p>
          <button 
            className="btn"
            onClick={() => setCurrentView('provinces')}
            style={{ backgroundColor: '#10b981' }}
          >
            🗺️ เริ่มวางแผนทริป
          </button>
        </div>
      ) : (
        <div className="grid">
          {trips.map((trip) => (
            <div key={trip.id} className="card" style={{ cursor: 'pointer' }}
                 onClick={() => {
                   setCurrentTrip(trip);
                   setCurrentView('trip-detail');
                 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                 <h4 style={{ margin: 0 }}>{trip.name}</h4>
                 {trip.isShared && (
                   <span style={{
                     backgroundColor: '#3b82f6',
                     color: 'white',
                     fontSize: '10px',
                     padding: '2px 6px',
                     borderRadius: '10px',
                     fontWeight: 'bold'
                   }}>
                     แชร์
                   </span>
                 )}
               </div>
               <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                 📍 {trip.province} • 📅 {trip.days} วัน • 📝 {trip.items.length} รายการ
               </p>
               
               {/* Trip Progress */}
               <div style={{ marginBottom: '8px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                   <span style={{ fontSize: '12px', color: '#6b7280' }}>ความคืบหน้า</span>
                   <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' }}>
                     {trip.items.filter(item => item.completed).length}/{trip.items.length} 
                     ({trip.items.length > 0 ? Math.round((trip.items.filter(item => item.completed).length / trip.items.length) * 100) : 0}%)
                   </span>
                 </div>
                 <div style={{ 
                   width: '100%', 
                   height: '4px', 
                   backgroundColor: '#e5e7eb', 
                   borderRadius: '2px',
                   overflow: 'hidden'
                 }}>
                   <div style={{
                     width: `${trip.items.length > 0 ? (trip.items.filter(item => item.completed).length / trip.items.length) * 100 : 0}%`,
                     height: '100%',
                     backgroundColor: trip.items.filter(item => item.completed).length === trip.items.length && trip.items.length > 0 ? '#22c55e' : '#3b82f6',
                     transition: 'width 0.3s ease'
                   }}></div>
                 </div>
                 {trip.items.filter(item => item.completed).length === trip.items.length && trip.items.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold', marginTop: '4px' }}>
                      🎉 ทริปเสร็จสมบูรณ์!
                    </div>
                  )}
                </div>
                
                {/* Trip Expense Summary */}
                {(trip.expenses && trip.expenses.length > 0) && (
                  <div style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 'bold' }}>💰 ค่าใช้จ่ายรวม</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a' }}>
                        ฿{trip.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
                      {trip.expenses.length} รายการ • เฉลี่ย ฿{Math.round(trip.expenses.reduce((sum, exp) => sum + exp.amount, 0) / trip.days).toLocaleString()}/วัน
                    </div>
                  </div>
                )}
                
               <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                 สร้างเมื่อ {new Date(trip.createdAt).toLocaleDateString('th-TH')}
               </p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      shareTrip(trip);
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📤 แชร์
                  </button>

                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     deleteTrip(trip.id);
                   }}
                   style={{
                     backgroundColor: '#ef4444',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     padding: '4px 8px',
                     fontSize: '12px',
                     cursor: 'pointer'
                   }}
                 >
                   🗑️ ลบ
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  // Render Trip Detail Page
  const renderTripDetail = () => {
    if (!currentTrip) return null;
    
    // Simple auto-scheduling: distribute items across days
    const itemsPerDay = Math.ceil(currentTrip.items.length / currentTrip.days);
    const schedule = [];
    
    for (let day = 1; day <= currentTrip.days; day++) {
      const startIndex = (day - 1) * itemsPerDay;
      const endIndex = Math.min(startIndex + itemsPerDay, currentTrip.items.length);
      const dayItems = currentTrip.items.slice(startIndex, endIndex);
      schedule.push({ day, items: dayItems });
    }
    
    return (
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setCurrentView('my-trips')}
            style={{ backgroundColor: '#dc2626' }}
          >
            ← กลับ My Trip
          </button>
        </div>
        
        <div className="card">
          <h2>{currentTrip.name}</h2>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>
            📍 {currentTrip.province} • 📅 {currentTrip.days} วัน • 📝 {currentTrip.items.length} รายการ
          </p>
     </div>
        
        {/* Progress Summary */}
        <div className="card" style={{ backgroundColor: '#f8fafc', marginBottom: '20px' }}>
          <h3 style={{ color: '#374151', marginBottom: '16px' }}>📊 ความคืบหน้าทริป</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
                {currentTrip.items.filter(item => item.completed).length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>เสร็จแล้ว</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {currentTrip.items.filter(item => !item.completed).length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>ยังไม่เสร็จ</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                {currentTrip.items.length > 0 ? Math.round((currentTrip.items.filter(item => item.completed).length / currentTrip.items.length) * 100) : 0}%
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>ความคืบหน้า</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${currentTrip.items.length > 0 ? (currentTrip.items.filter(item => item.completed).length / currentTrip.items.length) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#22c55e',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>
        
        {/* Expense Tracker */}
        <div className="card" style={{ backgroundColor: '#f0fdf4', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#374151', margin: 0 }}>💰 บันทึกรายจ่าย</h3>
            <button
               onClick={() => {
                 setShowExpenseForm(true);
                 setExpenseForm({ description: '', amount: '' });
               }}
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ➕ เพิ่มรายจ่าย
            </button>
          </div>
          
          {/* Expense Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                {(currentTrip.expenses || []).length}
              </div>
              <div style={{ fontSize: '12px', color: '#15803d' }}>รายการ</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                ฿{(currentTrip.expenses || []).reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#15803d' }}>รวมทั้งหมด</div>
            </div>
          </div>
           
           {/* Inline Add Expense Form */}
           {showExpenseForm && (
             <div style={{
               backgroundColor: '#f9fafb',
               border: '1px solid #d1d5db',
               borderRadius: '8px',
               padding: '16px',
               marginBottom: '16px'
             }}>
                 <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>เพิ่มรายจ่ายใหม่</h4>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                   <input
                     type="text"
                     value={expenseForm.description}
                     onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                     placeholder="รายการค่าใช้จ่าย (เช่น ค่าอาหาร, ค่าเข้าชม)"
                     style={{
                       padding: '8px 12px',
                       border: '1px solid #d1d5db',
                       borderRadius: '6px',
                       fontSize: '14px'
                     }}
                   />
                   <input
                     type="number"
                     value={expenseForm.amount}
                     onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                     placeholder="จำนวนเงิน (บาท)"
                     min="0"
                     step="0.01"
                     style={{
                       padding: '8px 12px',
                       border: '1px solid #d1d5db',
                       borderRadius: '6px',
                       fontSize: '14px'
                     }}
                   />
                 </div>
                   
                   <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                   <button
                     onClick={() => {
                       setShowExpenseForm(false);
                       setExpenseForm({ description: '', amount: '' });
                     }}
                     style={{
                         backgroundColor: '#6b7280',
                         color: 'white',
                         border: 'none',
                         borderRadius: '6px',
                         padding: '6px 12px',
                         fontSize: '13px',
                         cursor: 'pointer'
                       }}
                     >
                       ยกเลิก
                     </button>
                     <button
                       onClick={() => {
                         if (expenseForm.description.trim() && expenseForm.amount && !isNaN(expenseForm.amount) && parseFloat(expenseForm.amount) > 0) {
                           const expense = {
                             id: Date.now().toString(),
                             description: expenseForm.description.trim(),
                             amount: parseFloat(expenseForm.amount),
                             date: new Date().toISOString(),
                             tripId: currentTrip.id
                           };
                           
                           const updatedTrips = trips.map(trip => {
                             if (trip.id === currentTrip.id) {
                               return {
                                 ...trip,
                                 expenses: [...(trip.expenses || []), expense]
                               };
                             }
                             return trip;
                           });
                           
                           setTrips(updatedTrips);
                           setCurrentTrip({
                             ...currentTrip,
                             expenses: [...(currentTrip.expenses || []), expense]
                           });
                           
                           setShowExpenseForm(false);
                           setExpenseForm({ description: '', amount: '' });
                         } else {
                           alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
                         }
                       }}
                       style={{
                         backgroundColor: '#22c55e',
                         color: 'white',
                         border: 'none',
                         borderRadius: '6px',
                         padding: '6px 12px',
                         fontSize: '13px',
                         cursor: 'pointer'
                       }}
                     >
                       ✓ เพิ่ม
                     </button>
                   </div>
               </div>
             )}
           
           {/* Expense List */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {(currentTrip.expenses || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                ยังไม่มีรายการค่าใช้จ่าย
              </div>
            ) : (
              (currentTrip.expenses || []).map((expense) => (
                <div key={expense.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#374151' }}>{expense.description}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(expense.date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a' }}>
                      ฿{expense.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('ต้องการลบรายการนี้หรือไม่?')) {
                          const updatedTrips = trips.map(trip => {
                            if (trip.id === currentTrip.id) {
                              return {
                                ...trip,
                                expenses: (trip.expenses || []).filter(exp => exp.id !== expense.id)
                              };
                            }
                            return trip;
                          });
                          
                          setTrips(updatedTrips);
                          setCurrentTrip({
                            ...currentTrip,
                            expenses: (currentTrip.expenses || []).filter(exp => exp.id !== expense.id)
                          });
                        }
                      }}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={() => shareTrip(currentTrip)}
              className="btn"
              style={{ backgroundColor: '#3b82f6', flex: 1 }}
            >
              📤 แชร์ทริปนี้
            </button>

          </div>
        
        {schedule.map((daySchedule) => (
           <div key={daySchedule.day} className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h3 style={{ margin: 0 }}>📅 วันที่ {daySchedule.day}</h3>
               {daySchedule.items.length > 1 && (
                 <button
                   onClick={() => {
                     const waypoints = daySchedule.items
                       .filter(item => item.coordinates)
                       .map(item => `${item.coordinates.lat},${item.coordinates.lng}`)
                       .join('|');
                     
                     if (waypoints) {
                       const firstItem = daySchedule.items.find(item => item.coordinates);
                       const lastItem = daySchedule.items.slice().reverse().find(item => item.coordinates);
                       
                       if (firstItem && lastItem) {
                         const origin = `${firstItem.coordinates.lat},${firstItem.coordinates.lng}`;
                         const destination = `${lastItem.coordinates.lat},${lastItem.coordinates.lng}`;
                         const waypointsParam = daySchedule.items.length > 2 ? 
                           `&waypoints=${daySchedule.items.slice(1, -1).filter(item => item.coordinates).map(item => `${item.coordinates.lat},${item.coordinates.lng}`).join('|')}` : '';
                         
                         const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=driving`;
                         window.open(url, '_blank');
                       }
                     } else {
                       alert('ไม่สามารถวางแผนเส้นทางได้ เนื่องจากไม่มีพิกัดของสถานที่');
                     }
                   }}
                   style={{
                     backgroundColor: '#f59e0b',
                     color: 'white',
                     border: 'none',
                     borderRadius: '6px',
                     padding: '8px 12px',
                     fontSize: '14px',
                     cursor: 'pointer',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '4px'
                   }}
                 >
                   🗺️ วางแผนเส้นทางทั้งวัน
                 </button>
               )}
             </div>
             {daySchedule.items.length === 0 ? (
               <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>ไม่มีกิจกรรม</p>
             ) : (
              <div className="grid">
                {daySchedule.items.map((item, globalIndex) => {
                   const dayStartIndex = schedule.slice(0, daySchedule.day - 1).reduce((sum, d) => sum + d.items.length, 0);
                   const itemIndex = dayStartIndex + daySchedule.items.indexOf(item);
                   
                   return (
                     <div key={globalIndex} className="card" style={{ 
                       backgroundColor: item.completed ? '#f0fdf4' : '#f9fafb', 
                       position: 'relative',
                       border: item.completed ? '2px solid #22c55e' : '1px solid #e5e7eb',
                       opacity: item.completed ? 0.8 : 1
                     }}>
                       <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px', paddingRight: '40px' }}>
                          <button
                            onClick={() => toggleItemCompletion(currentTrip.id, item.id, item.type)}
                            style={{
                              backgroundColor: item.completed ? '#22c55e' : '#e5e7eb',
                              color: item.completed ? 'white' : '#6b7280',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                              marginTop: '2px',
                              flexShrink: 0
                            }}
                            title={item.completed ? 'ยกเลิกการทำเสร็จ' : 'ทำเสร็จแล้ว'}
                          >
                            {item.completed ? '✓' : ''}
                          </button>
                          <span style={{ fontSize: '20px', marginRight: '8px', marginTop: '2px' }}>
                            {item.type === 'attraction' && '🏛️'}
                            {item.type === 'food' && '🍜'}
                            {item.type === 'activity' && '🎯'}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ 
                              margin: 0, 
                              marginBottom: '4px', 
                              wordWrap: 'break-word',
                              textDecoration: item.completed ? 'line-through' : 'none',
                              color: item.completed ? '#6b7280' : '#111827'
                            }}>{item.name}</h4>
                            {item.completed && item.completedAt && (
                              <p style={{ 
                                fontSize: '12px', 
                                color: '#22c55e', 
                                margin: '2px 0 4px 0',
                                fontWeight: 'bold'
                              }}>
                                ✅ เสร็จเมื่อ: {new Date(item.completedAt).toLocaleString('th-TH')}
                              </p>
                            )}
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {itemIndex > 0 && (
                                <button
                                  onClick={() => moveItemInTrip(currentTrip.id, itemIndex, itemIndex - 1)}
                                  style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 6px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                  title="ย้ายขึ้น"
                                >
                                  ↑
                                </button>
                              )}
                              {itemIndex < currentTrip.items.length - 1 && (
                                <button
                                  onClick={() => moveItemInTrip(currentTrip.id, itemIndex, itemIndex + 1)}
                                  style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 6px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                  title="ย้ายลง"
                                >
                                  ↓
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                       <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                         {item.description}
                       </p>
                       <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                         <button
                           onClick={() => openGoogleMapsNavigation(item)}
                           style={{
                             backgroundColor: '#10b981',
                             color: 'white',
                             border: 'none',
                             borderRadius: '6px',
                             padding: '8px 12px',
                             fontSize: '14px',
                             cursor: 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             gap: '4px'
                           }}
                         >
                           🧭 นำทาง
                         </button>
                         {item.coordinates && (
                           <button
                             onClick={() => {
                               const { lat, lng } = item.coordinates;
                               const url = `https://www.google.com/maps/@${lat},${lng},15z`;
                               window.open(url, '_blank');
                             }}
                             style={{
                               backgroundColor: '#3b82f6',
                               color: 'white',
                               border: 'none',
                               borderRadius: '6px',
                               padding: '8px 12px',
                               fontSize: '14px',
                               cursor: 'pointer',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '4px'
                             }}
                           >
                             📍 ดูบนแผนที่
                           </button>
                         )}
                       </div>
                       <button
                          onClick={() => removeItemFromTrip(currentTrip.id, item.id, item.type)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                          }}
                          title="ลบออกจากทริป"
                        >
                          🗑️
                        </button>
                     </div>
                   );
                 })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>

      
      {showMap ? renderMap() : (
        <>
          {currentView === 'home' && renderHome()}
          {currentView === 'provinces' && renderProvinces()}
          {currentView === 'search' && renderSearch()}
          {currentView === 'detail' && renderProvinceDetail()}
          {currentView === 'createTrip' && renderCreateTrip()}
          {currentView === 'my-trips' && renderMyTrips()}
          {currentView === 'trip-detail' && currentTrip && renderTripDetail()}
        </>
      )}
      
      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <a 
          href="#" 
          className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('home');
            setShowMap(false);
          }}
        >
          <div className="mobile-nav-icon">🏠</div>
          <div>หน้าหลัก</div>
        </a>
        
        <a 
          href="#" 
          className={`mobile-nav-item ${currentView === 'provinces' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('provinces');
            setShowMap(false);
          }}
        >
          <div className="mobile-nav-icon">📍</div>
          <div>จังหวัด</div>
        </a>
        
        <a 
          href="#" 
          className={`mobile-nav-item ${currentView === 'search' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('search');
            setShowMap(false);
          }}
        >
          <div className="mobile-nav-icon">🔍</div>
          <div>ค้นหา</div>
        </a>
        
        <a 
          href="#" 
          className={`mobile-nav-item ${showMap ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setShowMap(true);
          }}
        >
          <div className="mobile-nav-icon">🗺️</div>
          <div>แผนที่</div>
        </a>
        
        <a 
          href="#" 
          className={`mobile-nav-item ${currentView === 'my-trips' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('my-trips');
            setShowMap(false);
          }}
        >
          <div className="mobile-nav-icon">🎒</div>
          <div>ทริปของฉัน</div>
        </a>
      </div>
    </div>
  );
}

export default App;