// Production-ready session storage service
// This would typically connect to a real database in production

export interface SessionStorageService {
  saveSession(sessionId: string, data: any): Promise<void>;
  loadSession(sessionId: string): Promise<any>;
  updateSession(sessionId: string, updates: any): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
}

// For now, using localStorage as fallback, but this should be replaced with:
// - Firebase Firestore
// - Supabase
// - AWS DynamoDB
// - PostgreSQL
// - Any production database

class LocalSessionStorage implements SessionStorageService {
  async saveSession(sessionId: string, data: any): Promise<void> {
    try {
      localStorage.setItem(`session-${sessionId}`, JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString(),
        version: (data.version || 0) + 1
      }));
    } catch (error) {
      console.error('Failed to save session:', error);
      throw new Error('Failed to save session data');
    }
  }

  async loadSession(sessionId: string): Promise<any> {
    try {
      const data = localStorage.getItem(`session-${sessionId}`);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        loadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to load session:', error);
      throw new Error('Failed to load session data');
    }
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    try {
      const existing = await this.loadSession(sessionId);
      if (!existing) {
        throw new Error('Session not found');
      }
      
      await this.saveSession(sessionId, {
        ...existing,
        ...updates,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update session:', error);
      throw new Error('Failed to update session data');
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      localStorage.removeItem(`session-${sessionId}`);
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw new Error('Failed to delete session data');
    }
  }
}

// Production-ready implementation example (Firebase)
class FirebaseSessionStorage implements SessionStorageService {
  private db: any; // Firebase Firestore instance

  constructor(firebaseApp: any) {
    this.db = firebaseApp.firestore();
  }

  async saveSession(sessionId: string, data: any): Promise<void> {
    try {
      await this.db.collection('collaborative_sessions').doc(sessionId).set({
        ...data,
        lastUpdated: new Date(),
        version: (data.version || 0) + 1
      });
    } catch (error) {
      console.error('Firebase save error:', error);
      throw new Error('Failed to save session to database');
    }
  }

  async loadSession(sessionId: string): Promise<any> {
    try {
      const doc = await this.db.collection('collaborative_sessions').doc(sessionId).get();
      if (!doc.exists) return null;
      
      return {
        ...doc.data(),
        loadedAt: new Date()
      };
    } catch (error) {
      console.error('Firebase load error:', error);
      throw new Error('Failed to load session from database');
    }
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    try {
      const existing = await this.loadSession(sessionId);
      if (!existing) {
        throw new Error('Session not found');
      }
      
      await this.db.collection('collaborative_sessions').doc(sessionId).update({
        ...updates,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Firebase update error:', error);
      throw new Error('Failed to update session in database');
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await this.db.collection('collaborative_sessions').doc(sessionId).delete();
    } catch (error) {
      console.error('Firebase delete error:', error);
      throw new Error('Failed to delete session from database');
    }
  }
}

// Production-ready implementation example (Supabase)
class SupabaseSessionStorage implements SessionStorageService {
  private supabase: any; // Supabase client

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async saveSession(sessionId: string, data: any): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('collaborative_sessions')
        .upsert({
          id: sessionId,
          data: data,
          last_updated: new Date().toISOString(),
          version: (data.version || 0) + 1
        });

      if (error) throw error;
    } catch (error) {
      console.error('Supabase save error:', error);
      throw new Error('Failed to save session to database');
    }
  }

  async loadSession(sessionId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('collaborative_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      if (!data) return null;

      return {
        ...data.data,
        loadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Supabase load error:', error);
      throw new Error('Failed to load session from database');
    }
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    try {
      const existing = await this.loadSession(sessionId);
      if (!existing) {
        throw new Error('Session not found');
      }

      const { error } = await this.supabase
        .from('collaborative_sessions')
        .update({
          data: { ...existing, ...updates },
          last_updated: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Supabase update error:', error);
      throw new Error('Failed to update session in database');
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('collaborative_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Supabase delete error:', error);
      throw new Error('Failed to delete session from database');
    }
  }
}

// URL-based storage (no server needed)
class URLSessionStorage implements SessionStorageService {
  async saveSession(sessionId: string, data: any): Promise<void> {
    // Store in URL parameters
    const encoded = btoa(JSON.stringify(data));
    const newURL = `${window.location.origin}${window.location.pathname}?session=${sessionId}&data=${encoded}`;
    window.history.replaceState({}, '', newURL);
  }

  async loadSession(sessionId: string): Promise<any> {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    if (!data) return null;
    
    try {
      return JSON.parse(atob(data));
    } catch {
      return null;
    }
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    const existing = await this.loadSession(sessionId);
    if (!existing) throw new Error('Session not found');
    
    await this.saveSession(sessionId, { ...existing, ...updates });
  }

  async deleteSession(sessionId: string): Promise<void> {
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// Simple API storage (for the Express server)
class APISessionStorage implements SessionStorageService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async saveSession(sessionId: string, data: any): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, data })
    });
    
    if (!response.ok) throw new Error('Failed to save session');
  }

  async loadSession(sessionId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/sessions/${sessionId}`);
    if (!response.ok) throw new Error('Failed to load session');
    
    return response.json();
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/sessions/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updates })
    });
    
    if (!response.ok) throw new Error('Failed to update session');
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/sessions/${sessionId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete session');
  }
}

// Factory function to create the appropriate storage service
export function createSessionStorage(
  provider: 'local' | 'firebase' | 'supabase' | 'url' | 'api', 
  config?: any
): SessionStorageService {
  switch (provider) {
    case 'local':
      return new LocalSessionStorage();
    case 'url':
      return new URLSessionStorage();
    case 'api':
      if (!config?.baseURL) {
        throw new Error('API base URL required');
      }
      return new APISessionStorage(config.baseURL);
    case 'firebase':
      if (!config?.firebaseApp) {
        throw new Error('Firebase app instance required');
      }
      return new FirebaseSessionStorage(config.firebaseApp);
    case 'supabase':
      if (!config?.supabaseClient) {
        throw new Error('Supabase client required');
      }
      return new SupabaseSessionStorage(config.supabaseClient);
    default:
      throw new Error(`Unsupported storage provider: ${provider}`);
  }
}

// Default export for easy usage
export const sessionStorage = createSessionStorage('local'); // Change to 'firebase' or 'supabase' for production
