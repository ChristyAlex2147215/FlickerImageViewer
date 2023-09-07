import { Modal, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react'

const ModalImg = ({modalVisible,setModalVisible,title,imgurl}) => {
  return (
    <Modal

  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}>
  <TouchableOpacity style={styles.modalContainer} onPress={()=>{setModalVisible(!modalVisible)}}>
    <Text style={{fontSize:16,color:"white",marginTop:50}}>{title}</Text>
    <Image source={{ uri: imgurl }} style={styles.modalImage} />
    <TouchableOpacity onPress={() => setModalVisible(false)}>
      <Text style={styles.closeText}>Close</Text>
    </TouchableOpacity>
  </TouchableOpacity>
    </Modal>

  )
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding:5,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Transparent dark background
      },
      modalImage: {
        width:"98%",
        height:"50%",
        resizeMode: 'contain', // Adjust this based on how you want to display the image
      },
      closeText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
      },
      
      
      
})

export default ModalImg;
