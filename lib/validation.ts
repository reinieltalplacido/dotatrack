export interface ValidationResult {
  isValid: boolean;
  type?: "steam32" | "steam64" | "profile_url" | "vanity";
  cleanId?: string;
  steam32Id?: string;
  errorMessage?: string;
}

const STEAM64_OFFSET = BigInt("76561197960265728");
const MAX_UINT32 = BigInt("4294967295");

/**
 * Validates and normalizes user input into a canonical 32-bit Dota 2 Account ID.
 * Supports:
 * - 32-bit Account ID (e.g. 70388657, 87278757)
 * - 64-bit Steam ID (e.g. 76561198030654385)
 * - Steam Community Profile URLs (steamcommunity.com/profiles/...)
 * - OpenDota / Dotabuff player profile URLs (opendota.com/players/..., dotabuff.com/players/...)
 */
export function validateSteamId(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: "Please enter your Steam ID or Account ID to continue.",
    };
  }

  // Reject negative numbers or values with negative signs
  if (trimmed.startsWith("-") || /^-\d+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: "Account IDs cannot be negative numbers.",
    };
  }

  // Check for OpenDota or Dotabuff player profile URL
  const dotaTrackerUrlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:opendota|dotabuff)\.com\/players\/(\d+)/i
  );
  if (dotaTrackerUrlMatch && dotaTrackerUrlMatch[1]) {
    const rawId = dotaTrackerUrlMatch[1];
    const num = BigInt(rawId);
    if (num > BigInt(0) && num <= MAX_UINT32) {
      return {
        isValid: true,
        type: "profile_url",
        cleanId: rawId,
        steam32Id: rawId,
      };
    }
    return {
      isValid: false,
      errorMessage: "The Account ID in this URL is out of valid 32-bit range.",
    };
  }

  // Check for Steam Community profile URL
  const steamUrlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?steamcommunity\.com\/(?:profiles\/(\d+)|id\/([a-zA-Z0-9_-]+))/i
  );
  if (steamUrlMatch) {
    if (steamUrlMatch[1]) {
      const steam64 = steamUrlMatch[1];
      const converted = convertSteam64ToAccount(steam64);
      if (converted) {
        return {
          isValid: true,
          type: "profile_url",
          cleanId: steam64,
          steam32Id: converted,
        };
      }
      return {
        isValid: false,
        errorMessage: "The Steam64 ID in this profile URL is invalid or out of range.",
      };
    }

    if (steamUrlMatch[2]) {
      return {
        isValid: false,
        type: "vanity",
        errorMessage:
          "Custom Steam vanity URLs (e.g. steamcommunity.com/id/name) do not directly provide a Dota Account ID. Please use your numeric 32-bit Account ID (e.g. 70388657) or standard Steam profile URL.",
      };
    }
  }

  // Purely numeric input
  if (/^\d+$/.test(trimmed)) {
    // 64-bit Steam ID (17 digits starting with 7656119)
    if (trimmed.length === 17 && trimmed.startsWith("7656119")) {
      const converted = convertSteam64ToAccount(trimmed);
      if (converted) {
        return {
          isValid: true,
          type: "steam64",
          cleanId: trimmed,
          steam32Id: converted,
        };
      }
      return {
        isValid: false,
        errorMessage: "SteamID64 is out of valid Dota 2 32-bit address space.",
      };
    }

    // Attempt parsing as 32-bit Account ID
    try {
      const num = BigInt(trimmed);
      if (num === BigInt(0)) {
        return {
          isValid: false,
          errorMessage: "Account ID must be greater than 0.",
        };
      }
      if (num > MAX_UINT32) {
        // Number is too large for 32-bit and didn't match valid Steam64 format
        return {
          isValid: false,
          errorMessage:
            "Value exceeds valid 32-bit Account ID range. If providing a SteamID64, verify it is 17 digits starting with 7656119.",
        };
      }

      // Valid 32-bit numeric ID
      return {
        isValid: true,
        type: "steam32",
        cleanId: trimmed,
        steam32Id: trimmed,
      };
    } catch {
      return {
        isValid: false,
        errorMessage: "Malformed numerical ID.",
      };
    }
  }

  // Reject malformed vanity strings or alphanumeric inputs
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      isValid: false,
      type: "vanity",
      errorMessage:
        "Please enter your numeric Dota 2 Account ID (e.g. 70388657) or 17-digit SteamID64 rather than a vanity handle.",
    };
  }

  return {
    isValid: false,
    errorMessage: "Invalid format. Enter a numerical Dota 2 Account ID (e.g. 70388657) or SteamID64.",
  };
}

/**
 * Converts a 64-bit Steam Community ID to a 32-bit Dota 2 Account ID.
 * Returns null if the conversion produces an invalid or out-of-range 32-bit ID.
 */
export function convertSteam64ToAccount(steam64: string): string | null {
  try {
    const id = BigInt(steam64);
    if (id <= STEAM64_OFFSET) {
      return null;
    }
    const result = id - STEAM64_OFFSET;
    if (result > BigInt(0) && result <= MAX_UINT32) {
      return result.toString();
    }
    return null;
  } catch {
    return null;
  }
}
