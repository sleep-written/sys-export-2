import { TextColor } from './text-color';
import { ModalAction } from './modal-action';

export interface ModalOptions<T> {
    icon: string;
    color: TextColor;
    title: string;
    message: string;
    actions: ModalAction<T>[];
}