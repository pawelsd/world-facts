/* Moduł zarządzania ciekawostkami */
/* Odpowiada za pobieranie, filtrowanie, wyszukiwanie i sortowanie ciekawostek */

const FACTS_DATA_URL = './data/facts.json';

/* Pobieranie ciekawostki z pliku JSON */
/* @returns {Promise<Array>} Tablica ciekawostek */
export async function fetchFacts(){
    try{
        const response = await fetch(FACTS_DATA_URL);

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Fetched ${data.length} facts from JSON`);
        return data;
    } 
    catch (error){
        console.error('Error fetching facts:', error);
        return [];
    }
}

/* Filtrowanie ciekawostki według kategorii */
/* @param {Array} facts - Tablica wszystkich ciekawostek */
/* @param {string} category - Kategoria do filtrowania ('all' dla wszystkich) */
/* @returns {Array} Przefiltrowana tablica ciekawostek */
export function filterByCategory(facts, category){
    if(category === 'all'){
        return facts;
    }

    return facts.filter(fact => 
        fact.category.toLowerCase() === category.toLowerCase()
    );
}

/* Wyszukiwanie ciekawostki według zapytania */
/* @param {Array} facts - Tablica ciekawostek */
/* @param {string} query - Zapytanie wyszukiwania */
/* @returns {Array} Przefiltrowana tablica ciekawostek */
export function searchFacts(facts, query){
    if (!query || query.trim() === ''){
        return facts;
    }

    const lowerQuery = query.toLowerCase().trim();

    return facts.filter(fact => {
        const titleMatch = fact.title.toLowerCase().includes(lowerQuery);
        const descriptionMatch = fact.description.toLowerCase().includes(lowerQuery);
        const categoryMatch = fact.category.toLowerCase().includes(lowerQuery);

        return titleMatch || descriptionMatch || categoryMatch;
    });
}

/* Sortowanie ciekawostki według wybranego kryterium */
/* @param {Array} facts - Tablica ciekawostek */
/* @param {string} sortBy - Kryterium sortowania */
/* @returns {Array} Posortowana tablica ciekawostek */
export function sortFacts(facts, sortBy){
    const sortedFacts = [...facts];
    
    switch (sortBy){
        case 'date-desc': // Najnowsze
            return sortedFacts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        
        case 'date-asc': // Najstarsze
            return sortedFacts.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
        
        case 'title-asc': // A-Z
            return sortedFacts.sort((a, b) => {
                return a.title.localeCompare(b.title, 'pl');
            });
        
        case 'title-desc': // Z-A
            return sortedFacts.sort((a, b) => {
                return b.title.localeCompare(a.title, 'pl');
            });
        
        default:
            return sortedFacts;
    }
}

/* Stosowanie wszystkich filtrów (kategoria, wyszukiwanie, sortowanie) */
/* @param {Array} allFacts - Wszystkie ciekawostki */
/* @param {Object} filters - Obiekt z filtrami */
/* @param {string} filters.category - Kategoria */
/* @param {string} filters.searchQuery - Zapytanie wyszukiwania */
/* @param {string} filters.sortBy - Kryterium sortowania */
/* @returns {Array} Przefiltrowana i posortowana tablica */
export function applyAllFilters(allFacts, filters){
    let facts = filterByCategory(allFacts, filters.category);
    facts = searchFacts(facts, filters.searchQuery);
    facts = sortFacts(facts, filters.sortBy);
    
    return facts;
}

/* Generowanie unikalnego ID dla nowej ciekawostki */
/* @param {Array} allFacts - Wszystkie ciekawostki */
/* @returns {number} Nowe ID */
export function generateFactId(allFacts){
    const maxId = Math.max(
        ...allFacts.map(f => f.id),
        0
    );
    return maxId + 1;
}

/* Sprawdzenie czy ciekawostka należy do użytkownika */
/* @param {Object} fact - Obiekt ciekawostki */
/* @returns {boolean} True jeśli jest dodana przez użytkownika */
export function isUserFact(fact){
    return fact && fact.userAdded === true;
}

/* Usuwanie ciekawostki z tablicy */
/* @param {Array} facts - Tablica ciekawostek */
/* @param {number} factId - ID ciekawostki do usunięcia */
/* @returns {Array} Nowa tablica bez usuniętej ciekawostki */
export function removeFactById(facts, factId){
    return facts.filter(f => f.id !== factId);
}

/* Znajdowanie ciekawostki po ID */
/* @param {Array} facts - Tablica ciekawostek */
/* @param {number} factId - ID ciekawostki */
/* @returns {Object|undefined} Znaleziona ciekawostka lub undefined */
export function findFactById(facts, factId){
    return facts.find(f => f.id === factId);
}