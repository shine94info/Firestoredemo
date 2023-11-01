import {createStackNavigator} from '@react-navigation/stack';
import FormScreen from '../Form';
import CardData from '../CardData';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="CardData" component={CardData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MyStack;



// Import the necessary components from React and React Native
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   TextInput,
//   Button,
//   RadioButton,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage'; // Import the storage module
// import { Picker } from '@react-native-picker/picker';
// import RadioGroup from 'react-native-radio-buttons-group';
// import ImagePicker from 'react-native-image-picker'; // Import ImagePicker

// const FormScreen = ({ navigation, route }) => {
//   // ... Existing code

//   // Function to handle image upload
//   const handleImageUpload = async () => {
//     const options = {
//       title: 'Select Image',
//       storageOptions: {
//         skipBackup: true,
//         path: 'images',
//       },
//     };

//     ImagePicker.showImagePicker(options, response => {
//       console.log('Response = ', response);

//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else {
//         const { uri } = response;
//         const filename = uri.substring(uri.lastIndexOf('/') + 1);

//         const reference = storage().ref(`images/${filename}`);
//         const task = reference.putFile(uri);

//         task.then('state_changed', taskSnapshot => {
//           console.log(
//             `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
//           );
//         });

//         task.then(() => {
//           console.log('Image uploaded to the bucket!');
//           // Now, you can save the image URL to Firestore or perform any other necessary action
//         });
//       }
//     });
//   };

//   // ... Existing code

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       {/* ... Existing code */}
//       <Button title="Choose Image" onPress={handleImageUpload} />
//     </View>
//   );
// };

// // ... Remaining code remains unchanged

// // ... Existing code

// const handleImageUpload = async () => {
//   // ImagePicker configuration
//   const options = {
//     title: 'Select Image',
//     storageOptions: {
//      , skipBackup: true,
//       path: 'images'
//     },
//   };

//   // Show ImagePicker
//   ImagePicker.showImagePicker(options, response => {
//     console.log('Response = ', response);

//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//     } else if (response.error) {
//       console.log('ImagePicker Error: ', response.error);
//     } else {
//       const { uri } = response;
//       const filename = uri.substring(uri.lastIndexOf('/') + 1);

//       // Upload the image to Firebase storage
//       const reference = storage().ref(`images/${filename}`);
//       const task = reference.putFile(uri);

//       task.on('state_changed', taskSnapshot => {
//         console.log(
//           `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
//         );
//       });

//       task.then(async () => {
//         console.log('Image uploaded to the bucket!');

//         // Get the image URL
//         const url = await storage()
//           .ref(`images/${filename}`)
//           .getDownloadURL();

//         // Create a new data object that includes the image URL
//         const dataWithImage = {
//           name,
//           email,
//           mobile,
//           address,
//           gender,
//           city,
//           imageUrl: url, // Add the image URL to the data object
//         };

//         // Save the data object to Firestore
//         if (route.params && route.params.employee) {
//           const { id } = route.params.employee;

//           firestore()
//             .collection('employees')
//             .doc(id)
//             .update(dataWithImage)
//             .then(() => {
//               console.log('Employee updated!');
//               navigation.navigate('CardData');
//             })
//             .catch(error => {
//               console.error('Error updating employee: ', error);
//             });
//         } else {
//           firestore()
//             .collection('employees')
//             .add(dataWithImage)
//             .then(() => {
//               console.log('Employee added!');
//               navigation.navigate('CardData');
//             })
//             .catch(error => {
//               console.error('Error adding employee: ', error);
//             });
//         }
//       });
//     }
//   });
// };

// // ... Remaining code remains unchanged

