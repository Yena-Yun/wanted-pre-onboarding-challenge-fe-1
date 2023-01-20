import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoProp } from 'types/todo';
import styled from 'styled-components';
import inputStore from 'mobx/store/inputStore';
import { useObserver } from 'mobx-react';
import { TodoAPI } from 'api/service/todo';

export const UpdateInput = () => {
  return <div>UpdateInput</div>;
};
