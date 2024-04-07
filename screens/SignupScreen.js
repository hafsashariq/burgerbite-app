import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, Button, FormErrorMessage, HeaderComponent } from '../components';
import { Colors } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';

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

  const handleSignup = async () => {
    showAlert('User created');
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
          {/* LogoContainer: consits app logo and screen title */}
          <View style={styles.logoContainer}>
            <Text style={styles.screenTitle}>Create a new account!</Text>
          </View>
          {/* Formik Wrapper */}
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              dateOfBirth: ''
            }}
            validationSchema={signupValidationSchema}
            onSubmit={values => handleSignup(values)}
          >
            {({
              values, touched, errors, handleChange, handleSubmit, handleBlur
            }) => (
              <>
                {/* Input fields */}
                <TextInput
                  name='email'
                  leftIconName='email'
                  placeholder='Enter email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  autoFocus={true} // Only one autoFocus
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')} />
                <FormErrorMessage error={errors.email} visible={touched.email} />
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
                  placeholder='Confirm password' // Changed placeholder
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
                <TextInput
                  name='phoneNumber'
                  placeholder='Enter Phone Number'
                  autoCapitalize='none'
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')} />
                <TextInput
                  name='dateOfBirth'
                  placeholder='Enter Date Of Birth'
                  autoCapitalize='none'
                  value={values.dateOfBirth}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')} />
                <FormErrorMessage error={errors.dateOfBirth} visible={touched.dateOfBirth} />
                {/* Display Screen Error Messages */}
                {errorState !== '' ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Signup button */}
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
    padding: 16, // Adjust as needed
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
