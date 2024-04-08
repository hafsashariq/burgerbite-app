import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, Button, FormErrorMessage, HeaderComponent } from '../components';
import { Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = async values => {
    try {
      const { email, password } = values;
      console.log('Logging in with:', email, password); // Debug log
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!', result); // Debug log
      navigation.navigate("HomeScreen");
    }
    catch (error) {
      ///showAlert('Account has been updated successfully');
      console.log('Login error:', error); // Debug log
      setErrorState("Invalid email or password"); // Debug log.
    }
  }

  return (
    <>
      <HeaderComponent navigation={navigation} title="" />
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.innerContainer}>
            <Text style={styles.screenTitle}>Welcome back!</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
          >
            {({ handleSubmit, values, touched, errors, handleChange, handleBlur }) => (
              <>
                <TextInput
                  name='email'
                  leftIconName='email'
                  placeholder='Enter email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='Enter password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='password'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Create a new account?'}
            onPress={() => navigation.navigate('SignupScreen')}
          />
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.white,
    padding: 20
  },
  innerContainer: {
    alignItems: 'center'
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.yellow,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoginScreen;
