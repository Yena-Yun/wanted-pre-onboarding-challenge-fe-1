import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import indexStore from 'mobx/indexStore';
import { TodoAPI } from 'api/service/todo';
import { TodoProp } from 'types/todo';

export const Modal = () => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { modalStore, todoStore, idStore } = indexStore();
  const [inputValue, setInputValue] = useState({
    title: todoStore.todo.title,
    content: todoStore.todo.content,
  });

  // const { data: todo } = useQuery(
  //   ['todo'],
  //   () => TodoAPI.getTodoById(idStore.id),
  //   {
  //     onError: (error) => {
  //       console.log(error);
  //       alert('todo 데이터를 가져오는 도중 문제가 생겼습니다!');
  //       navigate('/todo');
  //     },
  //   }
  // );

  const { mutateAsync: updateMutate } = useMutation<
    { data: TodoProp },
    Error,
    Pick<TodoProp, 'title' | 'content'>
  >(TodoAPI.updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      modalStore.closeModal();
    },
    onError: () => {
      /* Toast 자리 */
    },
  });

  const closeModal = () => {
    modalStore.closeModal();
  };

  const handleUpdateInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log(value); // debounce 처리

    if (name === 'title') setInputValue({ ...inputValue, title: value });
    else setInputValue({ ...inputValue, content: value });
  };

  const handleTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todoStore.todo.title || !todoStore.todo.content) {
      /* Toast 자리 */
    }

    try {
      await updateMutate(inputValue);
      modalStore.closeModal();
    } catch (err) {
      /* Toast 자리 */
    }
  };

  useEffect(() => {
    if (modalStore.isOpenModal) {
      titleRef.current!.focus();
    }
  }, [modalStore.isOpenModal]);

  return (
    <>
      <Background onClick={closeModal}></Background>
      <Container>
        <AddInputGroup onSubmit={handleTodoSubmit}>
          <AddInput
            ref={titleRef}
            name='title'
            value={inputValue.title}
            placeholder='할 일 제목'
            onChange={handleUpdateInput}
          />
          <AddInput
            name='content'
            value={inputValue.content}
            placeholder='할 일 내용'
            onChange={handleUpdateInput}
          />
          <AddTodoButton>추가</AddTodoButton>
        </AddInputGroup>
      </Container>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
  cursor: pointer;
`;

const Container = styled.div`
  position: absolute;
  top: 30%;
  left: 30%;
  width: 400px;
  height: 300px;
  padding: 1rem;
  border-radius: 12px;
  background-color: white;
  z-index: 50;
`;

const AddInputGroup = styled.form<{ isShow?: boolean }>`
  /* display: ${({ isShow }) => (isShow ? 'flex' : 'none')}; */
  display: flex;
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

const AddTodoButton = styled.button`
  margin-bottom: 16px;
  padding: 8px 14px;
  font-family: AppleSDGothicNeoM;
  border: 1px solid green;
  border-radius: 10px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Content = styled.div`
  font-size: 14px;
`;
