import { User } from "./user.model";

export interface Notification{
    _id: string;
    message: string;
    date: Date;
    utilisateur: User;
    type: 'transfert' | 'retrait' | 'depot';
}