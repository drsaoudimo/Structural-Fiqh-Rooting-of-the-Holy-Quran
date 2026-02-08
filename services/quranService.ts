import { Surah } from "../types";

const BASE_URL = "https://api.alquran.cloud/v1";

export const getSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) throw new Error("Failed to fetch surahs");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return [];
  }
};

export const getVersesText = async (surahNumber: number, start: number, end: number): Promise<string> => {
  try {
    // Fetch the specific range if possible, or fetch surah and slice. 
    // The API supports offset/limit but simpler to just get the surah edition text.
    // For specific ranges, we can construct the call. 
    // Getting the full surah is safer for context but let's try to be efficient.
    // We will fetch the full surah text (simple arabic) and slice it client side 
    // because the API structure for ranges can be complex with editions.
    
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/ar.quran-simple`);
    if (!response.ok) throw new Error("Failed to fetch verses");
    
    const data = await response.json();
    const ayahs = data.data.ayahs;
    
    // Filter by range (human readable 1-based index)
    const filtered = ayahs.filter((ayah: any) => ayah.numberInSurah >= start && ayah.numberInSurah <= end);
    
    // Add verse end symbol for better visualization
    return filtered.map((ayah: any) => `${ayah.text} ﴿${ayah.numberInSurah}﴾`).join(" ");
  } catch (error) {
    console.error("Error fetching text:", error);
    throw error;
  }
};