import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { UserProp } from 'types';
import {
  FlexColumn,
  FlexColumnCustom,
  FlexCustom,
  SizeBox,
} from 'styles/theme';
import { Title } from 'components/Title';
import { Button } from 'components/Button';

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [userValue, setUserValue] = useState({
    email: '',
    password: '',
  });

  const [isValidate, setIsValidate] = useState(false);

  const { email, password } = userValue;

  useEffect(() => {
    if (email.length < 1 || password.length < 8) return;
    if (!email.includes('@') || !email.includes('.')) return;
    setIsValidate(true);
  }, [email, password.length]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      navigate('/');
    }
  }, [navigate]);

  const { mutate } = useMutation({
    mutationFn: (userData: UserProp) =>
      axios
        .post('http://localhost:8080/users/login', userData)
        .then((res) => {
          console.log(res.data.token);
          localStorage.setItem('authToken', JSON.stringify(res.data.token));
        })
        .catch((err) => console.log(err)),
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
        <FlexColumn gap='32px'>
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
            <Button isValidate={isValidate}>로그인</Button>
          </FormDiv>
          <FlexColumnCustom>
            <p>아직 회원이 아니신가요?</p>
            <Link to='/register'>회원가입</Link>
          </FlexColumnCustom>
        </FlexColumn>
      </SizeBox>
    </Container>
  );
};

export default Login;

const Container = styled(FlexCustom)`
  width: 100%;
  margin-top: 64px;
`;

const FormDiv = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  max-width: 360px;
  padding: 20px 24px 0;
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
