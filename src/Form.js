import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  TextInput,
  Button,
  RadioButton,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Picker} from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const FormScreen = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('female');
  const [city, setCity] = useState('');
  const [url, setUrl] = useState('');
  const [uploadimage, setUploadImage] = useState('');

  useEffect(() => {
    if (route.params && route.params.employee) {
      console.log(route.params.employee);
      const {name, email, mobile, address, gender, city} =
        route.params.employee;
      setName(name);
      setEmail(email);
      setMobile(mobile);
      setAddress(address);

      setGender(gender);
      setCity(city);
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
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        console.log('uri????', uri);
        const filename = uri.substring(uri.lastIndexOf('/') );
        console.log('filename', filename);

        // Upload the image to Firebase storage
        const reference = storage().ref(`images/${filename}`);
        const task = reference.putFile(uri);

        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
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
              // Save the URL or perform any other necessary action with the URL here
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
    if (!name || !email || !mobile || !address) {
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
      city,
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
          //navigation.navigate('CardData');
        })
        .catch(error => {
          console.error('Error adding employee: ', error);
        });
    }
  };

  const validateEmail = email => {
    // return /\S+@\S+\.\S+/.test(email);
    return /^[a-zA-Z][a-zA-Z0-9._]+@gmail\.com$/.test(email);
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
      <View style={{ borderWidth: 1,
    borderColor: 'black',
    marginTop: 20,}}>
     
     <Picker
        selectedValue={city}
        onValueChange={(itemValue, itemIndex) => setCity(itemValue)}>
        <Picker.Item label="Gujarat" value="Gujarat" />
        <Picker.Item label="Panjab" value="Panjab" />
        <Picker.Item label="Surat" value="Surat" />
      </Picker>
      </View>
   
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

      <View style={{marginTop: 10}}>
        <Button title="Choose Image" onPress={handleImageUpload} />
      </View>

      <Button title="Submit" onPress={submitForm} />
      {/* <TouchableOpacity style={{}} onPress={sendData}>
        <Text style={{textAlign: 'right', fontSize: 20}}>List</Text>
      </TouchableOpacity> */}
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
});
export default FormScreen;
