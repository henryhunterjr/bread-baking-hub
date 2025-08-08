import { User, Session } from '@supabase/supabase-js';

// Auth Types
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Recipe Types
export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  data: RecipeData;
  image_url?: string;
  folder?: string;
  tags?: string[];
  is_public?: boolean;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeData {
  title: string;
  introduction?: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: string;
  course?: string;
  cuisine?: string;
  equipment?: string[];
  ingredients: RecipeIngredient[] | string[];
  method: RecipeStep[] | string[];
  tips?: string[];
  troubleshooting?: TroubleshootingItem[];
}

export interface RecipeIngredient {
  item: string;
  amount_metric?: string;
  amount_volume?: string;
  note?: string;
}

export interface RecipeStep {
  step: number;
  instruction: string;
}

export interface TroubleshootingItem {
  problem: string;
  solution: string;
}

// Recipe Component Props
export interface RecipeCardProps {
  recipe: Recipe;
  currentViewMode: 'grid' | 'list';
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  onDuplicate: (recipe: Recipe) => void;
  onFullEdit: (recipe: Recipe) => void;
  onFullSave: (recipeId: string, updates: RecipeUpdateData) => Promise<boolean>;
  onAskAssistant: (recipe: Recipe) => void;
  allRecipes?: Recipe[];
}

export interface RecipeUpdateData {
  data: RecipeData;
  image_url?: string;
  folder?: string;
  tags?: string[];
  is_public?: boolean;
  slug?: string;
}

// AI Draft Types
export interface AIDraft {
  id: string;
  type: 'blog' | 'newsletter';
  title: string;
  payload: BlogPostPayload | NewsletterPayload;
  created_at: string;
  run_date?: string;
}

export interface BlogPostPayload {
  title: string;
  subtitle?: string;
  content: string;
  tags?: string[];
  heroImageUrl?: string;
  inlineImageUrl?: string;
  socialImageUrl?: string;
}

export interface NewsletterPayload {
  subject: string;
  content: string;
  preheader?: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  author: BlogAuthor;
  published_at: string;
  image?: string;
  tags?: string[];
  slug: string;
  link: string;
}

export interface BlogAuthor {
  name: string;
  avatar?: string;
}

// Voice Interface Types
export interface VoiceMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Upload Types
export interface FileUploadProps {
  onSuccess: (data: UploadResult) => void;
}

export interface UploadResult {
  recipe?: RecipeData;
  imageUrl?: string;
  error?: string;
}

// Hook Types
export interface UseRecipeEditFormProps {
  recipe: Recipe;
  allRecipes?: Recipe[];
}

export interface UseAIChatProps {
  recipeContext?: Recipe;
}

// Component Event Handlers
export type RecipeSelectHandler = (recipe: Recipe) => void;
export type RecipeUpdateHandler = (recipeId: string, updates: RecipeUpdateData) => Promise<boolean>;
export type DraftImportHandler = (draftData: AIDraft) => void;