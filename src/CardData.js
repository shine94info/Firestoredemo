import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CardData = ({navigation}) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('employees')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setEmployees(data);
      });

    // Unsubscribe from the snapshot when no longer needed
    return () => unsubscribe();
  }, []);

  const handleDelete = item => {
    firestore()
      .collection('employees')
      .doc(item.id)
      .delete()
      .then(() => {
        console.log('Employee successfully deleted!');
      })
      .catch(error => {
        console.error('Error removing employee: ', error);
      });
  };

  const updateEmployee = ( item) => {
    navigation.navigate('FormScreen', {
       employee: item,
    });
    console.log('item:::::::',item)

  };

  const renderItem = ({item}) => (

    <View style={styles.container}>
      <View style={styles.cardview}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => updateEmployee(item)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Text>Name: <Text>{item.name}</Text></Text>
      <Text>Email: <Text>{item.email}</Text></Text>
      <Text>Mobile: <Text>{item.mobile}</Text></Text>
      <Text>Address: <Text>{item.address}</Text></Text>
      <Text>Gender: <Text>{item.gender}</Text></Text>
      <Text>City: <Text>{item.city}</Text></Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      {/* {item.uri && <Image source={{ uri: item.uri }} style={styles.image} />} */}
    </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  cardview: {
    borderWidth: 1,
    backgroundColor: '#F2FFF4',
    borderRadius: 20,
    padding: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default CardData;
