import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { Title } from 'components/Title';
import { Button } from 'components/Button';
import { AuthAPI } from 'api/service/auth';
import * as S from 'styles/theme';

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isValidate, setIsValidate] = useState(false);
  const [userInput, setUserInput] = useState({ email: '', password: '' });
  const { email, password } = userInput;

  const handleValidate = useCallback(() => {
    if (email.length < 1 || password.length < 8) return;
    if (!email.includes('@') || !email.includes('.')) return;
    setIsValidate(true);
  }, [email, password.length]);

  useEffect(() => {
    handleValidate();
  }, [handleValidate]);

  const { mutate } = useMutation(AuthAPI.register, {
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
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

      queryClient.setQueryData(['REGISTER_USER'], userInput);

      if (isValidate) {
        mutate(userInput, {
          onSuccess: () => {
            console.log('회원가입 정보 저장 성공!');
            navigate('/login');
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
        <S.FlexBox gap='32px'>
          <FormDiv onSubmit={handleSubmit}>
            <Title title='회원가입'></Title>
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
            <Button isValidate={isValidate}>회원가입</Button>
          </FormDiv>
        </S.FlexBox>
      </S.SizeBox>
    </Container>
  );
};

export default Register;

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
