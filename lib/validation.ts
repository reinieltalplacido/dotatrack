export interface ValidationResult {
  isValid: boolean;
  type?: "steam32" | "steam64" | "vanity";
  cleanId?: string;
  steam32Id?: string;
  errorMessage?: string;
}

/**
 * Validates and analyzes a user-entered Steam ID or Account ID.
 * Supports:
 * - 32-bit Account ID (e.g., 87278757 or 23623868)
 * - 64-bit Steam ID (e.g., 76561198047544485)
 * - Steam Community Profile URLs (e.g., https://steamcommunity.com/profiles/76561198047544485 or /id/customname)
 */
export function validateSteamId(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: "Please enter your Steam ID or Account ID to continue.",
    };
  }

  // Handle Steam community profile URL patterns
  const steamUrlMatch = trimmed.match(
    /(?:https?:\/\/)?steamcommunity\.com\/(?:profiles\/(\d{17})|id\/([a-zA-Z0-9_-]+))/i
  );
  if (steamUrlMatch) {
    if (steamUrlMatch[1]) {
      const steam64 = steamUrlMatch[1];
      const accountId = convertSteam64ToAccount(steam64);
      return {
        isValid: true,
        type: "steam64",
        cleanId: steam64,
        steam32Id: accountId,
      };
    }
    if (steamUrlMatch[2]) {
      return {
        isValid: true,
        type: "vanity",
        cleanId: steamUrlMatch[2],
      };
    }
  }

  // Check if it's purely digits
  if (/^\d+$/.test(trimmed)) {
    // 64-bit Steam ID check (typically 17 digits starting with 7656119)
    if (trimmed.length === 17 && trimmed.startsWith("7656119")) {
      const accountId = convertSteam64ToAccount(trimmed);
      return {
        isValid: true,
        type: "steam64",
        cleanId: trimmed,
        steam32Id: accountId,
      };
    }

    // 32-bit Account ID (usually 4 to 10 digits)
    if (trimmed.length >= 4 && trimmed.length <= 10) {
      return {
        isValid: true,
        type: "steam32",
        cleanId: trimmed,
        steam32Id: trimmed,
      };
    }

    // Unusually short or long numeric ID
    if (trimmed.length < 4) {
      return {
        isValid: false,
        errorMessage: "Account ID is too short. Standard Dota 2 account IDs are at least 4 digits.",
      };
    }

    return {
      isValid: false,
      errorMessage: "Invalid numeric ID length. Provide a 32-bit Account ID (5-10 digits) or 64-bit Steam ID (17 digits).",
    };
  }

  // If alphanumeric vanity string (custom Steam name without URL)
  if (/^[a-zA-Z0-9_-]{3,32}$/.test(trimmed)) {
    return {
      isValid: true,
      type: "vanity",
      cleanId: trimmed,
    };
  }

  return {
    isValid: false,
    errorMessage: "Invalid format. Enter a numerical Steam Account ID (e.g. 87278757) or Steam64 ID.",
  };
}

/**
 * Converts a 64-bit Steam Community ID to a 32-bit Dota 2 Account ID.
 * Base offset: 76561197960265728
 */
export function convertSteam64ToAccount(steam64: string): string {
  try {
    const base = BigInt("76561197960265728");
    const id = BigInt(steam64);
    const result = id - base;
    return result > BigInt(0) ? result.toString() : steam64;
  } catch {
    return steam64;
  }
}
