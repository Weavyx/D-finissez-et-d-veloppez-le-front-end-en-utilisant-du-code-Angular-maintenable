// Typage des réponses HTTP ou mock
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

