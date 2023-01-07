import { serverAxios } from 'api';
import { AuthProp, UserProp } from 'types';

export const AuthAPI = {
  login: async ({ email, password }: UserProp): Promise<AuthProp> => {
    const { data } = await serverAxios.post('/users/login', {
      email,
      password,
    });
    return data;
  },

  signUp: async ({ email, password }: UserProp): Promise<AuthProp> => {
    const { data } = await serverAxios.post('/users/create', {
      email,
      password,
    });
    return data;
  },
};
