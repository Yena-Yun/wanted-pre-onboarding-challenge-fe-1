import { serverAxios } from 'api';

export interface TodoProp {
  title: string;
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type TodoMutationType = {
  title: string;
  content: string;
  authToken: string;
};

let token = localStorage.getItem('authToken') || '';

export const TodoAPI = {
  getTodos: async (authToken: string): Promise<{ data: TodoProp[] }> => {
    const { data } = await serverAxios.get<{ data: TodoProp[] }>('/todos', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return data;
  },
  getTodoById: async (id: string): Promise<TodoProp> => {
    const { data } = await serverAxios.get(`/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  },
  createTodo: async ({
    title,
    content,
    authToken,
  }: TodoMutationType): Promise<{ data: TodoProp }> => {
    const { data } = await serverAxios.post(
      '/todos',
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return data.data;
  },
  updateTodo: async (todo: TodoProp, id: string): Promise<TodoProp> => {
    const { data } = await serverAxios.put(`/todos/${id}`, todo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  },
  deleteTodo: async (id: string) => {
    const { data } = await serverAxios.delete(`/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};