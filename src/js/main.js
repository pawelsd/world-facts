const FACTS_DATA_URL = './data/facts.json';

const factsContainer = document.querySelector('.facts-container');

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
                <span class="fact-category">${fact.category}</span>
                <span class="fact-date">${fact.date}</span>
            </div>
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-description">${fact.description}</p>
            <div class="fact-footer">
                <button class="btn-read-more" data-id="${fact.id}">Czytaj więcej</button>
            </div>
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

const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const searchResultsInfo = document.querySelector('.search-results-info');

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

async function init(){
    console.log('Initializing facts...');

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
    }
    else{
        factsContainer.innerHTML += '<p style="color: red;">Nie udało się załadować ciekawostek.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);