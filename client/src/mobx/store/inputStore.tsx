import { observable } from 'mobx';

const inputStore = observable({
  isOpenInput: false,
  toggleInput() {
    this.isOpenInput = !this.isOpenInput;
  },
  closeInput() {
    this.isOpenInput = false;
  },
});

export default inputStore;
