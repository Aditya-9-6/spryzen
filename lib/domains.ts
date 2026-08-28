/**
 * Spryzen Dynamic Domain & Subdomain Resolver
 * Automatically switches between Local Development and Production Root/Subdomains.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.ROOT_DOMAIN || '';

export const DOMAINS = {
  /**
   * Root Marketing Website (e.g. https://spryzen.com or http://localhost:3000)
   */
  get website(): string {
    if (process.env.NEXT_PUBLIC_WEBSITE_URL) return process.env.NEXT_PUBLIC_WEBSITE_URL;
    if (ROOT_DOMAIN) return `https://${ROOT_DOMAIN}`;
    return IS_PRODUCTION ? 'https://spryzen.com' : 'http://localhost:3000';
  },

  /**
   * Customer Self-Service Portal (e.g. https://portal.spryzen.com or http://localhost:3001)
   */
  get portal(): string {
    if (process.env.NEXT_PUBLIC_PORTAL_URL) return process.env.NEXT_PUBLIC_PORTAL_URL;
    if (ROOT_DOMAIN) return `https://portal.${ROOT_DOMAIN}`;
    return IS_PRODUCTION ? 'https://portal.spryzen.com' : 'http://localhost:3001';
  },

  /**
   * Core Rust Management & Client API (e.g. https://api.spryzen.com or http://localhost:3030)
   */
  get api(): string {
    if (process.env.NEXT_PUBLIC_SPRYZEN_API_URL || process.env.SPRYZEN_API_URL) {
      return process.env.NEXT_PUBLIC_SPRYZEN_API_URL || process.env.SPRYZEN_API_URL!;
    }
    if (ROOT_DOMAIN) return `https://api.${ROOT_DOMAIN}`;
    return IS_PRODUCTION ? 'https://api.spryzen.com' : 'http://localhost:3030';
  },

  /**
   * Edge Gateway / Proxy Node (e.g. https://edge.spryzen.cloud or http://localhost:8080)
   */
  get edge(): string {
    if (process.env.NEXT_PUBLIC_EDGE_URL || process.env.EDGE_URL) {
      return process.env.NEXT_PUBLIC_EDGE_URL || process.env.EDGE_URL!;
    }
    if (ROOT_DOMAIN) return `https://edge.${ROOT_DOMAIN}`;
    return IS_PRODUCTION ? 'https://edge.spryzen.cloud' : 'http://localhost:8080';
  },
};
