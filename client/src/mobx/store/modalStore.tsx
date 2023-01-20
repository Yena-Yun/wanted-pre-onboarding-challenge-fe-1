import { observable } from 'mobx';

const modalStore = observable({
  isOpenModal: false,
  openModal() {
    this.isOpenModal = true;
  },
  closeModal() {
    this.isOpenModal = false;
  },
});

export default modalStore;
