
import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential,FacebookAuthProvider} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { AccessToken, LoginManager } from 'react-native-fbsdk-next';


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
    // Google authentication session hook
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '891162909037-o6oc3ipnecmtnu1brsm8dv1048s8qlmn.apps.googleusercontent.com',
        iosClientId: '1:930929626458:ios:74887b80f7c0418b24b763',
        androidClientId: '1:930929626458:android:e39c3e7f0683aaee24b763',
        webClientId: '1:930929626458:web:70c02f60cd9b544a24b763', 
        // redirectUri: 'https://auth.expo.io/@thimesha/authenticationApp',
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
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder='Password'
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUp} style={styles.buttonOutLine}>
                    <Text style={styles.buttonOutLineText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFacebookSignIn} style={styles.facebookButton}>
                    <Text style={styles.buttonText}>Sign in with Facebook</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutLine: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    googleButton: {
        backgroundColor: '#DB4437',
        marginTop: 10,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    facebookButton: {
        backgroundColor: '#4267B2',
        marginTop: 10,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutLineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
});
