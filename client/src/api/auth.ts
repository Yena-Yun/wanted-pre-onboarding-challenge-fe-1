import { serverAxios } from 'api';
import { AuthProp, UserProp } from 'types/auth';

export const AuthAPI = {
  login: async ({ email, password }: UserProp): Promise<AuthProp> => {
    const { data } = await serverAxios.post('/users/login', {
      email,
      password,
    });

    return data;
  },

  register: async ({ email, password }: UserProp): Promise<AuthProp> => {
    const { data } = await serverAxios.post('/users/create', {
      email,
      password,
    });
    return data;
  },
};

// export const AuthAPI = (endPointName: string) => {
//   return async ({ email, password }: UserProp): Promise<AuthProp> => {
//     const { data } = await serverAxios.post(`/users/${endPointName}`, {
//       email,
//       password,
//     });
//     return data;
//   };
// };
