import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import HeaderBar from './HeaderBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { useSelector } from 'react-redux';

const ExpenseScreen = ({navigation}: any) => {
  const route = useRoute();
  const {expenseId} = route.params;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {userId}=useSelector(state=>state.auth)

  const fetchExpense = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/chat/expense/expense/${expenseId}`,
      );

      const expenseData = response.data;

      // Set current user's payment status as paid
      const updatedPayments = expenseData.payments.map(payment => {
        if (payment.participant._id === userId) {
          return { ...payment, paid: true };
        }
        return payment;
      });
      // setExpense(response.data);

      setExpense({ ...expenseData, payments: updatedPayments });
      
    } catch (err) {
      setError('Error fetching expense details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
   
  }, [expenseId]);

  const handlePaymentStatus = async (participantId, paid) => {
    try {
      console.log("PRESS",participantId,paid,expenseId)

      await axios.post(
        `http://10.0.2.2:8000/chat/expense/paymentStatus`,{expenseId,participantId,paid});

      fetchExpense();
    } catch (error) {
      console.log('internal server error', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <HeaderBar title={'Expense'} />
      <View style={styles.mainContainer}>
        <View
          style={{
            borderBottomWidth: 3,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: 'silver',
             flexDirection: 'row', gap: 15,
             marginTop:40,
             elevation:0,
             borderBottomLeftRadius:10,
             borderBottomRightRadius:10,
            
             
          }}>
             
            {expense.type == 'group' ? (
              <MaterialIcons name="groups" size={40} color={'#D77702'} style={{marginLeft:10}} />
            ) : (
              <FontAwesome6Icon
                name="money-bills"
                size={40}
                color={'#D77702'}
                style={{marginLeft:10}}
              />
            )}

            <Text style={styles.value1}>{expense.description}</Text>
          
          
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
         
          <View style={{flex: 1, flexDirection: 'row', gap: 8}}>
            <Text style={styles.value2}>₹{expense.amount}</Text>

            <View
              style={{elevation: 20, shadowColor: 'red', shadowOpacity: 10}}>
              <Text style={styles.value}>{expense.type}</Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text 
            style={styles.label}>
              Paid by {
                       expense.payerId._id==userId ?
                       <Text style={{fontWeight:'bold',color:'black'}}>You</Text>
                       :
                       <Text style={{fontWeight:'bold',color:'black'}}>{expense.payerId.name}</Text>
                      } on </Text>
            <Text style={styles.label}>
              {new Date(expense.date).toLocaleDateString()} at{' '}
              {new Date(expense.date).toLocaleTimeString()}{' '}
            </Text>
          </View>

          <View style={{flex: 1, flexDirection: 'row', gap: 20, marginTop: 20}}>
            <Image source={{uri: expense.payerId.image}} style={styles.image} />

            <Text style={styles.paid}>
              {
                expense.payerId._id==userId?
                'You'
                :
              expense.payerId.name
              } paid ₹{expense.amount}
            </Text>
          </View>
          {expense.payments.map(payment => (
            <View key={payment.participant._id} style={{flexDirection: 'row'}}>

              {
                expense.payerId._id==userId && payment.participant._id!=userId ?
             
                  <TouchableOpacity
                onPress={() => handlePaymentStatus(payment.participant._id, !payment.paid)}>
                
              <View style={{width:90}}>
                <Text style={styles.paid3}>{payment.paid ? 'Mark as Unpaid' : 'Mark as Paid'}</Text>
                </View>
                

               </TouchableOpacity>
                
              :
              
              <Text>               </Text>

              }
                     
              
              <Text style={styles.paid2}>
                {
                payment.participant._id==userId ?
                'You'
                :
                payment.participant.name
                } owes ₹{payment.amount}
              </Text>

                {payment.paid && expense.payerId._id==userId ? 
                <Text style={styles.paid4}>Paid</Text> 
                :
                 <Text style={styles.paid5}>Not Paid</Text>}
               
              
              
            </View>
          ))}

          <Text style={styles.label4}>Status:</Text>
          <Text style={styles.value5}>
            {expense.settled ? 'Settled' : 'Not Settled'}
          </Text>
        </ScrollView>
      </View>
    </>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 220,
    
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 9,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    marginTop: -26,
    marginBottom: 5,
    fontWeight: '400',
    color: 'gray',
  },
  label2: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '400',

    color: 'gray',
  },
  label4: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '400',
    color: 'gray',
  },
  value: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D77702',
    marginBottom: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
    borderLeftWidth: 1,
    borderRightWidth: 1.6,
    borderBottomWidth: 3,
  },
  value5: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
    borderLeftWidth: 1,
    borderRightWidth: 1.6,
    borderBottomWidth: 3,
  },
  value3: {
    fontSize: 16,
    borderColor: 'black',
    marginBottom: 40,
    paddingHorizontal: 5,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'gray',
  },
  paid: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    fontWeight: '600',
  },
  paid2: {
    fontSize: 18,
    color: 'gray',
    marginTop: 8,
    marginLeft: 20,
  },
  paid3: {
    fontSize: 12,
    color: 'black',
    marginTop: 12,
    borderBottomWidth: 3,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    height: 17,
    marginLeft: 0,
    fontWeight: '500',
    textAlign:'center',
    },
  paid4: {
    fontSize: 12,
    color: 'green',
    marginTop: 12,
    borderBottomWidth: 3,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 6,
    height: 17,
    marginLeft: 3,
    fontWeight: '500',
    paddingBottom:2,
    paddingLeft:2,
    paddingRight:1,
    
  },
  paid5: {
    fontSize: 12,
    color: 'gray',
    marginTop: 12,
    borderBottomWidth: 3,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    height: 17,
    marginLeft: 3,
    fontWeight: '500',
    paddingBottom:2,
    paddingLeft:2,
    paddingRight:1,
    
  },
  value1: {
    fontSize: 40,
    marginBottom: 10,
    marginTop: -6.5,

    color: 'black',
  },
  value2: {
    fontSize: 40,
    marginBottom: 10,
    marginTop: -6.5,
    marginLeft: 0,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'sans-serif',
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
});
