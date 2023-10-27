import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  TextInput,
  Button,
  RadioButton,
  Text,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState();

  const submitForm = () => {
    if (!name || !email || !mobile || !address || !city) {
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

    firestore()
      .collection('employees')
      .add({
        name,
        email,
        mobile,
        address,
        gender,
        city,
      })
      .then(() => {
        console.log('Employee added!');
      })
      .catch(error => {
        console.error('Error adding employee: ', error);
      });

    // Clear form fields
    setName('');
    setEmail('');
    setMobile('');
    setAddress('');
    setGender('');
    setCity('');
  };

  const validateEmail = email => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateMobile = mobile => {
    return /^[0-9]{10}$/.test(mobile);
  };
  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'female',
        value: 'female',
      },
      {
        id: '2',
        label: 'male',
        value: 'male',
      },
    ],
    [],
  );

  return (
    <View style={{flex: 1, padding: 20}}>
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
      {/* <RadioButton.Group onValueChange={(value) => setGender(value)} value={gender}>
        <View>
          <Text>Male</Text>
          <RadioButton value="male" />
        </View>
        <View>
          <Text>Female</Text>
          <RadioButton value="female" />
        </View>
      </RadioButton.Group> */}
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setGender}
        selectedId={gender}
      />

      <Picker
        selectedValue={city}
        onValueChange={(itemValue, itemIndex) => setCity(itemValue)}>
        <Picker.Item label="Gujarat" value="Gujarat" />
        <Picker.Item label="Panjab" value="Panjab" />
        <Picker.Item label="Surat" value="Surat" />
      </Picker>

      <Button title="Submit" onPress={submitForm} />
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
export default App;
