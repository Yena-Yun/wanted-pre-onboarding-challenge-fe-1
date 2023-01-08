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
