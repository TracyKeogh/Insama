// URL-based storage - no server required!
// Perfect for simple sharing without persistence

export class URLStorageService {
  
  // Encode session data into URL
  static encodeSession(session: any): string {
    try {
      const compressed = JSON.stringify(session);
      // Use base64 encoding for URL safety
      const encoded = btoa(compressed);
      return encoded;
    } catch (error) {
      console.error('Failed to encode session:', error);
      return '';
    }
  }

  // Decode session data from URL
  static decodeSession(encoded: string): any {
    try {
      const decoded = atob(encoded);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode session:', error);
      return null;
    }
  }

  // Generate shareable URL with session data
  static generateShareableURL(session: any): string {
    const encoded = this.encodeSession(session);
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?data=${encoded}`;
  }

  // Extract session from current URL
  static getSessionFromURL(): any {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    if (!data) return null;
    return this.decodeSession(data);
  }

  // Update URL with new session data
  static updateURL(session: any): void {
    const encoded = this.encodeSession(session);
    const newURL = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    window.history.replaceState({}, '', newURL);
  }
}

// Usage example:
// const shareableURL = URLStorageService.generateShareableURL(sessionData);
// // Partner can use this URL to access the exact same data
