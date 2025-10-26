const FACTS_DATA_URL = './data/facts.json';

const factsContainer = document.querySelector('.facts-container');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const searchResultsInfo = document.querySelector('.search-results-info');
const themeToggle = document.getElementById('theme-toggle');

const toggleFormBtn = document.getElementById('toggle-form-btn');
const formContainer = document.getElementById('add-fact-form-container');
const addFactForm = document.getElementById('add-fact-form');
const cancelFormBtn = document.getElementById('cancel-form-btn');
const formMessage = document.getElementById('form-message');

const titleInput = document.getElementById('fact-title-input');
const categoryInput = document.getElementById('fact-category-input');
const descriptionInput = document.getElementById('fact-description-input');
const sourceInput = document.getElementById('fact-source-input');

function getSavedTheme(){
    const savedThheme = localStorage.getItem('theme');
    if(savedThheme){
        return savedThheme;
    }

    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
        return 'light';
    }

    return 'dark';
}

function applyTheme(theme){
    if(theme === 'light'){
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Przełącz na motyw ciemny');
    }
    else{
        document.documentElement.removeAttribute('data-theme');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Przełącz na motyw jasny');
    }

    localStorage.setItem('theme', theme);

    console.log(`Theme changec to: ${theme}`);
}

function toggleTheme(){
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(newTheme);
}

function initTheme(){
    const savedTheme = getSavedTheme();

    applyTheme(savedTheme);

    console.log(`Theme initialized to: ${savedTheme}`);
}

