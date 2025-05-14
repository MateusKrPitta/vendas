import httpsInstance from '../url';
import CustomToast from '../../components/toast';

export const login = async (email, password) => {
  const https = httpsInstance();
  
  try {
    const response = await https.post('/login', {
      email,
      password
    });
    const apiData = response.data.data;
    return {
        status: true,
        data: {
          token: apiData.token, 
          user: {
            ...apiData.user,
            unidades: apiData.user.unidades || []
          }
        }
      };
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message 
    };
  }
};