import { Account } from "./account.model";
import { TypeTransaction } from "./typeTransaction";

export interface Transaction {
    _id: string;
    sender: Account;
    receiver: Account;
    montant: number;
    etat: 'SUCCES' | 'ANNULER' | 'ECHEC';
    date: Date;
    TypeTransaction: TypeTransaction;
  }
  