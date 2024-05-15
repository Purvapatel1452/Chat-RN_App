import { Alert, Button, Image, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useState } from 'react'
import Background from '../components/Background'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Error from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';

const SignUp = () => {

  const navigation=useNavigation()

const [name,setName]=useState('')
const [nameVerify,setNameVerify]=useState(false)
const [email,setEmail]=useState('')
const [emailVerify,setEmailVerify]=useState(false)
const [mobile,setMobile]=useState('')
const [mobileVerify,setMobileVerify]=useState(false)
const [password,setPassword]=useState('')
const [passwordVerify,setPasswordVerify]=useState(false)
const [showPassword,setShowPassword]=useState(false)
const [otp,setOtp]=useState('')
const [showOtpInput, setShowOtpInput]=useState(false);
const [otpVerify,setOtpVerify]=useState(false)


function handlesendOtp(){
  fetch(`http://10.0.2.2:8000/chat/user/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {

      console.log("response zOtp",response.ok)
      if(!response.ok){
      console.log("ALressdy")
      Alert.alert('An Otp is already sent to this email. Please wait before requesting another OTP')
     }
     else{
      console.log("data")
      Alert.alert(
        'OTp Sent Successfully',
        '',
        [
          { text: 'OK', onPress: () => setShowOtpInput(true)},
        
        ],
      );
      
     }
    })
    .catch((error) => {
      console.error('Error sending OTP:', error.message);
      Alert.alert("Error",'Failed to send OTP' )
    });
}

function handleVerifyOtp(){

  fetch('http://10.0.2.2:8000/chat/user/verify-otp',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify({email,otp})
  })
  .then((response)=>{

    console.log(response);
    if(response.ok){
        Alert.alert("Successfully Verified")
        setShowOtpInput(false)
        setOtpVerify(true)
      }
  else
  Alert.alert("Not Correct")

  })
  .then(data=>console.log(data))
  .catch((error)=>{
    console.log("Error:",error)
    Alert.alert('Failed to verify Otp')
  })


}


function handleSubmit(){

 

    
  const userData={
    name,
    email,
    mobile,
    password,
  }
  

  if(nameVerify && emailVerify && passwordVerify && mobileVerify){
    if(otpVerify){

     axios
    .post('http://10.0.2.2:8000/chat/user/register',userData)
    .then(res=>{
      console.log("tt",res.config.data)
      Alert.alert(JSON.stringify(res.data.message))
      navigation.navigate('Login')
      console.log("h")

    })
    .catch((e)=>{
      console.log("g")
      console.log("ERROR:",e)
      Alert.alert("User Already Exist")
  })
    }
  
  else{
    Alert.alert("Email is not Verified")
  
  }
}
  else{
    Alert.alert('Fill mandatory details')
    console.log('Fill mandatory details')
  }



}



function handleName(e){
  const nameVar=e
  setName(nameVar)
  setNameVerify(false)
  if(nameVar.length>1){
   setNameVerify(true)
  }
 }


 function handleEmail(e){
  const emailVar=e
  setEmail(emailVar)
  setEmailVerify(false)
  if(/^[\w.%+-]+@[\w,-]+\.[a-zA-Z]{1,}$/.test(emailVar)){
   setEmail(emailVar)
   setEmailVerify(true)
  }
 }

 function handleMobile(e){
  const mobileVar=e
  setMobile(mobileVar)
  setMobileVerify(false)
  if(/[6-9]{1}[0-9]{9}/.test(mobileVar)){
    setMobile(mobileVar)
    setMobileVerify(true)
  }
 }

 function handlePassword(e){
  const passwordVar=e;
  setPassword(passwordVar);
  setPasswordVerify(false)
  if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)){

    setPassword(passwordVar);
    setPasswordVerify(true)

  }



 }
console.log(password)
console.log(password.length)
  return (
 
  <ScrollView
  contentContainerStyle={{flexGrow:1}}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps='always'
  >

  

   
    <View style={{flex:1}}>
        <View style={styles.loginContainer}>

            <Text style={styles.text_header}>Register</Text>

            <View style={styles.action}>
                <FontAwesome name='user-o' color='#420475' style={styles.smallIcon} />
                <TextInput placeholder='Name' style={styles.textInput} onChangeText={e=>handleName(e)} placeholderTextColor={'gray'} />
                {
                  name.length<1?null:nameVerify?(
                    <Feather name='check-circle' color='green' size={20} />
                  ):(
                    <Error name="error" color='red' size={20} />
                  )
                }
            </View>
            {
              name.length<1?null:nameVerify?null:
              <Text style={{
                fontSize:12,
                color:'red'

              }}>
                Name should be more than 1 characters.
              </Text>
            }
            <View style={styles.action}>
                <MaterialCommunityIcons name='email-outline' color='#420475' style={styles.smallIcon} />
                <TextInput placeholder='Email' style={styles.textInput} onChangeText={e=>handleEmail(e)} placeholderTextColor={'gray'} />
                {
                  email.length<1?null:otpVerify?
                  <Feather name='check-circle' color='green' size={20} />
                :
                emailVerify?(
                  <View style={styles.button1}>
                     <TouchableHighlight style={styles.inBut1} onPress={()=>handlesendOtp()}>
                        <Text style={styles.textSign1}>Verify</Text>
                     </TouchableHighlight>
                </View>
                  // <Feather name='check-circle' color='green' size={20} />
                ):(
                  <Error name="error" color='red' size={20} />
                )
              
            }
            </View>
            {
              email.length<1?null:emailVerify?null:
              <Text style={{
                fontSize:12,
                marginRight:90,
                color:'red'

              }}>
                Enter Proper Email Address
              </Text>
            }
            {
              showOtpInput&&(
                
                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={showOtpInput}
        onRequestClose={() => setShowOtpInput(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10,margin:10 }}>
          <TextInput
                        placeholder="OTP"
                        onChangeText={setOtp}
                        value={otp}
                    />
                    <Button title="Verify OTP" onPress={()=>handleVerifyOtp()} />
            <Button title="Close" onPress={() => setShowOtpInput(false)} />
          </View>
        </View>
      </Modal>
    </View>
              
              )
            }
            <View style={styles.action}>
                <FontAwesome name='mobile' color='#420475' style={styles.Icon} />
                <TextInput placeholder='Mobile' style={styles.textInput} keyboardType='phone-pad' onChangeText={e=>handleMobile(e)} maxLength={10} placeholderTextColor={'gray'} />
                   {
                    mobile.length<1?null:mobileVerify?(
                      
                      <Feather name='check-circle' color='green' size={20} />
                    ):(
                      <Error name="error" color='red' size={20} />
                    )
                  }
                
            </View>
            {
              mobile.length<1?null:mobileVerify?null:
              <Text style={{
                fontSize:12,
                marginRight:90,
                color:'red'

              }}>
                Enter proper mobile number between 0-9 (10 digits) 
              </Text>
            }
            <View style={styles.action}>
                <FontAwesome name='lock' color='#420475' style={styles.smallIcon} />
                <TextInput 
                placeholder='Password' 
                style={styles.textInput} 
                onChangeText={(e)=>handlePassword(e)}
                secureTextEntry={showPassword}
                placeholderTextColor={'gray'}
                />

<TouchableHighlight onPress={() => setShowPassword(!showPassword)}>
      {password.length <1 ? <Text></Text> : !showPassword ? (
        <Feather
        name='eye-off'
        color={passwordVerify?'green':'red'}
        size={23}
        style={{ marginRight: -6 }}
      
      />
       
      ) : (
        <Feather
        name='eye'
        color={passwordVerify?'green':'red'}
        size={23}
        style={{ marginRight: -6 }}
        />
        
      )}
    </TouchableHighlight>
            </View>
            {
              password.length<1?<Text></Text>:passwordVerify?<Text></Text>:(
                <Text 
                style={{
                  marginLeft:20,
                  color:'red'

                }}
                >
                  Uppercase, Lowercase, Number, and 6 more Character

                </Text>
              )
            }
        </View>
     
        
          <View style={styles.button}>
          <TouchableHighlight style={styles.inBut} onPress={()=>handleSubmit()}>
              <Text style={styles.textSign}>Register</Text>
          </TouchableHighlight>
          </View>
          
          
   
       
     
    </View>
    
    
  
 </ScrollView>
 

 
  )
}

export default SignUp

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
      textSign1: {
        fontSize: 8.5,
        fontWeight: 'bold',
        color: 'white',
      },
      smallIcon: {
        marginRight: 10,
        fontSize: 24,
      },
      Icon:{
        marginLeft:3,
        marginRight: 15,
        fontSize: 30,

      },
      logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        height: 260,
        width: 260,
        marginTop: 30,
      },
      text_footer: {
        color: '#05375a',
        fontSize: 18,
      },
      action: {
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 3,
        marginTop: 15,
    
        paddingHorizontal: 15,
    
        borderWidth: 1,
        borderColor: '#420475',
        borderRadius: 50,
      },
      textInput: {
        flex: 1,
        marginTop: -12,
    
        color: '#05375a',
      },
      
      loginContainer: {
        width:320,
        marginTop:120,
        marginHorizontal:48,
        alignItems:'center',
        backgroundColor: '#fff',
        borderRadius:30,
        paddingHorizontal: 20,
        paddingVertical: 30,
      
      },
      header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
      },
      text_header: {
        color: '#420475',
        fontWeight: 'bold',
        fontSize: 30,
      },
      button: {
        alignItems: 'center',
        marginTop: 30,
        textAlign: 'center',
        margin: 20,
      },
      button1: {
        alignItems: 'center',
        justifyContent:'center',
        width:80,
        textAlign: 'center',
        paddingLeft:4,
        marginTop:-9,
        marginLeft:9,
        marginRight:-18

        
        },
      inBut: {
        width: '70%',
        backgroundColor: '#420475',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
      },
      inBut1: {
        width: '70%',
        backgroundColor: '#420475',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 20,
        
      },
      inBut2: {
        backgroundColor: '#420475',
        height: 65,
        width: 65,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomButton: {
        marginTop:10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallIcon2: {
        fontSize: 40,
        // marginRight: 10,
      },
      bottomText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
      },
})