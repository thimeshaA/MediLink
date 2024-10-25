import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, FacebookAuthProvider } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { GOOGLE_androidClientId, GOOGLE_iosClientId, GOOGLE_expoClientId } from '@env';


WebBrowser.maybeCompleteAuthSession(); // To handle the web browser behavior

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    // Facebook authentication session hook  
    const handleFacebookSignIn = async () => {
        try {
            console.log('Attempting Facebook Login...');

            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            console.log('Login Result:', result);

            if (result.isCancelled) {
                console.log('User cancelled the login process');
                return;
            }

            const data = await AccessToken.getCurrentAccessToken();
            console.log('Access Token Data:', data);

            if (!data) {
                console.error('Something went wrong obtaining access token');
                return;
            }

            const credential = FacebookAuthProvider.credential(data.accessToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;
            console.log('Logged in with Facebook:', user.email);
        } catch (error) {
            console.error('Facebook Sign-In Error:', error);
        }
    };

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: GOOGLE_expoClientId,
        iosClientId: GOOGLE_iosClientId,
        androidClientId: GOOGLE_androidClientId,
        webClientId: GOOGLE_expoClientId,
    });
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("home");
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log('Logged in with Google:', user.email);
                })
                .catch(error => alert(error.message));
        }
    }, [response]);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered with:', user.email);
            })
            .catch(error => alert(error.message));
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
            })
            .catch(error => alert(error.message));
    };

    const handleGoogleSignIn = () => {
        promptAsync();
    };

    return (
        <KeyboardAvoidingView className="flex-1 justify-center items-center">
            <View className="w-4/5">
                <TextInput
                    placeholder='Enter your Email'
                    className="bg-white px-4 py-2 rounded-lg mt-2"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder='Enter your Password'
                    className="bg-white px-4 py-2 rounded-lg mt-2"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View className="w-4/5 justify-center items-center mt-10">
                <TouchableOpacity onPress={handleLogin} className=" bg-blue-600 w-full py-3 rounded-lg items-center">
                    <Text className="text-white font-bold text-lg">Login</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={handleSignUp} className="bg-white border-2 border-blue-600 w-full py-3 rounded-lg items-center mt-2">
                    <Text className="text-blue-600 font-bold text-lg">Register</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={handleGoogleSignIn} className="bg-red-500 w-full py-3 rounded-lg items-center mt-2">
                    <Text className="text-white font-bold text-lg">Sign in with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFacebookSignIn} className="bg-blue-800 w-full py-3 rounded-lg items-center mt-2">
                    <Text className="text-white font-bold text-lg">Sign in with Facebook</Text>
                </TouchableOpacity>
                <View className="flex flex-row mt-3"><Text>Already Has an Account? </Text><TouchableOpacity onPress={handleSignUp}><Text className="text-blue-600 underline">SignUp</Text></TouchableOpacity></View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
