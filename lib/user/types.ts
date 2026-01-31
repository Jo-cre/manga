export interface userModel {
  id: string;
  name: string;
  email: string;
  image: string | null;
  banner: string | null;
  role: string;
  createdAt: Date;
}

export interface readingProgress {
  userId: string;
  mangaId: string;
  chapterId: string;
  chapterNum: number;
  updatedAt: Date;
}

export interface Library {
  userId: string;
  mangaId: string;
}
