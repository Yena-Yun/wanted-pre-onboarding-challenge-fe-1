import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { authToken } from 'api';
import { TodoAPI } from 'api/todo';
import { TodoProp } from 'types/todo';
import * as S from 'styles/theme';

const DefaultAddProp = { title: '', content: '' };

const Todo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowAddInput, setIsShowAddInput] = useState(false);
  const [addTodo, setAddTodo] = useState(DefaultAddProp);
  const { title, content } = addTodo;
  const titleRef = useRef<HTMLInputElement>(null);

  const { data: todoList } = useQuery<{ data: TodoProp[] }>(
    ['todos'],
    TodoAPI.getTodos,
    {
      onError: (error) => {
        console.log(error);
        alert('todo 데이터를 가져오는 도중 문제가 생겼습니다!');
        navigate('/');
      },
    }
  );

  const handleAddInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'title') setAddTodo({ ...addTodo, title: value });
    else setAddTodo({ ...addTodo, content: value });
  };

  const MutationOption = {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: () => {
      /* Toast 자리 */
    },
  };

  const { mutateAsync: createMutate } = useMutation<
    { data: TodoProp },
    Error,
    Pick<TodoProp, 'title' | 'content'>
  >(TodoAPI.createTodo, MutationOption);

  const { mutateAsync: deleteMutate } = useMutation(
    TodoAPI.deleteTodo,
    MutationOption
  );

  const handleTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      /* Toast 자리 */
    }

    try {
      await createMutate({ title, content });
    } catch (err) {
      /* Toast 자리 */
    }

    setAddTodo(DefaultAddProp);
    setIsShowAddInput(false);
  };

  const handleTodoDelete = async (id: string) => {
    try {
      await deleteMutate(id);
    } catch (err) {
      /* Toast 자리 */
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  useEffect(() => {
    if (isShowAddInput) {
      titleRef.current!.focus();
    }
  }, [isShowAddInput]);

  return (
    <>
      <TodoTitle>Todo 앱</TodoTitle>
      {todoList || authToken ? (
        <LogoutButton onClick={logout}>
          <span>로그아웃</span>
        </LogoutButton>
      ) : (
        <Link to='/login'>로그인</Link>
      )}
      <Container>
        <AddTodoButton
          onClick={() => {
            setIsShowAddInput(!isShowAddInput);
          }}
        >
          Todo 추가
        </AddTodoButton>
        <AddInputGroup onSubmit={handleTodoSubmit} isShow={isShowAddInput}>
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
        {todoList?.data.length === 0 && !isShowAddInput ? (
          <div>Todo가 없습니다!</div>
        ) : (
          todoList?.data.map(
            ({
              id,
              title,
              content,
            }: Pick<TodoProp, 'id' | 'title' | 'content'>) => (
              <S.FlexCustom key={id}>
                <TodoItem>
                  <S.FlexColumn>
                    <S.FlexCustom justify='space-between'>
                      <Title>{title}</Title>
                    </S.FlexCustom>
                    <Description>{content}</Description>
                  </S.FlexColumn>
                </TodoItem>
                <TodoDeleteButton onClick={() => handleTodoDelete(id)}>
                  ❌
                </TodoDeleteButton>
              </S.FlexCustom>
            )
          )
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 450px;
  padding: 24px 20px;
  margin-top: 40px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
`;

const TodoTitle = styled.h1`
  font-family: AppleSDGothicNeoB00;
  font-weight: 700;
`;

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

const TodoItem = styled.div`
  width: 390px;
  padding: 17px 0 19px 24px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
  cursor: pointer;
`;

const TodoDeleteButton = styled.button`
  width: 70px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
  cursor: pointer;
`;

const Title = styled.p`
  margin-bottom: 5px;
  font-family: AppleSDGothicNeoM;
  font-weight: 500;
`;

const Description = styled.p`
  margin-bottom: 11px;
  font-family: AppleSDGothicNeoM;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
`;

const LogoutButton = styled.button`
  font-family: AppleSDGothicNeoM;
  cursor: pointer;
`;

export default Todo;
