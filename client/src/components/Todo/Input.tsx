import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoProp } from 'types/todo';
import styled from 'styled-components';
import inputStore from 'mobx/store/inputStore';
import { useObserver } from 'mobx-react';
import { TodoAPI } from 'api/service/todo';

const DefaultAddProp = { title: '', content: '' };

export const Input = () => {
  const [addTodo, setAddTodo] = useState(DefaultAddProp);
  const { title, content } = addTodo;
  const titleRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: createMutate } = useMutation<
    { data: TodoProp },
    Error,
    Pick<TodoProp, 'title' | 'content'>
  >(TodoAPI.createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: () => {
      /* Toast 자리 */
    },
  });

  const handleAddInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'title') setAddTodo({ ...addTodo, title: value });
    else setAddTodo({ ...addTodo, content: value });
  };

  const handleTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      /* Toast 자리 */
    }

    try {
      await createMutate({ title, content });
    } catch (err) {
      /* Toast 자리 */
    } finally {
      setAddTodo(DefaultAddProp);
      inputStore.closeInput();
    }
  };

  useEffect(() => {
    if (inputStore.isOpenInput) {
      titleRef.current!.focus();
    }
  }, [inputStore.isOpenInput]);

  const handleOpenInput = () => {
    inputStore.toggleInput();
  };

  return (
    <>
      {useObserver(() => (
        <>
          <AddTodoButton onClick={handleOpenInput}>Todo 추가</AddTodoButton>
          <AddInputGroup
            onSubmit={handleTodoSubmit}
            isShow={inputStore.isOpenInput}
          >
            <AddInput
              ref={titleRef}
              name='title'
              value={title}
              placeholder='할 일 제목'
              onChange={handleAddInputChange}
            />
            <AddInput
              name='content'
              value={content}
              placeholder='할 일 내용'
              onChange={handleAddInputChange}
            />
            <AddTodoButton>추가</AddTodoButton>
          </AddInputGroup>
        </>
      ))}
    </>
  );
};

const AddTodoButton = styled.button`
  margin-bottom: 16px;
  padding: 8px 14px;
  font-family: AppleSDGothicNeoM;
  border: 1px solid green;
  border-radius: 10px;
  cursor: pointer;
`;

const AddInputGroup = styled.form<{ isShow: boolean }>`
  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
  flex-direction: column;
  margin-bottom: 24px;
`;

const AddInput = styled.input`
  position: relative;
  flex: 1 1 0%;
  width: 100%;
  margin-bottom: 12px;
  padding: 12px 20px;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 12%) 0px 0px 0px 1px inset;
  transition: all 0.1s ease 0s;
  cursor: text;
`;
