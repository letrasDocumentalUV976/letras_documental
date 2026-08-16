export type FirestoreId = string;

export type DateString = string;

export type CreateInput<T extends { id: FirestoreId }> = Omit<T, "id">;
