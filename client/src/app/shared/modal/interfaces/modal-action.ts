import { TextColor } from './text-color';

export interface ModalAction<T> {
    text: string;
    icon: string;
    color: TextColor;
    value: T;
}