import { authToken, serverAxios } from 'api';
import { TodoProp } from 'types/todo';

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
  createTodo: async ({
    title,
    content,
  }: Pick<TodoProp, 'title' | 'content'>) => {
    const { data } = await serverAxios.post(
      '/todos',
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return data;
  },
  updateTodo: async (todo: TodoProp, id: string): Promise<TodoProp> => {
    const { data } = await serverAxios.put(`/todos/${id}`, todo, {
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
