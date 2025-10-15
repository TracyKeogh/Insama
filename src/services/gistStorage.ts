// GitHub Gist as a free database
// No authentication required, just API calls

export class GistStorageService {
  private static readonly GITHUB_API = 'https://api.github.com/gists';

  // Save session to a new Gist
  static async saveSession(session: any): Promise<string> {
    try {
      const response = await fetch(this.GITHUB_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Insama Session ${session.id}`,
          public: true, // Make it publicly accessible
          files: {
            'session.json': {
              content: JSON.stringify(session, null, 2)
            }
          }
        })
      });

      if (!response.ok) throw new Error('Failed to save to Gist');
      
      const result = await response.json();
      return result.id; // Gist ID
    } catch (error) {
      console.error('Gist save error:', error);
      throw error;
    }
  }

  // Load session from Gist
  static async loadSession(gistId: string): Promise<any> {
    try {
      const response = await fetch(`${this.GITHUB_API}/${gistId}`);
      if (!response.ok) throw new Error('Failed to load from Gist');
      
      const gist = await response.json();
      const content = gist.files['session.json'].content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Gist load error:', error);
      throw error;
    }
  }

  // Update existing Gist
  static async updateSession(gistId: string, session: any): Promise<void> {
    try {
      const response = await fetch(`${this.GITHUB_API}/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            'session.json': {
              content: JSON.stringify(session, null, 2)
            }
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update Gist');
    } catch (error) {
      console.error('Gist update error:', error);
      throw error;
    }
  }

  // Generate shareable URL
  static generateShareableURL(gistId: string): string {
    return `https://gist.github.com/${gistId}`;
  }
}

// Usage:
// const gistId = await GistStorageService.saveSession(sessionData);
// const shareableURL = GistStorageService.generateShareableURL(gistId);
