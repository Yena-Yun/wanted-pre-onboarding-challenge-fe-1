import modalStore from './store/modalStore';
import inputStore from './store/inputStore';
import { todoStore, idStore } from './store/todoStore';

const indexStore = () => ({
  modalStore,
  inputStore,
  todoStore,
  idStore,
});

export default indexStore;
