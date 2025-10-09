const facts_data_url = './data/facts.json';

const factsContainer = document.querySelector('.facts-container');

async function fetchFacts() {
    try{
        const response = await fetch(facts_data_url);

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

    const existingCards = factsContainer.querySelectorAll('.fact-card');
    existingCards.forEach(card => card.remove());

    facts.forEach(fact => {
        const cardHTML = createFactCard(fact);
        factsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    console.log(`Rendered ${facts.length} facts.`);
}

async function init(){
    const facts = await fetchFacts();
    
    if (facts.length > 0) {
        renderFacts(facts);
    } 
    else{
        factsContainer.innerHTML += '<p style="color: red;">Nie udało się załadować ciekawostek.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);