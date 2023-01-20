import styled from 'styled-components';
import indexStore from 'mobx/indexStore';

export const Modal = () => {
  const { modalStore } = indexStore();

  const closeModal = () => {
    modalStore.closeModal();
  };

  return (
    <>
      <Background onClick={closeModal}></Background>
      <Container>
        <Title>제목</Title>
        <Content>내용</Content>
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

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Content = styled.div`
  font-size: 14px;
`;
