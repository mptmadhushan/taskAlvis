// Integration of Google map in React Native using react-native-maps
// https://aboutreact.com/react-native-map-example/

// Import React
import React from 'react';
// Import required components
import {SafeAreaView,Text, StyleSheet,ScrollView,TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import Map and Marker
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import style from './mapViewStyle';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LocationPicker = ({navigation}) => {
  const handleBackButton = () => {
    navigation?.goBack();
  };
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');

  return (
     
      <View style={{disply:'flex',width:'100%',height:'100%'}}>
               {/* <View>
        <TouchableOpacity
          style={style.backButton}
          onPress={() => handleBackButton()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="gray" />
          <Text style={style.backText}>Back</Text>
        </TouchableOpacity>
      </View> */}
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: 'geometry', }}
            placeholder='Search'
            fetchDetails={true}
            styles={{width:400,borderColor:'blue',borderWidth:2}}
            onPress={(data, details = null) => {
              console.log("data", data);
              console.log("details", details);
              console.log(JSON.stringify(details?.geometry?.location));
              setLat(details?.geometry?.location.lat)
              setLng(details?.geometry?.location.lat)
            }}
            query={{
              key: 'AIzaSyCwwyOJUiBpHmDwJRrtNh53fpRfaJnHVKQ',
              language: 'en',
            }}
          />
           <View style={styles.MainContainer}>  
  
           <View style={styles.MainContainer}>  
  
  <MapView  
    style={styles.mapStyle}  
    showsUserLocation={false}  
    zoomEnabled={true}  
    zoomControlEnabled={true}  
    initialRegion={{  
      latitude: 28.579660,   
      longitude: 77.321110,  
      latitudeDelta: 0.0922,  
      longitudeDelta: 0.0421,  
    }}>  

    <Marker  
      draggable
      onDragEnd={(e) => console.log(e.nativeEvent.coordinate)}
      coordinate={{ latitude: 28.579660, longitude: 77.321110 }}  
      title={"JavaTpoint"}  
      description={"Java Training Institute"}  
    />  
  </MapView>  
    
</View>    
    
</View>  
      </View>
  );
};
           
export default LocationPicker;

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];

const styles = StyleSheet.create({
  MainContainer: {  
    position: 'absolute',  
    top: 100,  
    left: 0,  
    right: 0,  
    bottom: 0,  
    alignItems: 'center',  
    justifyContent: 'flex-end',  
  },  
  mapStyle: {  
    position: 'absolute',  
    top: 0,  
    left: 0,  
    right: 0,  
    bottom: 0,  
  },  
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});