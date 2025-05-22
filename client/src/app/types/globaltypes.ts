export interface UserType {
  balance: number;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phoneNumber: string;
}

export interface storyTypes {
  id: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface offerTypes {
  id: string;
  title: string;
  mainTitle: string;
  imageUrl: string;
  metaDescription: string;
  description: string[];
  offerId: string;
  createdAt: string;
  isActive: boolean;
}
export interface TransactionTypes {
  id: string;
  amount: number;
  balance: number;
  createdAt: string;
  destination: string;
  status: string;
  points: number;
  fromUserId: string;
  toUserId: string;
  fromUser: UserType;
  toUser: UserType;
}
