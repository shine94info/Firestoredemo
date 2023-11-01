import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';

const CardData = ({navigation}) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  const updateEmployee = item => {
    navigation.navigate('FormScreen', {
      employee: item,
    });
    console.log('item:::::::', item);
  };

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({item}) => {
    console.log('Item:', item); // Logging the entire item object
    return (
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
          {/* {item.imageUrl && (
            <Image
              source={{uri: item.imageUrl}}
              style={{height: 100, width: 120}}
            />
          )} */}
          
          <Text>Name: {item.name}</Text>
          <Text>Email: {item.email}</Text>
          {/* <TouchableOpacity onPress={() => handleCall(item.mobile)}>
            <Text style={styles.phoneNumber}>{item.mobile}</Text>
          </TouchableOpacity> */}
          <View style={styles.phoneNumberContainer}>
        <Image
          source={{
            uri:
              'https://play.google.com/store/apps/details?id=info.kfsoft.phonemanager&hl=en_US',
          }}
          style={styles.image}
        />
        <TouchableOpacity onPress={() => handleCall(item.mobile)}>
          <Text style={styles.phoneNumber}>{item.mobile}</Text>
        </TouchableOpacity>
      </View>
          <Text>Address: {item.address}</Text>
          <Text>Gender: {item.gender}</Text>
          <Text>City: {item.selectedCity}</Text>{' '}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {/* <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}
      <FlatList
        data={searchQuery ? filteredEmployees : employees}
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
  searchInput: {
    borderWidth: 1,
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
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  phoneNumber: {
    color: 'blue', // You can use any color of your choice
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});

export default CardData;
