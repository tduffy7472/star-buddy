
export interface Constellation {
  name: string;
  myth: string;
  funFact: string;
  bestSeen: string;
  starsCount: number;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
}
