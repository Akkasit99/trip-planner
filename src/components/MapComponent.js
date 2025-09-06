import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const provinceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const attractionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33]
});

const foodIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33]
});

const activityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33]
});

// Component to handle map centering
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!onMapClick) return;
    
    const handleClick = (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

const MapComponent = ({ 
  provinces = [], 
  attractions = [], 
  foods = [], 
  activities = [], 
  onProvinceSelect, 
  selectedProvince,
  showAttractions = true,
  showFoods = true,
  showActivities = true,
  onMapClick,
  selectedCoordinates
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.7563, 100.5018]); // Default to Bangkok
  const [mapZoom, setMapZoom] = useState(6);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showLayers, setShowLayers] = useState({
    attractions: showAttractions,
    foods: showFoods,
    activities: showActivities
  });

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];
        setUserLocation(location);
        setMapCenter(location);
        setMapZoom(10);
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Center map on selected province
  const centerOnProvince = (province) => {
    if (province && province.coordinates) {
      setMapCenter([province.coordinates.lat, province.coordinates.lng]);
      setMapZoom(10);
    }
  };

  // Center map on Thailand
  const centerOnThailand = () => {
    setMapCenter([13.7563, 100.5018]);
    setMapZoom(6);
  };

  // Toggle layer visibility
  const toggleLayer = (layerType) => {
    setShowLayers(prev => ({
      ...prev,
      [layerType]: !prev[layerType]
    }));
  };

  // Parse coordinates from JSON string or object
  const parseCoordinates = (coords) => {
    if (!coords) return null;
    if (typeof coords === 'string') {
      try {
        const parsed = JSON.parse(coords);
        return [parsed.lat, parsed.lng];
      } catch (e) {
        return null;
      }
    }
    if (coords.lat && coords.lng) {
      return [coords.lat, coords.lng];
    }
    return null;
  };

  // Safe JSON parse helper
  const safeJsonParse = (jsonString, fallback = {}) => {
    if (!jsonString) return fallback;
    if (typeof jsonString === 'object') return jsonString;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn('Failed to parse JSON:', jsonString);
      return fallback;
    }
  };

  // Safe array parse helper
   const safeArrayParse = (jsonString, fallback = []) => {
     if (!jsonString) return fallback;
     if (Array.isArray(jsonString)) return jsonString;
     try {
       const parsed = JSON.parse(jsonString);
       return Array.isArray(parsed) ? parsed : fallback;
     } catch (e) {
       console.warn('Failed to parse JSON array:', jsonString);
       return fallback;
     }
   };

  useEffect(() => {
    if (selectedProvince) {
      centerOnProvince(selectedProvince);
    }
  }, [selectedProvince]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Map Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={getCurrentLocation}
          disabled={isLocating}
          style={{
            padding: '8px 12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLocating ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            opacity: isLocating ? 0.7 : 1
          }}
        >
          {isLocating ? '🔄 กำลังหา...' : '📍 ตำแหน่งฉัน'}
        </button>
        
        <button
          onClick={centerOnThailand}
          style={{
            padding: '8px 12px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          🇹🇭 ประเทศไทย
        </button>
      </div>

      {/* Layer Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '4px',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '8px'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '3px', fontSize: '8px' }}>แสดงข้อมูล</div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showLayers.attractions}
            onChange={() => toggleLayer('attractions')}
            style={{ transform: 'scale(0.6)', margin: '0' }}
          />
          <span style={{ color: '#16a34a', fontSize: '8px' }}>🏛️ สถานที่ท่องเที่ยว</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showLayers.foods}
            onChange={() => toggleLayer('foods')}
            style={{ transform: 'scale(0.6)', margin: '0' }}
          />
          <span style={{ color: '#ea580c', fontSize: '8px' }}>🍜 ร้านอาหาร</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showLayers.activities}
            onChange={() => toggleLayer('activities')}
            style={{ transform: 'scale(0.6)', margin: '0' }}
          />
          <span style={{ color: '#7c3aed', fontSize: '8px' }}>🎯 กิจกรรม</span>
        </label>
      </div>

      {/* Location Error */}
      {locationError && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          maxWidth: '250px'
        }}>
          ❌ {locationError}
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>📍 ตำแหน่งของคุณ</strong>
                <br />
                <small>
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Province Markers */}
        {provinces.map((province) => (
          province.coordinates && (
            <Marker
              key={province.id}
              position={[province.coordinates.lat, province.coordinates.lng]}
              icon={provinceIcon}
              eventHandlers={{
                click: () => {
                  if (onProvinceSelect) {
                    onProvinceSelect(province);
                  }
                  centerOnProvince(province);
                }
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <strong>{province.name}</strong>
                  <br />
                  <em>{province.name_en}</em>
                  <br />
                  <small style={{ color: '#64748b' }}>
                    {province.region === 'north' ? 'ภาคเหนือ' : 
                     province.region === 'south' ? 'ภาคใต้' : 
                     province.region === 'central' ? 'ภาคกลาง' : 'ภาคอีสาน'}
                  </small>
                  <br />
                  <p style={{ margin: '8px 0', fontSize: '12px' }}>
                    {province.description}
                  </p>
                  {onProvinceSelect && (
                    <button
                      onClick={() => onProvinceSelect(province)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        marginTop: '4px'
                      }}
                    >
                      ดูรายละเอียด
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
        
        {/* Attraction Markers */}
        {showLayers.attractions && attractions.map((attraction) => {
          const coords = parseCoordinates(attraction.coordinates);
          return coords ? (
            <Marker
              key={`attraction-${attraction.id}`}
              position={coords}
              icon={attractionIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ color: '#16a34a' }}>🏛️ {attraction.name}</strong>
                  {attraction.name_en && (
                    <>
                      <br />
                      <em style={{ color: '#64748b' }}>{attraction.name_en}</em>
                    </>
                  )}
                  <br />
                  <small style={{ 
                    backgroundColor: '#f0fdf4', 
                    color: '#15803d', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {attraction.type === 'temple' ? 'วัด' :
                     attraction.type === 'market' ? 'ตลาด' :
                     attraction.type === 'beach' ? 'หาด' :
                     attraction.type === 'mountain' ? 'ภูเขา' :
                     attraction.type === 'landmark' ? 'สถานที่สำคัญ' : attraction.type}
                  </small>
                  <p style={{ margin: '8px 0', fontSize: '12px', lineHeight: '1.4' }}>
                    {attraction.description}
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {attraction.rating && (
                      <div>⭐ {attraction.rating}/5</div>
                    )}
                    {attraction.estimated_duration && (
                      <div>⏱️ {attraction.estimated_duration} ชม.</div>
                    )}
                    {attraction.entrance_fee !== undefined && (
                      <div>💰 {attraction.entrance_fee === 0 ? 'ฟรี' : `${attraction.entrance_fee} บาท`}</div>
                    )}
                    {attraction.opening_hours && (
                      <div>🕐 {attraction.opening_hours}</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
        
        {/* Selected Location Marker */}
        {selectedCoordinates && (
          <Marker 
            position={[selectedCoordinates.lat, selectedCoordinates.lng]}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>📍 ตำแหน่งที่เลือก</strong><br/>
                <small>Lat: {selectedCoordinates.lat.toFixed(4)}</small><br/>
                <small>Lng: {selectedCoordinates.lng.toFixed(4)}</small>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Map Click Handler */}
        <MapClickHandler onMapClick={onMapClick} />
        
        {/* Food Markers */}
        {showLayers.foods && foods.map((food) => {
          const coords = parseCoordinates(food.coordinates);
          return coords ? (
            <Marker
              key={`food-${food.id}`}
              position={coords}
              icon={foodIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ color: '#ea580c' }}>🍜 {food.name}</strong>
                  {food.name_en && (
                    <>
                      <br />
                      <em style={{ color: '#64748b' }}>{food.name_en}</em>
                    </>
                  )}
                  <br />
                  <small style={{ 
                    backgroundColor: '#fff7ed', 
                    color: '#c2410c', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {food.type === 'local_dish' ? 'อาหารพื้นเมือง' :
                     food.type === 'dessert' ? 'ขนมหวาน' :
                     food.type === 'street_food' ? 'อาหารข้างถนน' : food.type}
                  </small>
                  <p style={{ margin: '8px 0', fontSize: '12px', lineHeight: '1.4' }}>
                    {food.description}
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {food.price_range && (() => {
                      const priceRange = safeJsonParse(food.price_range, { min: 0, max: 0 });
                      return <div>💰 {priceRange.min}-{priceRange.max} บาท</div>;
                    })()}
                    {food.recommended_places && (() => {
                      const places = safeArrayParse(food.recommended_places, []);
                      return (
                        <div style={{ marginTop: '4px' }}>
                          <strong>ร้านแนะนำ:</strong>
                          <div style={{ fontSize: '10px', marginTop: '2px' }}>
                            {places.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
        
        {/* Activity Markers */}
        {showLayers.activities && activities.map((activity) => {
          const coords = parseCoordinates(activity.coordinates);
          return coords ? (
            <Marker
              key={`activity-${activity.id}`}
              position={coords}
              icon={activityIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ color: '#7c3aed' }}>🎯 {activity.name}</strong>
                  {activity.name_en && (
                    <>
                      <br />
                      <em style={{ color: '#64748b' }}>{activity.name_en}</em>
                    </>
                  )}
                  <br />
                  <small style={{ 
                    backgroundColor: '#faf5ff', 
                    color: '#6b21a8', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {activity.type === 'cultural' ? 'วัฒนธรรม' :
                     activity.type === 'adventure' ? 'ผจญภัย' :
                     activity.type === 'cycling' ? 'ปั่นจักรยาน' :
                     activity.type === 'hiking' ? 'เดินป่า' :
                     activity.type === 'diving' ? 'ดำน้ำ' : activity.type}
                  </small>
                  <p style={{ margin: '8px 0', fontSize: '12px', lineHeight: '1.4' }}>
                    {activity.description}
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {activity.duration && (
                      <div>⏱️ {activity.duration} ชม.</div>
                    )}
                    {activity.difficulty_level && (
                      <div>📊 ระดับ: {activity.difficulty_level === 'easy' ? 'ง่าย' :
                                    activity.difficulty_level === 'medium' ? 'ปานกลาง' :
                                    activity.difficulty_level === 'hard' ? 'ยาก' : activity.difficulty_level}</div>
                    )}
                    {activity.price_range && (() => {
                      const priceRange = safeJsonParse(activity.price_range, { min: 0, max: 0 });
                      return <div>💰 {priceRange.min}-{priceRange.max} บาท</div>;
                    })()}
                    {activity.season && (
                      <div>📅 {activity.season}</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div style={{
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '8px' }}>คำอธิบายสัญลักษณ์</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%'
            }}></div>
            <span>📍 ตำแหน่งของคุณ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }}></div>
            <span>🏛️ จังหวัดท่องเที่ยว</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#16a34a',
              borderRadius: '50%'
            }}></div>
            <span>🏛️ สถานที่ท่องเที่ยว</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ea580c',
              borderRadius: '50%'
            }}></div>
            <span>🍜 ร้านอาหาร</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#7c3aed',
              borderRadius: '50%'
            }}></div>
            <span>🎯 กิจกรรม</span>
          </div>
        </div>
        <div style={{ color: '#64748b', marginTop: '8px', fontSize: '11px' }}>
          💡 คลิกที่จุดต่างๆ เพื่อดูรายละเอียด • ใช้ checkbox ด้านซ้ายเพื่อเปิด/ปิดการแสดงผล
        </div>
      </div>
    </div>
  );
};

export default MapComponent;