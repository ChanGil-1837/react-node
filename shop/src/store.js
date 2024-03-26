import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name : 'user',
    initialState : 'kim'
})
let cart = createSlice({
    name :"cart",
    initialState : [
        {id : 0, name : "white and black", count : 2},
        {id : 2, name : "grey yordan", count : 1},
    ],
    reducers : {
        changeName(state,i) {
            state[i.payload].name = "park";
        }
    }

})
export default configureStore({
  reducer: { 
    user : user.reducer,
    cart : cart.reducer
  }
}) 



export let {changeName,} = cart.actions
