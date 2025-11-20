/* Główny plik aplikacji "Ciekawostki ze świata" */
/* Łączy wszystkie moduły i inicjalizuje aplikację */

import { initTheme } from './modules/theme.js';
import { getUserFacts } from './modules/storage.js';
import { 
    fetchFacts, 
    applyAllFilters, 
    removeFactById, 
    findFactById,
    isUserFact 
} from './modules/facts.js';
import { 
    renderFacts, 
    updateSearchInfo, 
    animateCardRemoval 
} from './modules/render.js';
import { initForm } from './modules/form.js';
import { deleteUserFactFromStorage } from './modules/storage.js';

// Stan aplikacji
const appState = {
    allFacts: [],
    currentFilter: 'all',
    searchQuery: '',
    currentSort: 'date-desc'
};

// Elementy DOM
const elements = {
    factsContainer: document.querySelector('.facts-container'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search'),
    searchResultsInfo: document.querySelector('.search-results-info'),
    themeToggle: document.getElementById('theme-toggle'),
    filterButtons: document.querySelector('.filter-buttons'),
    sortSelect: document.getElementById('sort-select')
};

// Elementy formularza
const formElements = {
    toggleBtn: document.getElementById('toggle-form-btn'),
    container: document.getElementById('add-fact-form-container'),
    form: document.getElementById('add-fact-form'),
    cancelBtn: document.getElementById('cancel-form-btn'),
    messageElement: document.getElementById('form-message'),
    titleInput: document.getElementById('fact-title-input'),
    categoryInput: document.getElementById('fact-category-input'),
    descriptionInput: document.getElementById('fact-description-input'),
    sourceInput: document.getElementById('fact-source-input')
};

/* Pobranie przefiltrowanych ciekawostek */
/* @returns {Array} Przefiltrowana tablica ciekawostek */
function getFilteredFacts(){
    return applyAllFilters(appState.allFacts, {
        category: appState.currentFilter,
        searchQuery: appState.searchQuery,
        sortBy: appState.currentSort
    });
}

/* Renderowanie ciekawostek i aktualizowanie UI */
function updateUI(){
    const filteredFacts = getFilteredFacts();
    renderFacts(elements.factsContainer, filteredFacts);
    updateSearchInfo(
        elements.searchResultsInfo, 
        filteredFacts.length, 
        appState.searchQuery, 
        appState.currentFilter
    );
}

/* Aktualizowanie aktywnego przycisku filtra */
/* @param {string} category - Wybrana kategoria */
function updateActiveFilterButton(category){
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`.filter-btn[data-category="${category}"]`);
    if(activeButton){
        activeButton.classList.add('active');
    }
}

/* Obsługiwanie kliknięcia przycisku filtra */
/* @param {Event} event - Event kliknięcia */
function handleFilterClick(event){
    const button = event.target;

    if(!button.classList.contains('filter-btn')){
        return;
    }

    const category = button.dataset.category;
    appState.currentFilter = category;

    console.log(`Filtering by category: ${category}`);

    updateActiveFilterButton(category);
    updateUI();

    const filteredCount = getFilteredFacts().length;
    console.log(`Showing ${filteredCount} facts for category: ${category}`);
}

/* Obsługiwanie wpisywania w pole wyszukiwania 
/* @param {Event} event - Event input */
function handleSearchInput(event){
    appState.searchQuery = event.target.value;

    if(appState.searchQuery.trim() !== ''){
        elements.clearSearchBtn.style.display = 'flex';
    } 
    else{
        elements.clearSearchBtn.style.display = 'none';
    }

    updateUI();

    const filteredCount = getFilteredFacts().length;
    console.log(`Search query: "${appState.searchQuery}", found ${filteredCount} facts.`);
}

/* Czyszczenie wyszukiwania */
function clearSearch(){
    elements.searchInput.value = '';
    appState.searchQuery = '';
    elements.clearSearchBtn.style.display = 'none';

    updateUI();
    elements.searchInput.focus();

    console.log('Search cleared.');
}

/* Obsługiwanie zmiany sortowania */
/* @param {Event} event - Event change */
function handleSortChange(event){
    appState.currentSort = event.target.value;
    
    console.log(`Sorting by: ${appState.currentSort}`);
    
    updateUI();
}

