
export interface TextVariations {
  twitter: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  email_subject: string;
  email_body: string;
  blog_intro: string;
  youtube: string;
}

export interface ImageAnalysis {
  description: string;
  instagram_caption: string;
  hashtags: string[];
  alt_text: string;
  suggestions: string;
  emotion: string;
  colors: string[];
}

export interface AudioAnalysis {
    transcription: string;
    summary: string;
    key_points: string[];
    title_suggestion: string;
}


export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
