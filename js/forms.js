/**
 * Form handling for Velox website
 * Manages form validation, submission, and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
});

/**
 * Initialize all forms
 */
function initializeForms() {
    initContactForms();
    initQuoteForm();
    initFormValidation();
}

/**
 * Contact form handling
 */
function initContactForms() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

/**
 * Quote form handling (global function for modal)
 */
window.handleQuote = function(event) {
    event.preventDefault();
    const form = event.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        try {
            // In a real application, you would send this to your backend
            console.log('Quote request:', data);
            
            // Show success message
            window.showToast('Quote request sent successfully! We\'ll get back to you within 24 hours.', 'success');
            
            // Close modal and reset form
            window.closeQuoteModal();
            
            // Optional: Send to analytics or CRM
            trackQuoteRequest(data);
            
        } catch (error) {
            console.error('Error submitting quote:', error);
            window.showToast('Sorry, there was an error sending your request. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }, 1500);
};

/**
 * Contact form submission
 */
async function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Simulate API call
        await simulateApiCall(data);
        
        // Show success message
        window.showToast('Message sent successfully! We\'ll respond within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        clearValidationErrors(form);
        
        // Track submission
        trackContactSubmission(data);
        
    } catch (error) {
        console.error('Error submitting contact form:', error);
        window.showToast('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

/**
 * Form validation
 */
function initFormValidation() {
    // Add real-time validation to all forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => validateField(input));
            
            // Clear errors on input
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    // Clear previous errors
    clearValidationErrors(form);
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Focus first invalid field
    if (!isValid) {
        const firstError = form.querySelector('.form-group--error input, .form-group--error textarea, .form-group--error select');
        if (firstError) {
            firstError.focus();
        }
    }
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    // Phone validation (if field name contains 'phone')
    else if (field.name && field.name.toLowerCase().includes('phone') && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    // Text length validation
    else if (value.length > 0) {
        if (field.tagName === 'TEXTAREA' && value.length < 10) {
            isValid = false;
            errorMessage = 'Please provide more details (minimum 10 characters).';
        } else if (field.tagName === 'INPUT' && fieldType === 'text' && value.length < 2) {
            isValid = false;
            errorMessage = 'This field must be at least 2 characters long.';
        }
    }
    
    // Update field UI
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        if (isValid) {
            formGroup.classList.remove('form-group--error');
            formGroup.classList.add('form-group--valid');
        } else {
            formGroup.classList.remove('form-group--valid');
            formGroup.classList.add('form-group--error');
            showFieldError(field, errorMessage);
        }
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error message
    let errorElement = formGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Add new error message
    errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Update field aria attributes
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorElement.id || 'error-' + field.name);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    formGroup.classList.remove('form-group--error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

/**
 * Clear all validation errors
 */
function clearValidationErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(element => element.remove());
    
    const errorGroups = form.querySelectorAll('.form-group--error');
    errorGroups.forEach(group => group.classList.remove('form-group--error'));
    
    const validGroups = form.querySelectorAll('.form-group--valid');
    validGroups.forEach(group => group.classList.remove('form-group--valid'));
    
    const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
    invalidFields.forEach(field => {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
}

/**
 * Simulate API call
 */
function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate occasional failure for testing
            if (Math.random() > 0.9) {
                reject(new Error('Network error'));
            } else {
                resolve({ success: true, message: 'Form submitted successfully' });
            }
        }, 1000 + Math.random() * 1000);
    });
}

/**
 * Analytics tracking
 */
function trackQuoteRequest(data) {
    // In a real application, send to analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quote_request', {
            event_category: 'engagement',
            event_label: data.product || 'general'
        });
    }
    
    console.log('Quote request tracked:', {
        type: 'quote_request',
        product: data.product,
        company: data.company,
        volume: data.volume
    });
}

function trackContactSubmission(data) {
    // In a real application, send to analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            event_category: 'engagement'
        });
    }
    
    console.log('Contact form tracked:', {
        type: 'contact_submission',
        subject: data.subject || 'general_inquiry'
    });
}

/**
 * Form autosave (for longer forms)
 */
function initFormAutosave() {
    const forms = document.querySelectorAll('form[data-autosave]');
    
    forms.forEach(form => {
        const formId = form.id || 'form-' + Math.random().toString(36).substr(2, 9);
        const storageKey = `velox-form-${formId}`;
        
        // Load saved data
        loadFormData(form, storageKey);
        
        // Save data on input
        form.addEventListener('input', debounce(() => {
            saveFormData(form, storageKey);
        }, 1000));
        
        // Clear saved data on successful submit
        form.addEventListener('submit', () => {
            setTimeout(() => {
                localStorage.removeItem(storageKey);
            }, 2000);
        });
    });
}

function saveFormData(form, storageKey) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
        console.warn('Could not save form data:', error);
    }
}

function loadFormData(form, storageKey) {
    try {
        const savedData = localStorage.getItem(storageKey);
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && data[key]) {
                field.value = data[key];
            }
        });
    } catch (error) {
        console.warn('Could not load form data:', error);
    }
}

/**
 * Utility function for debouncing
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize autosave if needed
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('form[data-autosave]')) {
        initFormAutosave();
    }
});

// CSS for form validation states
const formStyles = `
<style>
.form-group--error input,
.form-group--error textarea,
.form-group--error select {
    border-color: var(--color-error);
    background-color: rgba(239, 68, 68, 0.05);
}

.form-group--error input:focus,
.form-group--error textarea:focus,
.form-group--error select:focus {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group--valid input,
.form-group--valid textarea,
.form-group--valid select {
    border-color: var(--color-success);
}

.field-error {
    display: block;
    color: var(--color-error);
    font-size: 0.75rem;
    margin-top: var(--space-1);
    line-height: 1.4;
}

.form-group--error label {
    color: var(--color-error);
}
</style>
`;

// Inject form styles
if (!document.querySelector('#form-validation-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'form-validation-styles';
    styleElement.innerHTML = formStyles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);
}