/* Usuwanie ciekawostki użytkownika */
/* @param {number} factId - ID ciekawostki do usunięcia */
function deleteUserFact(factId){
    const fact = findFactById(appState.allFacts, factId);
    
    if(!fact || !isUserFact(fact)){
        console.error('Cannot delete: Not a user fact or not found');
        return;
    }
    
    const confirmed = confirm(
        `Czy na pewno chcesz usunąć ciekawostkę:\n\n"${fact.title}"?\n\nTej operacji nie można cofnąć.`
    );
    
    if(!confirmed){
        console.log('Delete cancelled by user');
        return;
    }
    
    console.log(`Deleting fact ID: ${factId}`);
    
    const card = document.querySelector(`[data-fact-id="${factId}"]`);
    
    if(card){
        animateCardRemoval(card, () => {
            // Usunięcie z tablicy
            appState.allFacts = removeFactById(appState.allFacts, factId);
            
            // Usunięcie z localStorage
            deleteUserFactFromStorage(factId);
            
            // Odświeżenie UI
            updateUI();
            
            console.log(`Fact deleted. Remaining: ${appState.allFacts.length}`);
        });
    }
}

/* Obsługiwanie kliknięcia przycisku usuwania */
/* @param {Event} event - Event kliknięcia */
function handleDeleteClick(event){
    if(event.target.classList.contains('btn-delete') || event.target.closest('.btn-delete')){
        
        const deleteBtn = event.target.classList.contains('btn-delete') ? event.target : event.target.closest('.btn-delete');
        
        const factId = parseInt(deleteBtn.dataset.id);
        
        deleteUserFact(factId);
    }
}

/* Callback dla modułu formularza */
/* @param {string} action - Akcja do wykonania */
/* @param {*} data - Dane opcjonalne */
function handleFormCallback(action, data){
    if(action === 'getAllFacts'){
        return appState.allFacts;
    }
    
    if(action === 'factAdded'){
        // Dodanie nowej ciekawostki na początek
        appState.allFacts.unshift(data);
        updateUI();
    }
}

/* Inicjalizowanie wszystkich event listenerow */
function initEventListeners(){
    // Filtry kategorii
    if(elements.filterButtons){
        elements.filterButtons.addEventListener('click', handleFilterClick);
        console.log('Filter buttons initialized.');
    }

    // Wyszukiwanie
    if(elements.searchInput){
        elements.searchInput.addEventListener('input', handleSearchInput);
        console.log('Search input initialized.');
    }

    if(elements.clearSearchBtn){
        elements.clearSearchBtn.addEventListener('click', clearSearch);
        console.log('Clear search button initialized.');
    }

    // Sortowanie
    if(elements.sortSelect){
        elements.sortSelect.addEventListener('change', handleSortChange);
        console.log('Sort select initialized.');
    }

    // Usuwanie ciekawostek
    if(elements.factsContainer){
        elements.factsContainer.addEventListener('click', handleDeleteClick);
        console.log('Delete buttons initialized.');
    }
}

/* Inicjalizowanoe aplikacji */
async function init() {
    console.log('Initializing application...');

    // Inicjalizowanie motywów
    initTheme(elements.themeToggle);

    // Pobranieciekawostek z JSON
    appState.allFacts = await fetchFacts();

    // Dodanie ciekawostek użytkownika z localStorage
    const userFacts = getUserFacts();
    if(userFacts.length > 0){
        appState.allFacts = [...userFacts, ...appState.allFacts];
        console.log(`Loaded ${userFacts.length} user facts from localStorage`);
    }

    if(appState.allFacts.length > 0){
        // Renderowanie początkowego widoku
        updateUI();

        // Inicjalizowanie event listenerow
        initEventListeners();

        // Inicjalizowanie formularza
        initForm(formElements, handleFormCallback);

        console.log(`Application initialized with ${appState.allFacts.length} facts.`);
    } 
    else{
        elements.factsContainer.innerHTML += '<p style="color: red;">Nie udało się załadować ciekawostek.</p>';
    }
}

const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Uruchomienie aplikacji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', init);