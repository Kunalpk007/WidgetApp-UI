import axios from 'axios'

const BASE_URL = 'http://localhost:8080/my-app'

export interface Widget {
  description: string
  name: string
  price: number
}

// export const fetchAllWidgets = (): Promise<Widget[]> => axios.get(`${BASE_URL}/v1/widget/getAllWidget`).then((response) => response.data)
export const fetchAllWidgets = async (): Promise<Widget[]> => {
  const response = await axios.get(`${BASE_URL}/v1/widget/getAllWidget`)
  console.log(response.data);
  return response.data;
}

export const createWidget = async (formData: { name: string; price: string; description: string }): Promise<any> => {
 try{
   const response = await axios.post(`${BASE_URL}/v1/widget`,formData)
   console.log('createWidget:',response);
   return {"data":response.data,"status":response.status};
 } catch (error: any) {
   console.log('Error creating widget with name', error);
   return {"data":error.response.data,"status":error.response.status};
 }
}

export const getWidgetData = async (name: string): Promise<any> => {
  try{

    const response = await axios.get(`${BASE_URL}/v1/widget/getWidget?name=${name}`)
    return {"data":response.data,"status":response.status};
  } catch (error: any) {
    console.log('Error getting widget with name', error);
    return {"data":error.response.data,"status":error.response.status};
  }
}
export const deleteWidget = async (name: string): Promise<any> => {
  try{
    const response = await axios.delete(`${BASE_URL}/v1/widget?name=${name}`)
    console.log('deleteWidget:',response);
    return {"data":response.data,"status":response.status};
  } catch (error: any) {
    console.log('Error deleting widget with name', error);
    return {"data":error.response.data,"status":error.response.status};
  }
}

export const updateWidget = async (formData: { name: string; price: string; description: string }): Promise<any> => {
  try{
    const response = await axios.put(`${BASE_URL}/v1/widget`,formData)
    console.log('updateWidget:',response);
    return {"data":response.data,"status":response.status};
  } catch (error: any) {
    console.log('Error updating widget with name', error);
    return {"data":error.response.data,"status":error.response.status};
  }
}