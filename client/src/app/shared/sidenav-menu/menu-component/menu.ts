export interface Menu {
    id:         number;
    icon:       string;
    text:       string;
    path:       string | null;
    children:   Menu[];
}