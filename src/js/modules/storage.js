/* Moduł zarządzania localStorage */
/* Odpowiada za zapisywanie i odczytywanie danych użytkownika */

const STORAGE_KEYS = {
    USER_FACTS: 'userFacts',
    THEME: 'theme'
};

/* Pobieranie ciekawostki użytkownika z localStorage */
/* @returns {Array} Tablica ciekawostek użytkownika */
export function getUserFacts() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_FACTS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading user facts from localStorage:', error);
        return [];
    }
}

/* Zapisywanie ciekawostki użytkownika do localStorage */
/* @param {Array} facts - Tablica ciekawostek do zapisania */
export function saveUserFacts(facts){
    try{
        localStorage.setItem(STORAGE_KEYS.USER_FACTS, JSON.stringify(facts));
        console.log('Saved to localStorage:', facts.length, 'user facts');
    }
    catch (error){
        console.error('Error saving user facts to localStorage:', error);
    }
}

/* Usuwanie ciekawosti użytkownika z localStorage */
/* @param {number} factId - ID ciekawostki do usunięcia */
/* @returns {boolean} True jeśli usunięto pomyślnie */
export function deleteUserFactFromStorage(factId){
    try{
        let userFacts = getUserFacts();
        const initialLength = userFacts.length;
        
        userFacts = userFacts.filter(f => f.id !== factId);
        
        if(userFacts.length < initialLength){
            saveUserFacts(userFacts);
            return true;
        }
        
        return false;
    } 
    catch (error){
        console.error('Error deleting user fact from localStorage:', error);
        return false;
    }
}

/* Pobieranie zapisanego motywu z localStorage */
/* @returns {string} 'light' lub 'dark' */
export function getSavedTheme(){
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    
    if(savedTheme){
        return savedTheme;
    }

    // Sprawdzenie preferencji systemowych
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
        return 'light';
    }

    return 'dark';
}

/* Zapisywanie wybranego motywu do localStorage */
/* @param {string} theme - 'light' lub 'dark */
export function saveTheme(theme){
    try{
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        console.log(`Theme saved: ${theme}`);
    } 
    catch (error){
        console.error('Error saving theme to localStorage:', error);
    }
}

/* Czyści wszystkie dane użytkownika z localStorage */
export function clearAllUserData(){
    try{
        localStorage.removeItem(STORAGE_KEYS.USER_FACTS);
        console.log('All user data cleared from localStorage');
    } 
    catch (error){
        console.error('Error clearing user data from localStorage:', error);
    }
}