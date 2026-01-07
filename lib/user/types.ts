export interface userModel {
  id: string;
  name: string;
  email: string;
  image: string | null;
  banner: string | null;
  role: string;
  createdAt: Date;
}
