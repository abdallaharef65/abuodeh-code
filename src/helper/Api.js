/* eslint-disable */
import {
  deleteInstance,
  getInstance,
  updateInstance,
  addInstance,
} from './instacnes'

//get service id from component to fecth row from api and delete it
export const deleteData = async (route, id, qv = 'id') => {
  try {
    let response = await deleteInstance.request(`${route}?${qv}=${id}`)
    return response.data
  } catch (e) {
    throw new Error(e.message)
  }
}

//get data from component and fetch it in api
export const addData = async (route, data) => {
  try {
    let response = await addInstance.request(route, { data })
    return response
  } catch (e) {
    throw new Error(e.message)
  }
}

//get id from component to fecth row from api and return it to component
export const selectDataByParam = async (route, query) => {
  try {
    let response = await getInstance.request(`${route}?${query}`)
    return response.data
  } catch (e) {
    throw new Error(e.message)
  }
}


//get all services from api and return it to component
export const getData = async (route) => {
  try {
    let response = await getInstance.request(route)
    return response.data
  } catch (e) {
    throw new Error(e.message)
  }
}
//get service id and new data from component then fetch row based service id then update row data
export const updateData = async (route, id, data, qv = 'id') => {
  try {
    let response = await updateInstance.request(`${route}?${qv}=${id}`, { data })
    return response
  } catch (e) {
    throw new Error(e.message)
  }
}

