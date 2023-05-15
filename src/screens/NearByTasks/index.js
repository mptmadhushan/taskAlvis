// Integration of Google map in React Native using react-native-maps
// https://aboutreact.com/react-native-map-example/

// Import React
import React ,{useEffect} from 'react';
// Import required components
import {SafeAreaView,Button,Text,PermissionsAndroid,StyleSheet,ScrollView,TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import Map and Marker
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import style from './mapViewStyle';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {getAllTask} from '../../api/getAllTask';
import Geolocation from 'react-native-geolocation-service';


export function NearByTasks  ({navigation}) {
  const handleBackButton = () => {
    navigation?.goBack();
  };
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');
  // const [location, setLocation] = React.useState('');
  const [task, setTasks] = React.useState([]);
  const [error, setError] = React.useState("");
  const [location, setLocation] = React.useState(false);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  
  const getLocation = () => {

    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };
  const markerTask =[{lat:7.2905715,lng:80.6337362},
    {lat:7.2957725,lng:80.6307462},
   ]
  useEffect(() => {
    getLocation()
    getAllTask()
    .then(response => {
      if (response.error) {
        console.log('error__<', response.error);
        return;
      }
      const {data} = response;
      let result = data.map(a => JSON.parse(a.location));
      console.log('res',result);
      setTasks([{lat:7.2905715,lng:80.6337362},
      {lat:7.2905725,lng:80.6337462},
     ]
      )

      // navigation.navigate('Home');
    })
    .catch(error => {
      console.log('error-->', error);
      // showToast(error.responses);
    })
    .finally(() => {});
  }, []);
  return (
     
      <View style={{display:'flex',width:'100%',height:'100%'}}>
  {/* <Text>Welcome!</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Send Location" />
      </View> */}
  <MapView  
    style={styles.mapStyle}  
    showsUserLocation={false}  
    zoomEnabled={true}  
    zoomControlEnabled={true}  
    initialRegion={{  
      latitude: 7.2905715,   
      longitude: 80.6337262,  
      latitudeDelta: 0.0922,  
      longitudeDelta: 0.0421,  
    }}>  
 {markerTask.map(marker => (
    <Marker  
      draggable
      onDragEnd={(e) => console.log(e.nativeEvent.coordinate)}
      coordinate={{ latitude: marker.lat, longitude:marker.lng}}  
      title={"pick"}  
      description={"Select your location"}  
    />  ))}
    {/* <Marker  
      draggable
      onDragEnd={(e) => console.log(e.nativeEvent.coordinate)}
      coordinate={{ latitude: location?.coords?.latitude, longitude: location?.coords?.longitude}}  
      title={"pick"}  
      description={"Select your location"}  
    />  */}
  </MapView>  
    
</View>    
    
  );
};
           
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