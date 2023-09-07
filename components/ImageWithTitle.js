import React from 'react';
import { View, Image, Text, StyleSheet,TouchableOpacity } from 'react-native';

const randomHeight=()=>
{
  return(Math.random()*50)
}

const ImageWithTitle = ({ imageSource, title,onPress }) => {
  let filterTitle=title
  if(title.length>20)
  {
    filterTitle=title.slice(0,20)+"..."
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
    <View >
      <Image source={{ uri: imageSource }} style={styles.image} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{filterTitle}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '50%',
    aspectRatio: 1, // Ensure a square aspect ratio
    padding:5,
  },
  image: {
    width:"100%",
    aspectRatio:1
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent grey background
    padding: 8,
  },
  title: {
    color: 'white', // Text color
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ImageWithTitle;
