import { UserModel, BookModel, User, reviewModel, Book, review } from "./tps.ts";
import type { Collection } from "mongodb";

// Función para convertir un reviewModel a un review
export const fromModelToReview = (model: reviewModel): review => ({
  id: model._id!.toString(),
  text: model.text,
});

// Función para convertir un BookModel a un Book, incluyendo las reviews
export const fromModelToBook = async (
  model: BookModel,
  reviewsCollection: Collection<reviewModel>
): Promise<Book> => {
  const reviews = await reviewsCollection
    .find({ _id: { $in: model.reviews } })
    .toArray();

  return {
    id: model._id!.toString(),
    title: model.title,
    pages: model.pages,
    reviews: reviews.map(fromModelToReview),
  };
};

// Función principal para convertir un UserModel a un User, incluyendo los libros y reviews
export const fromModelToUser = async (
  model: UserModel,
  booksCollection: Collection<BookModel>,
  reviewsCollection: Collection<reviewModel>
): Promise<User> => {
  const books = await booksCollection
    .find({ _id: { $in: model.books } })
    .toArray();

  return {
    id: model._id!.toString(),
    name: model.name,
    email: model.email,
    age: model.age,
    books: await Promise.all(
      books.map((b) => fromModelToBook(b, reviewsCollection))
    ),
  };
};
