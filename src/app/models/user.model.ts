export interface User {
    _id: string;
    nom: string;
    prenom: string;
    mdp: string;
    telephone: string;
    photoPiece1: String,
    photoPiece2: String,
    photoProfile: String,
    premiereConnexion:boolean;
    codeDeVerification:number;
    role: 'CLIENT' | 'AGENT' | 'ADMIN' | 'MARCHAND';
  }
  