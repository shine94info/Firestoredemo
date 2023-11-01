import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  TextInput,
  Button,
  RadioButton,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Picker} from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';
import DropDownPicker from 'react-native-dropdown-picker';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const FormScreen = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('female');
  
  // const [city, setCity] = useState();
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    {label: 'Ahmedabad', value: 'Ahmedabad'},
    {label: 'Surat', value: 'Surat'},
    // Add more cities as needed
  ];

  const [uploadimage, setUploadImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //setIsLoading(false);
    if (route.params && route.params.employee) {
      console.log(route.params.employee);
      const {name, email, mobile, address, gender, selectedCity, imageUrl} =
        route.params.employee;
      setName(name);
      setEmail(email);
      setMobile(mobile);
      setAddress(address);
      setGender(gender);
      setSelectedCity(selectedCity);
      setUrl(imageUrl || '');
    }
    
  }, [route.params]);

  const handleImageUpload = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      setIsLoading(true);
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        console.log('uri????', uri);
        const filename = uri.substring(uri.lastIndexOf('/'));
        console.log('filename', filename);

        // Upload the image to Firebase storage
        const reference = storage().ref(`images/${filename}`);
        const task = reference.putFile(uri);

        task.on('state_changed', taskSnapshot => {
          if (taskSnapshot.bytesTransferred === taskSnapshot.totalBytes) {
            setIsLoading(false);
          }
        });

        task
          .then(async () => {
            console.log('Image uploaded to the bucket!');

            // Get the image URL
            try {
              const downloadURL = await storage()
                .ref(`images/${filename}`)
                .getDownloadURL();
              console.log('Image URL:', downloadURL);
              setUploadImage(downloadURL);
              setUrl(downloadURL);
            } catch (error) {
              console.error('Error getting download URL: ', error);
            }
          })
          .catch(error => {
            console.error('Error uploading image to storage: ', error);
          });
      }
    });
  };

  const submitForm = () => {
    if (!name || !email || !mobile || !address || !selectedCity) {
      alert('Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!validateMobile(mobile)) {
      alert('Please enter a valid mobile number');
      return;
    }
  
    const data = {
      name,
      email,
      mobile,
      address,
      gender,
      selectedCity,
      imageUrl: url,
    
    };
    console.log('data', data);

    if (route.params && route.params.employee) {
      const {id} = route.params.employee;
      console.log('Employee ID:', id);

      firestore()
        .collection('employees')
        .doc(id)
        .update(data)
        .then(() => {
          console.log('Employee updated!');
          navigation.navigate('CardData');
          setUrl(''); 
        })
        .catch(error => {
          console.error('Error updating employee: ', error);
        });
    } else {
      firestore()
        .collection('employees')
        .add(data)
        .then(() => {
          console.log('Employee added!');
          navigation.navigate('CardData');
        })
        .catch(error => {
          console.error('Error adding employee: ', error);
        });
    }
  };

  const validateEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validateMobile = mobile => {
    return /^[0-9]{10}$/.test(mobile);
  };
  const radioButtons = useMemo(
    () => [
      {
        id: 1,
        label: 'female',
        value: 'female',
      },
      {
        id: 2,
        label: 'male',
        value: 'male',
      },
    ],
    [],
  );
  const sendData = () => {
    navigation.navigate('CardData');
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <TouchableOpacity onPress={sendData}>
        <Text style={{textAlign: 'right', fontSize: 20, color: 'black'}}>
          List
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.Textinput}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.Textinput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.Textinput}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.Textinput}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Text>Gender:</Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setGender}
        selectedId={gender}
      />
      <DropDownPicker
        open={open}
        value={selectedCity}
        items={cities}
        setOpen={setOpen}
        setValue={setSelectedCity}
        style={{marginTop: 20}}
        placeholder="Select a city"
        dropDownContainerStyle={{marginTop: 2}}
      />
      <View style={styles.btn}>
        <Button title="Choose Image" onPress={handleImageUpload} />
      </View>

      {/* <View style={styles.btn}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Submit" onPress={submitForm} />
          )}
        </View> */}
        <View style={styles.buttonContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loaderText}>Uploading Image...</Text>
          </View>
        ) : (
          <Button title="Submit" onPress={submitForm} />
        )}
      </View>
      {/* <TouchableOpacity style={{}} onPress={sendData}>
        <Text style={{textAlign: 'right', fontSize: 20}}>List</Text>
      </TouchableOpacity> */}
      {/* <Image source={{uri:url}} style={{height:200,width:200,}} ></Image> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Textinput: {
    borderWidth: 1,
    height: 50,
    marginTop: 20,
  },
  btn: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
export default FormScreen;
