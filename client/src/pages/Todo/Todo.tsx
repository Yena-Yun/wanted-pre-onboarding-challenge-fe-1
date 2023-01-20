import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';
import { authToken } from 'api';
import indexStore from 'mobx/indexStore';
import { TodoAPI } from 'api/service/todo';
import { Modal } from 'components/Modal';
import { Input } from 'components/Todo/Input';
import { TodoProp } from 'types/todo';
import * as S from 'styles/theme';
import { todoStore } from 'mobx/store/todoStore';

const Todo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { modalStore, inputStore, idStore } = indexStore();

  const openModal = (id: string, title: string, content: string) => {
    modalStore.openModal();
    idStore.setId(id);
    todoStore.setTodo({ title, content });
  };

  const { mutateAsync: deleteMutate } = useMutation(TodoAPI.deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: () => {
      /* Toast 자리 */
    },
  });

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

  return (
    <>
      {useObserver(() => (
        <Wrapper>
          {modalStore.isOpenModal && <Modal />}
          <TodoTitle>Todo 앱</TodoTitle>
          {todoList || authToken ? (
            <LogoutButton onClick={logout}>
              <span>로그아웃</span>
            </LogoutButton>
          ) : (
            <Link to='/login'>로그인</Link>
          )}
          <Container>
            <Input />
            {todoList?.data.length === 0 && !inputStore.isOpenInput ? (
              <div>Todo가 없습니다!</div>
            ) : (
              todoList?.data.map(
                ({
                  id,
                  title,
                  content,
                }: Pick<TodoProp, 'id' | 'title' | 'content'>) => (
                  <S.FlexCustom key={id}>
                    <TodoItem onClick={() => openModal(id, title, content)}>
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
        </Wrapper>
      ))}
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

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
