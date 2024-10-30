import { User } from "./user.model";

export interface Account {
    _id: string;
    solde: number;
    dateCreation:Date;
    utilisateur: User;
    soldeMaximum?: number;
    cummulTransactionMensuelle: Number,
    qrcode:string;
    etat:string;
  }