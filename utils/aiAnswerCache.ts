interface CachedAnswer {
  answer: string;
  timestamp: number;
}

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of cached answers
const CACHE_PREFIX = 'ai_answer_';

// In-memory cache for faster access
const memoryCache = new Map<string, CachedAnswer>();

// Initialize memory cache from localStorage on first load
let isInitialized = false;

const initializeCache = () => {
  if (isInitialized || typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const data: CachedAnswer = JSON.parse(cached);
          const questionId = key.replace(CACHE_PREFIX, '');
          
          // Only load if not expired
          if (Date.now() - data.timestamp < CACHE_EXPIRY) {
            memoryCache.set(questionId, data);
          } else {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Skip invalid entries
      }
    });
    
    isInitialized = true;
  } catch {
    // Ignore initialization errors
  }
};

const cleanupExpiredEntries = () => {
  const now = Date.now();
  const expiredKeys: string[] = [];
  
  memoryCache.forEach((value, key) => {
    if (now - value.timestamp >= CACHE_EXPIRY) {
      expiredKeys.push(key);
    }
  });
  
  expiredKeys.forEach(key => {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch {
      // Ignore cleanup errors
    }
  });
};

const evictOldestEntry = () => {
  if (memoryCache.size < MAX_CACHE_SIZE) return;
  
  let oldestKey: string | null = null;
  let oldestTimestamp = Infinity;
  
  memoryCache.forEach((value, key) => {
    if (value.timestamp < oldestTimestamp) {
      oldestTimestamp = value.timestamp;
      oldestKey = key;
    }
  });
  
  if (oldestKey) {
    memoryCache.delete(oldestKey);
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${oldestKey}`);
    } catch {
      // Ignore eviction errors
    }
  }
};

export const getCachedAIAnswer = (questionId: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  initializeCache();
  cleanupExpiredEntries();
  
  const cached = memoryCache.get(questionId);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp >= CACHE_EXPIRY) {
    memoryCache.delete(questionId);
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${questionId}`);
    } catch {
      // Ignore cleanup errors
    }
    return null;
  }
  
  return cached.answer;
};

export const setCachedAIAnswer = (questionId: string, answer: string): void => {
  if (typeof window === 'undefined') return;
  
  initializeCache();
  cleanupExpiredEntries();
  evictOldestEntry();
  
  const cachedData: CachedAnswer = {
    answer,
    timestamp: Date.now()
  };
  
  memoryCache.set(questionId, cachedData);
  
  try {
    localStorage.setItem(`${CACHE_PREFIX}${questionId}`, JSON.stringify(cachedData));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Remove oldest entries and try again
      const entries = Array.from(memoryCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const entriesToRemove = Math.ceil(MAX_CACHE_SIZE * 0.2); // Remove 20%
      entries.slice(0, entriesToRemove).forEach(([key]) => {
        memoryCache.delete(key);
        try {
          localStorage.removeItem(`${CACHE_PREFIX}${key}`);
        } catch {
          // Ignore cleanup errors
        }
      });
      
      // Try again
      try {
        localStorage.setItem(`${CACHE_PREFIX}${questionId}`, JSON.stringify(cachedData));
      } catch {
        // If still fails, keep in memory only
      }
    }
  }
};

export const clearCache = (): void => {
  if (typeof window === 'undefined') return;
  
  memoryCache.clear();
  
  try {
    const keys = Object.keys(localStorage);
    keys.filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch {
    // Ignore cleanup errors
  }
};

