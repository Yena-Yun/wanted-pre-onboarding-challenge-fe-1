import { authToken, serverAxios } from 'api';
import indexStore from 'mobx/indexStore';

import { TodoProp } from 'types/todo';

const { modalStore, inputStore, todoStore, idStore } = indexStore();

export const TodoAPI = {
  getTodos: async () => {
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
        Authorization: `Bearer ${authToken}`,
      },
    });

    return data.data;
  },
  createTodo: async (todo: Pick<TodoProp, 'title' | 'content'>) => {
    const { data } = await serverAxios.post('/todos', todo, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return data;
  },
  updateTodo: async (todo: Pick<TodoProp, 'title' | 'content'>) => {
    const { data } = await serverAxios.put(`/todos/${idStore.id}`, todo, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return data.data;
  },
  deleteTodo: async (id: string) => {
    const { data } = await serverAxios.delete(`/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return data;
  },
};