async function fetchFacts() {
    try{
        const response = await fetch(FACTS_DATA_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching facts:', error);
        return [];
    }
}

function createFactCard(fact){
    return `
        <article class="fact-card">
            <div class="fact-header">
                <span class="fact-category" data-category="${fact.category}">${fact.category}</span>
                <span class="fact-date">${fact.date}</span>
            </div>
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-description">${fact.description}</p>
            <div class="fact-footer">
                <button class="btn-read-more" data-id="${fact.id}">Czytaj więcej</button>
            </div>
            <p class="fact-source">${fact.source}</p>
        </article>
    `;
}

function renderFacts(facts){
    const heading = factsContainer.querySelector('h2');
    
    factsContainer.innerHTML = '';
    if(heading){
        factsContainer.appendChild(heading);
    }

    if(facts.length === 0){
        const emptyMessage = document.createElement('p');
        emptyMessage.style.color = '#ccc';
        emptyMessage.textContent = 'Brak ciekawostek do wyświetlenia.';
        factsContainer.appendChild(emptyMessage);
        return;
    }

    facts.forEach(fact => {
        const cardHTML = createFactCard(fact);
        factsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

   console.log(`Rendered ${facts.length} facts.`);
}

let allFacts = [];
let currentFilter = 'all';
let searchQuery = '';

function filterFacts(category){
    if(category === 'all'){
        return allFacts;
    }

    return allFacts.filter(fact => fact.category.toLowerCase() === category.toLowerCase());
}

function updateActiveButton(category){
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`.filter-btn[data-category="${category}"]`);
    if(activeButton){
        activeButton.classList.add('active');
    }
}

function handleFilterClick(event){
    const button = event.target;

    if(!button.classList.contains('filter-btn')){
        return;
    }

    const category = button.dataset.category;
    currentFilter = category;

    console.log(`Filtering facts by category: ${category}`);

    updateActiveButton(category);

    const filteredFacts = getFilteredFacts();
    renderFacts(filteredFacts);
    updateSearchInfo(filteredFacts.length);

    console.log(`Showing ${filteredFacts.length} facts for category: ${category}`);
}

function searchFacts(facts, query){
    if(!query || query.trim() === ''){
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

function getFilteredFacts(){
    let facts = filterFacts(currentFilter);

    facts = searchFacts(facts, searchQuery);

    return facts;
}

function updateSearchInfo(count){
    if(searchQuery.trim() !== '' || currentFilter !== 'all'){
        searchResultsInfo.textContent = `Znaleziono ${count} ciekawostek.`;
    }
    else{
        searchResultsInfo.textContent = '';
    }
}

function handleSearchInput(event){
    searchQuery = event.target.value;

    if(searchQuery.trim() !== ''){
        clearSearchBtn.style.display = 'flex';
    }
    else{
        clearSearchBtn.style.display = 'none';
    }

    const fileteredFacts = getFilteredFacts();
    renderFacts(fileteredFacts);
    updateSearchInfo(fileteredFacts.length);

    console.log(`Search query: "${searchQuery}", found ${fileteredFacts.length} facts.`);
}

function clearSearch(){
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';

    const filteredFacts = getFilteredFacts();
    renderFacts(filteredFacts);
    updateSearchInfo(filteredFacts.length);

    searchInput.focus();

    console.log('Search cleared.');
}

function toggleForm(){
    const isVisible = formContainer.style.display !== 'none';
    
    if(isVisible){
        formContainer.style.display = 'none';
        toggleFormBtn.textContent = 'Dodaj swoją ciekawostkę';
    } 
    else{
        formContainer.style.display = 'block';
        toggleFormBtn.textContent = 'Zwiń formularz';
        titleInput.focus();
    }
    
    console.log(`Form ${isVisible ? 'hidden' : 'shown'}`);
}

function updateCharCount(input){
    const maxLength = input.getAttribute('maxlength');
    const currentLength = input.value.length;
    const counter = input.parentElement.querySelector('.char-count');
    
    if (counter && maxLength){
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9){
            counter.style.color = '#ef4444';
        } 
        else if (currentLength > maxLength * 0.7){
            counter.style.color = '#f59e0b';
        } 
        else{
            counter.style.color = '#9ca3af';
        }
    }
}

function getUserFacts(){
    const stored = localStorage.getItem('userFacts');
    return stored ? JSON.parse(stored) : [];
}

function saveUserFacts(facts){
    localStorage.setItem('userFacts', JSON.stringify(facts));
    console.log('Saved to localStorage:', facts.length, 'user facts');
}

function generateFactId(){
    const allUserFacts = getUserFacts();
    const maxId = Math.max(
        ...allFacts.map(f => f.id),
        ...allUserFacts.map(f => f.id),
        0
    );
    return maxId + 1;
}

function showFormMessage(message, type = 'success'){
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

async function init(){
    console.log('Initializing facts...');

    initTheme();

    allFacts = await fetchFacts();

    if(allFacts.length > 0){
        renderFacts(allFacts);

        const filterButtons = document.querySelector('.filter-buttons');
        if(filterButtons){
            filterButtons.addEventListener('click', handleFilterClick);
            console.log('Filter buttons initialized.');
        }

        if(searchInput){
            searchInput.addEventListener('input', handleSearchInput);
            console.log('Search input initialized.');
        }

        if(clearSearchBtn){
            clearSearchBtn.addEventListener('click', clearSearch);
            console.log('Clear search button initialized.');
        }

        if(themeToggle){
            themeToggle.addEventListener('click', toggleTheme);
            console.log('Theme toggle button initialized.');
        }

        if(toggleFormBtn){
            toggleFormBtn.addEventListener('click', toggleForm);
            console.log('Toggle form button initialized.');
        }
        
        if(cancelFormBtn){
            cancelFormBtn.addEventListener('click', toggleForm);
            console.log('Cancel form button initialized.');
        }
        
        if(titleInput){
            titleInput.addEventListener('input', () => updateCharCount(titleInput));
        }
        
        if(descriptionInput){
            descriptionInput.addEventListener('input', () => updateCharCount(descriptionInput));
        }
    }
    else{
        factsContainer.innerHTML += '<p style="color: red;">Nie udało się załadować ciekawostek.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);