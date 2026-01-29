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
  progress: {
    userId: string;
    mangaId: string;
    chapterNum: number;
    updatedAt: Date;
  };
  action: "selected" | "upsert";
}
