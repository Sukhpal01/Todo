import { configureStore } from '@reduxjs/toolkit'
import taskReducer from '../features/components/taskSlice'

export default configureStore({
  reducer: {
    tasks: taskReducer,
  },
})