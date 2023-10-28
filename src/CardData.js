import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
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

  const updateEmployee = (id, data, item) => {
    navigation.navigate('FormScreen', {
      employee: item,
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.container}>
      <View style={styles.cardview}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => updateEmployee({item})}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Text>Name: {item.name}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Mobile: {item.mobile}</Text>
        <Text>Address: {item.address}</Text>
        <Text>Gender: {item.gender}</Text>
        <Text>City: {item.city}</Text>
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
