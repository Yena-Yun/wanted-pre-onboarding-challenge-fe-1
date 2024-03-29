import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { Title } from 'components/Title';
import { Button } from 'components/Button';
import { AuthAPI } from 'api/service/auth';
import * as S from 'styles/theme';

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isValidate, setIsValidate] = useState(false);
  const [userInput, setUserInput] = useState({ email: '', password: '' });

  const { email, password } = userInput;

  const handleValidate = useCallback(() => {
    if (email.length < 5 || password.length < 8) return;
    if (!email.includes('@') || !email.includes('.')) return;
    setIsValidate(true);
  }, [email, password.length]);

  useEffect(() => {
    handleValidate();
  }, [handleValidate]);

  const { mutate } = useMutation(AuthAPI.login, {
    onSuccess: (data) => {
      localStorage.setItem('authToken', JSON.stringify(data.token));
      navigate('/todo');
    },
    onError: (error) => {
      alert('없는 유저입니다!');
      navigate('/login');
      console.log(error);
    },
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === 'email') {
        setUserInput({ ...userInput, email: value });
      } else {
        setUserInput({ ...userInput, password: value });
      }
    },
    [userInput]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      queryClient.setQueryData(['LOGIN_USER'], userInput);

      if (isValidate) {
        mutate(userInput, {
          onSuccess: () => {
            console.log('로그인 성공!');
            navigate('/todo');
          },
          onError: (error) => {
            console.log(error);
          },
        });
      }

      setIsValidate(false);
    },
    [isValidate, mutate, navigate, queryClient, userInput]
  );

  return (
    <Container>
      <S.SizeBox width='80%'>
        <S.FlexColumn gap='32px'>
          <FormDiv onSubmit={handleSubmit}>
            <Title title='로그인'></Title>
            <InputWrap>
              <Input
                name='email'
                type='email'
                placeholder='이메일'
                value={email}
                onChange={handleChange}
              />
              <Input
                name='password'
                type='password'
                placeholder='비밀번호'
                min='8'
                value={password}
                onChange={handleChange}
              />
            </InputWrap>
            <Button isValidate={isValidate}>로그인</Button>
          </FormDiv>
          <S.FlexColumnCustom>
            <Guide>아직 회원이 아니신가요?</Guide>
            <Link to='/register'>회원가입</Link>
          </S.FlexColumnCustom>
        </S.FlexColumn>
      </S.SizeBox>
    </Container>
  );
};

export default Login;

const Container = styled(S.FlexCustom)`
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
  padding: 20px 24px 20px;
  gap: 30px;
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
  transition: all 0.1s ease 0s;
  cursor: text;
`;

const Guide = styled.p`
  font-size: 14px;
  margin-bottom: 16px;
`;
