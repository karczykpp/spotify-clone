export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | null;
  duration: number;
  imageUrl: string;
  audioUrl: string;
  createdAt: string;
  updatedAt: string;
}
export interface Album {
  _id: string;
  title: string;
  artist: string;
  releaseYear: number;
  imageUrl: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  totalAlbums: number;
  totalSongs: number;
  totalUsers: number;
  totalArtists: number;
}
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
export interface User {
  _id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
}
