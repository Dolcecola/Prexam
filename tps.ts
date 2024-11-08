import { ObjectId, type OptionalId } from "mongodb";

export type personaModel = OptionalId<{
    nombre: string;
    mayor: boolean;
    genero: string;
}>;

export type persona = {
    id: string;
    nombre: string;
    mayor: boolean;
    genero: string;
}

export type videoModel = OptionalId<{
    titulo: string,
    visitas: number,
    comentarios: {
        A: string;
        B: string;
    };
}>;

export type video = {
    id: string
    titulo: string,
    visitas: number,
    comentarios: {
        A: string;
        B: string;
    };
};

//-----------------------------

export type UserModel = OptionalId<{
    name: string;
    age: number;
    email: string;
    books: ObjectId[];
  }>;
  
  export type BookModel = OptionalId<{
    title: string;
    pages: number;
    reviews: ObjectId[];
  }>;

  export type reviewModel = OptionalId<{
    text: string;
  }>
  
  export type User = {
    id: string;
    name: string;
    age: number;
    email: string;
    books: Book[];
  };
  export type Book = {
    id: string;
    title: string;
    pages: number;
    reviews: review[];
  };

  export type review = {
    id: string;
    text: string;
  }
