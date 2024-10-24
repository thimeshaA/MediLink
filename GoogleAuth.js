// import React, { useState } from 'react';
// import { Button, View, Text } from 'react-native';
// import * as Google from 'expo-auth-session/providers/google';
// import { firebase } from './firebase';

// export default function GoogleAuth() {
//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     expoClientId: '891162909037-ucjjdsdlm79k5r1r7m44k99pvl8fe7hg.apps.googleusercontent.com',
//     iosClientId: '1:930929626458:ios:74887b80f7c0418b24b763',
//     androidClientId: '1:930929626458:android:e39c3e7f0683aaee24b763',
//     webClientId: '1:930929626458:web:70c02f60cd9b544a24b763', 
//   });

//   const [user, setUser] = useState(null);

//   React.useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;

//       const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
//       firebase.auth().signInWithCredential(credential).then((userCredential) => {
//         setUser(userCredential.user);
//       }).catch((error) => {
//         console.error(error);
//       });
//     }
//   }, [response]);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {user ? (
//         <Text>Welcome, {user.displayName}</Text>
//       ) : (
//         <Button
//           disabled={!request}
//           title="Login with Google"
//           onPress={() => {
//             promptAsync();
//           }}
//         />
//       )}
//     </View>
//   );
// }