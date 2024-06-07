import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addExpense = createAsyncThunk(
  'expense/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/chat/expense/addExpense', expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchExpenses = createAsyncThunk(
    'expense/fetchExpenses',
    async ({ userId, expenseType,type }, { rejectWithValue }) => {
      try {
        console.log(userId,".....",type)
        console.log(userId,"????",expenseType)
        if(type!==undefined){
          expenseType=''

        }
       
        const response = await axios.get(`http://10.0.2.2:8000/chat/expense/expenses/${userId}?expenseType=${expenseType}`);
        console.log(response.data.expenses,">>>>>>>>>>>>>")
        let list=[];
            if(type=='settled'){
              
      
              response.data.expenses.map(expense=>{
                if(expense.settled){
                  list.push(expense)
                }
              })
      
            }else{
              response.data.expenses.map(expense=>{
               
                  list.push(expense)
                
              })
              
            }


           
        return list;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


const expensesSlice = createSlice({
    name: 'expenses',
    initialState: {
        expenses: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses.push(action.payload);
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
    reducers: undefined
});

export default expensesSlice.reducer;