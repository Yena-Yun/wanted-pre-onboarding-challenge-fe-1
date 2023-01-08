import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { authToken } from 'api';
import { TodoAPI } from 'api/todo';
import { TodoMutationType, TodoProp } from 'types/todo';
import * as S from 'styles/theme';

const Todo = () => {
  const navigate = useNavigate();
  const [addTodo, setAddTodo] = useState({
    title: '',
    content: '',
  });
  const [isShow, setIsShow] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const { data: todoList } = useQuery<{ data: TodoProp[] }, Error>(
    ['todos', authToken],
    () => TodoAPI.getTodos(authToken),
    {
      onError: (error) => {
        console.log(error);
        alert('todo 데이터를 가져오는 데 문제가 생겼습니다!');
        navigate('/');
      },
    }
  );

  const handleAddTodo = () => {
    setIsShow(!isShow);
  };

  const handleAddTodoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'title') {
      setAddTodo({ ...addTodo, title: value });
    } else {
      setAddTodo({ ...addTodo, content: value });
    }
  };

  const queryClient = useQueryClient();

  const { mutateAsync: createMutate } = useMutation<
    { data: TodoProp },
    Error,
    TodoMutationType
  >(TodoAPI.createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', authToken]);
    },
  });

  const handleAddTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resultTodo = {
      title: titleRef.current!.value,
      content: contentRef.current!.value,
    };

    try {
      await createMutate({
        title: resultTodo.title,
        content: resultTodo.content,
        authToken: authToken,
      });
    } catch (err) {
      console.log(err);
    }

    setAddTodo({
      title: '',
      content: '',
    });

    setIsShow(false);
  };

  const { mutateAsync: deleteMutate } = useMutation(TodoAPI.deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', authToken]);
    },
  });

  const handleTodoDelete = async (id: string) => {
    try {
      await deleteMutate(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Todo 앱</h1>
      {authToken ? (
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      ) : (
        <Link to='/login'>로그인</Link>
      )}
      <Container>
        <AddTodoButton onClick={handleAddTodo}>Todo 추가</AddTodoButton>
        <AddTodoInputGroup onSubmit={handleAddTodoSubmit} show={isShow}>
          <AddInput
            ref={titleRef}
            name='title'
            value={addTodo.title}
            placeholder='할 일 제목'
            onChange={handleAddTodoChange}
          />
          <AddInput
            ref={contentRef}
            name='content'
            value={addTodo.content}
            placeholder='할 일 내용'
            onChange={handleAddTodoChange}
          />
          <AddTodoButton>추가</AddTodoButton>
        </AddTodoInputGroup>
        {todoList?.data.length! === 0 && !isShow ? (
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

const LogoutButton = styled.button`
  cursor: pointer;
`;

const Container = styled.div`
  max-width: 450px;
  padding: 24px 20px;
  margin-top: 40px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 14px;
`;

const AddTodoButton = styled.button`
  padding: 8px 14px;
  margin-bottom: 16px;
  border: 1px solid green;
  border-radius: 10px;
  cursor: pointer;
`;

const AddInput = styled.input`
  flex: 1 1 0%;
  position: relative;
  width: 100%;
  padding: 12px 20px;
  margin-top: 12px;
  border-radius: 12px;
  box-shadow: rgb(0 0 0 / 12%) 0px 0px 0px 1px inset;
  background-color: rgb(255, 255, 255);
  color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  cursor: text;
  transition: all 0.1s ease 0s;
`;

const AddTodoInputGroup = styled.form<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  margin-bottom: 24px;
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

const Title = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const Description = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 11px;
`;

export default Todo;
