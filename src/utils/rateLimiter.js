/**
 * 🔒 Client-Side Rate Limiter
 * Prevents spam and abuse of contact form
 */

class RateLimiter {
  constructor(maxAttempts = 3, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  /**
   * Check if action is allowed
   * @param {string} key Unique identifier (email, IP, etc.)
   * @returns {Object} { allowed: boolean, remainingAttempts: number, resetTime: number }
   */
  check(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || { count: 0, firstAttempt: now };

    // Reset if window has passed
    if (now - userAttempts.firstAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts - 1,
        resetTime: now + this.windowMs,
      };
    }

    // Check if limit exceeded
    if (userAttempts.count >= this.maxAttempts) {
      const resetTime = userAttempts.firstAttempt + this.windowMs;
      const waitTime = Math.ceil((resetTime - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime,
        waitTime,
        message: `Too many requests. Please wait ${waitTime} seconds before trying again.`,
      };
    }

    // Increment attempts
    userAttempts.count++;
    this.attempts.set(key, userAttempts);

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - userAttempts.count,
      resetTime: userAttempts.firstAttempt + this.windowMs,
    };
  }

  /**
   * Reset attempts for a key
   * @param {string} key Unique identifier
   */
  reset(key) {
    this.attempts.delete(key);
  }

  /**
   * Clear all attempts (cleanup)
   */
  clear() {
    this.attempts.clear();
  }

  /**
   * Get remaining attempts for a key
   * @param {string} key Unique identifier
   * @returns {number} Remaining attempts
   */
  getRemainingAttempts(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key);

    if (!userAttempts) return this.maxAttempts;

    // Reset if window has passed
    if (now - userAttempts.firstAttempt > this.windowMs) {
      this.attempts.delete(key);
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - userAttempts.count);
  }
}

// Create singleton instance for contact form
// 3 attempts per 60 seconds (1 minute)
export const contactFormLimiter = new RateLimiter(3, 60000);

// Export class for custom usage
export default RateLimiter;

/**
 * Honeypot field detector for bot prevention
 * Add a hidden field that bots will fill but humans won't see
 */
export const isHoneypotFilled = (honeypotValue) => {
  return honeypotValue && honeypotValue.trim().length > 0;
};

/**
 * Validate submission timing (too fast = likely bot)
 * @param {number} formMountTime Timestamp when form was mounted
 * @param {number} minTime Minimum time in ms (default 3 seconds)
 * @returns {boolean} True if submission time is valid
 */
export const validateSubmissionTiming = (formMountTime, minTime = 3000) => {
  const submissionTime = Date.now();
  const timeTaken = submissionTime - formMountTime;
  return timeTaken >= minTime;
};

/**
 * Simple spam detection based on content
 * @param {string} text Content to check
 * @returns {boolean} True if spam detected
 */
export const detectSpam = (text) => {
  const spamPatterns = [
    /viagra/i,
    /cialis/i,
    /casino/i,
    /lottery/i,
    /click here/i,
    /buy now/i,
    /(http|https):\/\/.*\.(ru|tk|ml|ga)/i, // Suspicious TLDs
    /\b\d{10,}\b/, // Long numbers (phone spam)
  ];

  return spamPatterns.some(pattern => pattern.test(text));
};

/**
 * Validate email format (RFC 5322 compliant)
 * @param {string} email Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return input.replace(reg, (match) => map[match]);
};
