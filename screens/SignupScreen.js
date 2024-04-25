import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, FormErrorMessage, HeaderComponent, Button } from '../components';
import { Colors, auth, db } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { fetchUserByPhoneNumber } from '../services';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility
  } = useTogglePasswordVisibility();

  const handleSignup = async values => {

    const { email, password, firstName, lastName, phoneNumber } = values;

    try {
      // Check if email is already registered in Firebase Authentication
      const emailExists = await fetchSignInMethodsForEmail(auth, email);
      if (emailExists.length > 0) {
        showAlert('Email is already registered.');
        return; // Stop signup process
      }

      // Check if phone number is already registered in Firebase Users collection
      const phoneNumberSnapshot = await fetchUserByPhoneNumber(phoneNumber);
      if (phoneNumberSnapshot) {
        showAlert('Phone number is already registered.');
        return; // Stop signup process
      }

      // If email and phone number are not already registered, proceed with signup
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
      const memberNumber = parseInt(timestamp.toString().slice(-3) + randomNum.toString().slice(-7));

      if (result) {
        const user = {
          email,
          phoneNumber,
          firstName,
          lastName,
          memberNumber
        }
        await setDoc(doc(db, "users", result.user.uid), user);
        showAlert('Account has been created successfully');
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log('error', error);
      setErrorState(error.message);
    }
  };

  const showAlert = message => {
    if (Alert.alert) {
      Alert.alert(message);
    } else {
      console.log(message);
    }
  };

  return (
    <>
      <HeaderComponent navigationTo={"LoginScreen"} navigation={navigation} />
      <View style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.logoContainer}>
            <Text style={styles.screenTitle}>Create a new account!</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
            }}
            validationSchema={signupValidationSchema}
            onSubmit={values => handleSignup(values)}
          >
            {({
              values, touched, errors, handleChange, handleSubmit, handleBlur
            }) => (
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
                  onBlur={handleBlur('email')} />
                <FormErrorMessage error={errors.email} visible={touched.email} />

                <TextInput
                  name='phoneNumber'
                  leftIconName='phone'
                  placeholder='Enter Phone Number'
                  autoCapitalize='none'
                  keyboardType='number-pad'
                  textContentType='telephoneNumber'
                  autoFocus={true}
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')} />
                <FormErrorMessage error={errors.phoneNumber} visible={touched.phoneNumber} />

                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='Enter password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='newPassword'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')} />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password} />

                <TextInput
                  name='confirmPassword'
                  leftIconName='key-variant'
                  placeholder='Confirm password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={confirmPasswordVisibility}
                  textContentType='password'
                  rightIcon={confirmPasswordIcon}
                  handlePasswordVisibility={handleConfirmPasswordVisibility}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')} />
                <FormErrorMessage
                  error={errors.confirmPassword}
                  visible={touched.confirmPassword} />

                <TextInput
                  name='firstName'
                  placeholder='Enter First Name'
                  autoCapitalize='none'
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')} />
                <FormErrorMessage error={errors.firstName} visible={touched.firstName} />

                <TextInput
                  name='lastName'
                  placeholder='Enter Last Name'
                  autoCapitalize='none'
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')} />
                <FormErrorMessage error={errors.lastName} visible={touched.lastName} />

                {errorState !== '' ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Signup</Text>
                </Button>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
    zIndex: -1
  },
  logoContainer: {
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
