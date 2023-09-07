import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, RefreshControl } from 'react-native'; // Import RefreshControl
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageWithTitle from '../components/ImageWithTitle';
import ModalImg from '../components/Modal';

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Add a state for refreshing
  const [page, setPage] = useState(1); // Initial page
  const [hasMore, setHasMore] = useState(true); // Whether there is more data to 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  

  useEffect(() => {

    const getImages = async () => {
      try {
        const res = await axios.get(
          "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s"
        );

        if (res.data && res.data.photos && res.data.photos.photo) {
          console.log("axios res =>",res.data.photos.photo.length);
          setData(res.data.photos.photo);
          await AsyncStorage.setItem('imageData', JSON.stringify(res.data.photos.photo));
        } else {
          console.error("API response structure is unexpected:", res.data);
        }
      } catch (err) {
        console.log(err);
        const cache = await AsyncStorage.getItem('imageData');
        if (cache) {
          console.log("Giving Cached images =>", cache.length);
          setData(JSON.parse(cache));
        }
      }
    };

    getImages();
  }, []);


  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem("imageData");
      console.log('Storage successfully cleared!');
    } catch (e) {
      console.log('Failed to clear the async storage.');
    }
  };
  
  const getStoragelength = async () => {
    try {
      const size=await AsyncStorage.getItem('imageData');
      console.log(size.length);
    } catch (e) {
      console.log('Failed to clear the async storage.');
    }
  };

//   useEffect(() => {
//     const loadImageData = async () => {
//       try {
//         const cachedData = await AsyncStorage.getItem('imageData');
//         if (cachedData !== null) {
//           setData(JSON.parse(cachedData));
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     loadImageData();
//   }, []);

  useEffect(() => {
    const newPairs = splitDataIntoPairs(data);
    setPairs(newPairs);
  }, [data]);

  const splitDataIntoPairs = (data) => {
    let pairs = [];
    if (data !== null) {
      for (let i = 0; i < data.length; i += 2) {
        pairs.push([data[i], data[i + 1]]);
      }
    }
    return pairs;
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true); // Start the refreshing indicator
    setPage(1);

    try {
      const res = await axios.get("https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s");

      if (res.data && res.data.photos && res.data.photos.photo) {
        clearStorage();
        console.log("refreshed data =>",res.data.photos.photo.length);
        setData(res.data.photos.photo);
        await AsyncStorage.setItem('imageData', JSON.stringify(res.data.photos.photo));
        getStoragelength();

      } else {
        console.error("API response structure is unexpected:", res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false); // Stop the refreshing indicator
    }
  };

  //onclick on the images
  const handleImagePress = (imageSource) => {
    setSelectedImage(imageSource);
    setModalVisible(true);
  };
  

  //scroll functionality
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 600;
  
    if (isCloseToBottom && hasMore && !refreshing) {
      // Fetch more data
      loadMoreData();
    }
  };
  
  const loadMoreData = async () => {
    console.log("More data on the way....","Page number: ",page);
    setRefreshing(true);
  
    try {
      const res = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=${page + 1}&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s`
      );
      // setPage(page+1);
  
      if (res.data && res.data.photos && res.data.photos.photo) {
        const newData = res.data.photos.photo;
  
        // Concatenate new data with existing data
        setData((prevData) => [...prevData, ...newData]);
        setPage(page + 1);
        await AsyncStorage.setItem('imageData', JSON.stringify(data));
      } 
      else {
        console.error("API response structure is unexpected:", res.data);
      }
      if (!res.data || !res.data.photos || !res.data.photos.photo || res.data.photos.photo.length === 0) {
        setHasMore(false); // No more data to fetch
        console.log("No more Images to fetch");
      }
      
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      onScroll={handleScroll} // Attach the scroll handler
      scrollEventThrottle={2} // Adjust as needed
    >
      {pairs.map((pair, index) => (
        <View
          style={styles.imageRow}
          key={index}
        >
          {pair[0] && (
            <ImageWithTitle
              imageSource={pair[0].url_s}
              title={pair[0].title}
              onPress={()=>handleImagePress(pair[0])}
            />
          )}
          {pair[1] && (
            <ImageWithTitle
              imageSource={pair[1].url_s}
              title={pair[1].title}
              onPress={()=>handleImagePress(pair[1])}
            />
          )}
        </View>
      ))}
      { selectedImage && modalVisible && <ModalImg modalVisible={modalVisible} setModalVisible={setModalVisible} title={selectedImage.title} imgurl={selectedImage.url_s}/>}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor:"lightgrey"
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
