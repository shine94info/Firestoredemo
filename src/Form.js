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
import {Picker} from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';

const FormScreen = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('female');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (route.params && route.params.employee) {
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

//   const submitForm = () => {
//     if (!name || !email || !mobile || !address || !city) {
//       alert('Please fill in all fields');
//       return;
//     }
//     if (!validateEmail(email)) {
//       alert('Please enter a valid email address');
//       return;
//     }

//     if (!validateMobile(mobile)) {
//       alert('Please enter a valid mobile number');
//       return;
//     }

//     const data = {
//       name,
//       email,
//       mobile,
//       address,
//       gender,
//       city,
//     };

//     if (route.params && route.params.employee) {
//       const {id} = route.params.employee;
//       console.log('id:::::::::',id);
//       firestore()
//         .collection('employees')
//         .doc(id)
//         .set(data)
//         .then(() => {
//           console.log('Employee updated!');
//           navigation.navigate('CardData');
//         })
//         .catch(error => {
//           console.error('Error updating employee: ', error);
//         });
//     } else {
//       firestore()
//         .collection('employees')
//         .add(data)
//         .then(() => {
//           console.log('Employee added!');
//           navigation.navigate('CardData');
//         })
//         .catch(error => {
//           console.error('Error adding employee: ', error);
//         });
//     }
//   };
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
  
    const data = {
      name,
      email,
      mobile,
      address,
      gender,
      city,
    };
  
    if (route.params && route.params.employee) {
        const { id } = route.params.employee;
        console.log('Employee ID:', id); // Add this line to verify the ID
    
        firestore()
          .collection('employees')
          .doc(id)
          .update(data)
          .then(() => {
            console.log('Employee updated!');
            navigation.navigate('CardData');
          })
          .catch((error) => {
            console.error('Error updating employee: ', error);
          });
      }else {
      firestore()
        .collection('employees')
        .add(data)
        .then(() => {
          console.log('Employee added!');
          navigation.navigate('CardData');
        })
        .catch((error) => {
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
    // let formDetails = {
    //   name,
    //   email,
    //   mobile,
    //   gender,
    //   city,
    // };
    navigation.navigate('CardData');

    // Clear form fields
    // setName('');
    // setEmail('');
    // setMobile('');
    // setAddress('');
    // setGender('');
    // setCity('');
  };
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
      <TouchableOpacity style={{}} onPress={sendData}>
        <Text style={{textAlign: 'right', fontSize: 20}}>List</Text>
      </TouchableOpacity>
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
