
export interface BirthdayWish {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface Jemaat {
  id: string;
  name: string;
  phone: string;
  address: string;
  joinedAt: string;
  photoUrl?: string; // New optional field for profile photo
  birthPlace: string;
  birthDate: string;
  isBaptized: boolean;
  wishes?: BirthdayWish[]; // New field for birthday messages
  birthdayLikes?: string[]; // New field for birthday reactions (Array of User IDs)
}

// Generic Comment Interface used for Renungan and Prayers
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export type RenunganComment = Comment; // Alias for backward compatibility if needed

export interface Renungan {
  id: string;
  title: string;
  imageUrl?: string; // New field for header image
  date: string;
  verse: string;
  content: string;
  author: string;
  likes: number;
  likedBy: string[]; // Array of User IDs
  comments: Comment[];
}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export interface Feedback {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface Jadwal {
  id: string;
  type: 'Ibadah Raya' | 'Doa Malam' | 'Pemuda' | 'Sekolah Minggu';
  date: string;
  time: string;
  preacher: string;
  worshipLeader: string;
}

export interface AttendanceRecord {
  id: string;
  jemaatId: string;
  jemaatName: string;
  jadwalId: string;
  timestamp: string;
  confirmed?: boolean; // Optional confirmation
}

export interface Tithe {
  id: string;
  jemaatId: string;
  jemaatName: string;
  amount: number;
  date: string;
  method: 'Transfer' | 'Tunai';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'Misi' | 'Sosial' | 'Operasional' | 'Pembangunan';
}

export interface SlideshowImage {
  id: string;
  url: string;
  caption: string;
}

export interface Pastor {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
}

export interface ChurchInfo {
  name: string;
  address: string;
  mapEmbedUrl: string; // src for iframe
  whatsapp: string;
  logoUrl: string; // Base64 or URL
  vision: string;
  mission: string;
}

export type UserRole = 'ADMIN' | 'JEMAAT';

export type MinistryRole = 'WL' | 'Singer' | 'Keyboard' | 'Gitar' | 'Bass' | 'Drum' | 'Multimedia' | 'Usher' | 'Parkir';

export interface Volunteer {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  role: MinistryRole;
  status: 'Pending' | 'Approved';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'REGISTRATION' | 'VOLUNTEER' | 'SYSTEM' | 'RENUNGAN' | 'PRAYER' | 'BIRTHDAY';
  isRead: boolean;
  createdAt: string;
  linkTo?: string;
  targetUserId?: string; // If undefined, it's a broadcast to all
}

export interface AppState {
  role: UserRole;
  currentUser: Jemaat | null;
  adminPassword: string;
  churchInfo: ChurchInfo;
  pastoralTeam: Pastor[];
  jemaatData: Jemaat[];
  renunganData: Renungan[];
  jadwalData: Jadwal[];
  prayerData: PrayerRequest[]; 
  feedbackData: Feedback[]; 
  attendanceData: AttendanceRecord[];
  titheData: Tithe[];
  expenseData: Expense[];
  slideshowData: SlideshowImage[];
  volunteerData: Volunteer[];
  notifications: Notification[]; // New field
}
