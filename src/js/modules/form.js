/* Moduł obsługi formularza dodawania ciekawostek */
/* Zarządza walidacją, wysyłaniem i interakcjami z formularzem */

import { generateFactId } from './facts.js';
import { getUserFacts, saveUserFacts } from './storage.js';
import { showFormMessage, updateCharCount } from './render.js';

let formElements = {};
let onFactAddedCallback = null;

/* Inicjalizowanie modułu formularza */
/* @param {Object} elements - Obiekt z elementami DOM formularza */
/* @param {Function} onFactAdded - Callback wywoływany po dodaniu ciekawostki */
export function initForm(elements, onFactAdded){
    formElements = elements;
    onFactAddedCallback = onFactAdded;
    
    // Event listeners
    if(formElements.toggleBtn){
        formElements.toggleBtn.addEventListener('click', toggleForm);
    }
    
    if(formElements.cancelBtn){
        formElements.cancelBtn.addEventListener('click', toggleForm);
    }
    
    if(formElements.form){
        formElements.form.addEventListener('submit', handleFormSubmit);
    }
    
    // Liczniki znaków
    if(formElements.titleInput){
        formElements.titleInput.addEventListener('input', handleInputChange);
        updateCharCount(formElements.titleInput);
    }
    
    if(formElements.descriptionInput){
        formElements.descriptionInput.addEventListener('input', handleInputChange);
        updateCharCount(formElements.descriptionInput);
    }
    
    console.log('Form module initialized');
}

/* Przełączanoe widoczność formularza */
export function toggleForm(){
    const isVisible = formElements.container.style.display !== 'none';
    
    if(isVisible){
        formElements.container.style.display = 'none';
        formElements.toggleBtn.textContent = 'Dodaj swoją ciekawostkę';
    } 
    else{
        formElements.container.style.display = 'block';
        formElements.toggleBtn.textContent = 'Zwiń formularz';
        formElements.titleInput.focus();
    }
    
    console.log(`Form ${isVisible ? 'hidden' : 'shown'}`);
}

/* Obsługiwanie zmian w polach formularza */
/* @param {Event} event - Event input */
function handleInputChange(event){
    updateCharCount(event.target);
}

/* Walidowanie danych formularza */
/* @param {Object} formData - Dane z formularza */
/* @returns {Object} Obiekt z wynikiem walidacji */
export function validateFormData(formData){
    const errors = [];

    if(!formData.title || formData.title.trim().length < 5){
        errors.push('Tytuł musi mieć minimum 5 znaków');
    }
    if(formData.title.length > 100){
        errors.push('Tytuł nie może przekroczyć 100 znaków');
    }
    if(!formData.category){
        errors.push('Wybierz kategorię');
    }
    
    if(!formData.description || formData.description.trim().length < 20){
        errors.push('Opis musi mieć minimum 20 znaków');
    }
    if(formData.description.length > 500){
        errors.push('Opis nie może przekroczyć 500 znaków');
    }
    
    return{
        isValid: errors.length === 0,
        errors: errors
    };
}

/* Tworzenie obiektu ciekawostki z danych formularza */
/* @param {number} id - ID nowej ciekawostki */
/* @returns {Object} Obiekt ciekawostki */
function createFactFromForm(id){
    return{
        id: id,
        title: formElements.titleInput.value.trim(),
        category: formElements.categoryInput.value,
        description: formElements.descriptionInput.value.trim(),
        source: formElements.sourceInput.value.trim() || 'Użytkownik',
        date: new Date().toISOString().split('T')[0],
        userAdded: true
    };
}

/* Czyszczenie formularza */
function resetForm(){
    formElements.form.reset();
    updateCharCount(formElements.titleInput);
    updateCharCount(formElements.descriptionInput);
}

/* Obsługiwanie wysłania formularza */
/* @param {Event} event - Event submit */
async function handleFormSubmit(event){
    event.preventDefault();
    
    console.log('Form submitted');
    
    // Pobranie wszystkich ciekawostek aby wygenerować ID
    const allFacts = onFactAddedCallback ? onFactAddedCallback('getAllFacts') : [];
    const newId = generateFactId(allFacts);
    
    const formData = createFactFromForm(newId);
    
    console.log('Form data:', formData);
    
    // Walidacja
    const validation = validateFormData(formData);
    
    if(!validation.isValid){
        showFormMessage(
            formElements.messageElement, 
            validation.errors.join(', '), 
            'error'
        );
        console.error('Validation failed:', validation.errors);
        return;
    }
    
    // Zapisanie do localStorage
    const userFacts = getUserFacts();
    userFacts.push(formData);
    saveUserFacts(userFacts);
    
    // Wywołanie  callback z nową ciekawostką
    if (onFactAddedCallback){
        onFactAddedCallback('factAdded', formData);
    }
    
    // Komunikat sukcesu
    showFormMessage(
        formElements.messageElement,
        'Ciekawostka dodana pomyślnie!',
        'success'
    );
    
    // Resetowanie formularza
    resetForm();
    
    // Zamknięcie formularza po 2 sekundach
    setTimeout(() => {
        toggleForm();
    }, 2000);
    
    console.log('Fact added successfully!');
}

/* Pokazywanie błędu w formularzu */
/* @param {string} message - Treść błędu */
export function showFormError(message){
    showFormMessage(formElements.messageElement, message, 'error');
}

/* Pokazywanie sukcesu w formularzu */
/* @param {string} message - Treść komunikatu */
export function showFormSuccess(message){
    showFormMessage(formElements.messageElement, message, 'success');
}