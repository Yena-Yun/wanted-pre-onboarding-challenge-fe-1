import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { UserProp } from 'types';
import { FlexBox, FlexCustom, SizeBox } from 'styles/theme';
import { Title } from 'components/Title';
import { Button } from 'components/Button';

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [userValue, setUserValue] = useState({
    email: '',
    password: '',
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (userData: UserProp) =>
      axios
        .post('http://localhost:8080/users/login', userData)
        .then((res) => console.log(res)),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    queryClient.setQueryData(['LOGIN_USER'], userValue);

    mutate(userValue, {
      onSuccess: () => {
        console.log('로그인 성공!');
        navigate('/');
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Container>
      <SizeBox width='80%'>
        <FlexBox gap='32px'>
          <FormDiv onSubmit={handleSubmit}>
            <Title title='로그인'></Title>
            <InputWrap>
              <Input
                type='email'
                placeholder='이메일'
                value={userValue.email}
                onChange={({ target: { value } }) =>
                  setUserValue({ ...userValue, email: value })
                }
              />
              <Input
                type='password'
                placeholder='비밀번호'
                min='8'
                value={userValue.password}
                onChange={({ target: { value } }) =>
                  setUserValue({ ...userValue, password: value })
                }
              />
            </InputWrap>
            <Button>
              {isLoading ? (
                <LoadingSpinner>
                  <div className='spinner'></div>
                </LoadingSpinner>
              ) : (
                '로그인'
              )}
            </Button>
          </FormDiv>
        </FlexBox>
      </SizeBox>
    </Container>
  );
};

export default Login;

const Container = styled(FlexCustom)`
  width: 100%;
  margin-top: 64px;
`;

const LoadingSpinner = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  @keyframes spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  & > .spinner {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 64px;
    height: 64px;
    margin-top: -32px;
    margin-left: -32px;
    border-radius: 50%;
    border: 8px solid transparent;
    border-top-color: #f19022;
    border-bottom-color: #f19022;
    animation: spinner 0.8s ease infinite;
  }
`;

const FormDiv = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  max-width: 360px;
  min-height: 280px;
  padding: 24px 20px;
  gap: 32px;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 4px;
`;

const Input = styled.input`
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
