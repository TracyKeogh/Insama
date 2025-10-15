// JSONBin.io as a free JSON storage service
// Simple API, no authentication needed for public bins

export class JSONBinStorageService {
  private static readonly JSONBIN_API = 'https://api.jsonbin.io/v3/b';
  private static readonly API_KEY = 'your-jsonbin-api-key'; // Get free at jsonbin.io

  // Save session to JSONBin
  static async saveSession(session: any): Promise<string> {
    try {
      const response = await fetch(this.JSONBIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.API_KEY,
          'X-Bin-Name': `Insama Session ${session.id}`,
        },
        body: JSON.stringify(session)
      });

      if (!response.ok) throw new Error('Failed to save to JSONBin');
      
      const result = await response.json();
      return result.metadata.id; // Bin ID
    } catch (error) {
      console.error('JSONBin save error:', error);
      throw error;
    }
  }

  // Load session from JSONBin
  static async loadSession(binId: string): Promise<any> {
    try {
      const response = await fetch(`${this.JSONBIN_API}/${binId}/latest`, {
        headers: {
          'X-Master-Key': this.API_KEY,
        }
      });

      if (!response.ok) throw new Error('Failed to load from JSONBin');
      
      const result = await response.json();
      return result.record;
    } catch (error) {
      console.error('JSONBin load error:', error);
      throw error;
    }
  }

  // Update existing bin
  static async updateSession(binId: string, session: any): Promise<void> {
    try {
      const response = await fetch(`${this.JSONBIN_API}/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.API_KEY,
        },
        body: JSON.stringify(session)
      });

      if (!response.ok) throw new Error('Failed to update JSONBin');
    } catch (error) {
      console.error('JSONBin update error:', error);
      throw error;
    }
  }

  // Generate shareable URL
  static generateShareableURL(binId: string): string {
    return `https://jsonbin.io/${binId}`;
  }
}
