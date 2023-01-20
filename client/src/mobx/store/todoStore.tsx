import { observable } from 'mobx';

export const todoStore = observable({
  todo: {
    title: '',
    content: '',
  },
  setTodo(todo: { title: string; content: string }) {
    this.todo = todo;
  },
  // defaultTodo() {
  //   this.todo = { title: '', content: '' };
  // },
});

export const idStore = observable({
  id: '',
  setId(id: string) {
    this.id = id;
  },
});
