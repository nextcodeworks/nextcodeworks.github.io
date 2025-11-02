// Initialize Signature Pads
let clientSignaturePad;
let surveySignaturePad;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSignaturePads();
    setupEventListeners();
    loadSettings();
    setupConditionalFields();
    setupChemicalSearch();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('interventionDate').value = today;
    
    // Initialize protocol number
    initializeProtocolNumber();
});

// Initialize protocol number
function initializeProtocolNumber() {
    const protocolNumberInput = document.getElementById('protocolNumber');
    if (!protocolNumberInput) return;
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Get last used number from localStorage or start from 0
    const lastProtocol = localStorage.getItem('lastProtocolNumber');
    let nextNumber = 1;
    
    // If we have a previous protocol number, extract the number part and increment
    if (lastProtocol) {
        const parts = lastProtocol.split('_');
        if (parts.length === 2 && parts[0] === currentYear.toString()) {
            // If it's the same year, increment the number
            nextNumber = parseInt(parts[1]) + 1;
        } else {
            // If it's a new year, start from 1
            nextNumber = 1;
        }
    }
    
    // Store the new protocol number in localStorage
    const newProtocolNumber = `${currentYear}_${String(nextNumber).padStart(4, '0')}`;
    localStorage.setItem('lastProtocolNumber', newProtocolNumber);
    
    // Set the input value
    protocolNumberInput.value = newProtocolNumber;
}

// Initialize signature pads
function initializeSignaturePads() {
    const clientCanvas = document.getElementById('clientSignature');
    const surveyCanvas = document.getElementById('surveySignature');
    
    if (clientCanvas) {
        clientSignaturePad = new SignaturePad(clientCanvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(75, 83, 161)',
            minWidth: 1,
            maxWidth: 3
        });
    }
    
    if (surveyCanvas) {
        surveySignaturePad = new SignaturePad(surveyCanvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(75, 83, 161)',
            minWidth: 1,
            maxWidth: 3
        });
    }
    
    // Setup clear buttons
    const clearClientBtn = document.getElementById('clearClientSignature');
    const clearSurveyBtn = document.getElementById('clearSurveySignature');
    
    if (clearClientBtn) {
        clearClientBtn.addEventListener('click', () => {
            if (clientSignaturePad) {
                clientSignaturePad.clear();
            }
        });
    }
    
    if (clearSurveyBtn) {
        clearSurveyBtn.addEventListener('click', () => {
            if (surveySignaturePad) {
                surveySignaturePad.clear();
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // PDF Generation
    const generatePdfBtn = document.getElementById('generatePdf');
    const viewPdfBtn = document.getElementById('viewPdf');
    const sendEmailBtn = document.getElementById('sendEmail');
    const clearFormBtn = document.getElementById('clearForm');
    const settingsBtn = document.getElementById('settings');
    
    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', generatePdf);
    }
    
    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', viewPdf);
    }
    
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', sendEmail);
    }
    
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', clearForm);
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }
    
    // Modal controls
    setupModalControls();
    
    // Phone signature handling
    setupPhoneSignature();
}

// Setup phone signature functionality
function setupPhoneSignature() {
    const phoneSignatureCheckbox = document.getElementById('phoneSignature');
    const phoneSignatureContainer = document.getElementById('phoneSignatureContainer');
    const clientNameInput = document.getElementById('customer');
    const clientNameDisplay = document.getElementById('clientNameDisplay');
    const phoneSignatureDate = document.getElementById('phoneSignatureDate');
    
    if (phoneSignatureCheckbox && phoneSignatureContainer) {
        phoneSignatureCheckbox.addEventListener('change', function() {
            if (this.checked) {
                phoneSignatureContainer.classList.remove('hidden');
                // Update client name display
                if (clientNameDisplay && clientNameInput) {
                    clientNameDisplay.textContent = clientNameInput.value || 'Nezadáno';
                }
                // Update date
                if (phoneSignatureDate) {
                    const today = new Date();
                    phoneSignatureDate.textContent = today.toLocaleDateString('cs-CZ');
                }
            } else {
                phoneSignatureContainer.classList.add('hidden');
            }
        });
        
        // Update client name when it changes
        if (clientNameInput && clientNameDisplay) {
            clientNameInput.addEventListener('input', function() {
                if (phoneSignatureCheckbox.checked) {
                    clientNameDisplay.textContent = this.value || 'Nezadáno';
                }
            });
        }
    }
}

// Setup conditional fields
function setupConditionalFields() {
    // Other work type specification
    const otherWorkTypeCheckbox = document.getElementById('otherWorkType');
    const otherWorkTypeSpec = document.getElementById('otherWorkTypeSpec');
    const otherInterventionTypeRadio = document.getElementById('otherInterventionType');
    const otherInterventionTypeSpec = document.getElementById('otherInterventionTypeSpec');
    
    if (otherWorkTypeCheckbox && otherWorkTypeSpec) {
        otherWorkTypeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherWorkTypeSpec.classList.remove('hidden');
            } else {
                otherWorkTypeSpec.classList.add('hidden');
            }
        });
    }
    
    // Handle other intervention type specification
    if (otherInterventionTypeRadio && otherInterventionTypeSpec) {
        // Check all intervention type radios and show/hide other spec field
        document.querySelectorAll('input[name="interventionType"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'Jiný') {
                    otherInterventionTypeSpec.classList.remove('hidden');
                } else {
                    otherInterventionTypeSpec.classList.add('hidden');
                }
            });
        });
    }
    
    // Handle pest infestation levels
    const noPestsCheckbox = document.getElementById('noPestsCheckbox');
    const pestInfestationContainer = document.getElementById('pestInfestationContainer');
    const addPestBtn = document.getElementById('addPestBtn');
    const pestTemplate = document.getElementById('pestInfestationTemplate');
    
    if (noPestsCheckbox && pestInfestationContainer && addPestBtn && pestTemplate) {
        // Toggle pest infestation container based on noPests checkbox
        const togglePestContainer = () => {
            const isDisabled = noPestsCheckbox.checked;
            pestInfestationContainer.style.opacity = isDisabled ? '0.5' : '1';
            pestInfestationContainer.style.pointerEvents = isDisabled ? 'none' : 'all';
            addPestBtn.disabled = isDisabled;
            
            // Clear all pests when "No pests" is checked
            if (isDisabled) {
                pestInfestationContainer.innerHTML = '';
            } else if (pestInfestationContainer.children.length === 0) {
                // Add one empty pest by default when enabling
                addPestItem();
            }
        };
        
        // Add new pest item
        const addPestItem = () => {
            const clone = pestTemplate.content.cloneNode(true);
            
            // Initialize infestation level select
            const removeBtn = clone.querySelector('.remove-pest-btn');
            
            // Add remove button functionality
            removeBtn.addEventListener('click', () => {
                const pestItem = removeBtn.closest('.pest-item');
                if (pestItem) {
                    pestItem.remove();
                }
            });
            
            // Add the new pest item to the container
            pestInfestationContainer.appendChild(clone);
        };
        
        // Initialize
        noPestsCheckbox.addEventListener('change', togglePestContainer);
        addPestBtn.addEventListener('click', addPestItem);
        
        // Add first pest by default if noPests is not checked
        if (!noPestsCheckbox.checked) {
            addPestItem();
        } else {
            togglePestContainer();
        }
    }
    
    // Other pests specification
    const otherPestsCheckbox = document.getElementById('otherPests');
    const otherPestsSpec = document.getElementById('otherPestsSpec');
    
    if (otherPestsCheckbox && otherPestsSpec) {
        otherPestsCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherPestsSpec.classList.remove('hidden');
            } else {
                otherPestsSpec.classList.add('hidden');
            }
        });
    }
    
    // Other recommendation specification
    const otherRecommendationCheckbox = document.getElementById('otherRecommendation');
    const otherRecommendationSpec = document.getElementById('otherRecommendationSpec');
    
    if (otherRecommendationCheckbox && otherRecommendationSpec) {
        otherRecommendationCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherRecommendationSpec.classList.remove('hidden');
            } else {
                otherRecommendationSpec.classList.add('hidden');
            }
        });
    }
    
    // Other safety specification
    const otherSafetyCheckbox = document.getElementById('otherSafety');
    const otherSafetySpec = document.getElementById('otherSafetySpec');
    
    if (otherSafetyCheckbox && otherSafetySpec) {
        otherSafetyCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherSafetySpec.classList.remove('hidden');
            } else {
                otherSafetySpec.classList.add('hidden');
            }
        });
    }
}

// Setup modal controls
function setupModalControls() {
    // PDF Preview Modal
    const pdfPreviewModal = document.getElementById('pdfPreviewModal');
    const closePdfPreview = document.getElementById('closePreview');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    
    if (closePdfPreview) {
        closePdfPreview.addEventListener('click', () => {
            pdfPreviewModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', downloadPdf);
    }
    
    // Settings Modal
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const settingsForm = document.getElementById('settingsForm');
    
    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveSettings);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Generate PDF - Opens in new tab with print dialog
async function generatePdf() {
    if (!validateForm()) {
        alert('Vyplňte prosím všechna povinná pole.');
        return;
    }

    try {
        const formData = collectFormData();
        
        // Get the preview content directly from the preview modal
        let pdfContent = '';
        const pdfPreview = document.getElementById('pdfPreview');
        if (pdfPreview && pdfPreview.innerHTML) {
            // Clone the preview content
            const previewClone = pdfPreview.cloneNode(true);
            
            // Remove any existing print buttons or controls
            const printButtons = previewClone.querySelectorAll('button, .no-print');
            printButtons.forEach(btn => btn.remove());
            
            pdfContent = previewClone.innerHTML;
        } else {
            // Fallback to generating content if preview not available
            pdfContent = generatePdfContent(formData);
        }
        
        // Create a new window for the PDF
        const printWindow = window.open('', '_blank');
        
        // Write the content to the new window
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Protokol ${formData.protocolNumber || ''}</title>
                <meta charset="UTF-8">
                <style>
                    @page { 
                        size: A4;
                    }
                    
                    body { 
                        font-family: Arial, sans-serif;
                        font-size: 10px;
                        line-height: 1.2;
                        color: #000;
                        margin: 0;
                        padding: 0;
                        background: white;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Ensure colors are printed */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Force background colors */
                    .section h3 {
                        background: #2c5282 !important;
                        color: white !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    
                    .supplier-info {
                        background: #f7fafc !important;
                        border-left: 3px solid #2c5282 !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    
                    .recommendations {
                        background: #f0f9ff !important;
                        border-left: 3px solid #3182ce !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                </style>
                <script>
                    // Auto-print and close after printing
                    window.onload = function() {
                        // Ensure all images are loaded
                        const images = document.getElementsByTagName('img');
                        let loadedImages = 0;
                        const totalImages = images.length;
                        
                        if (totalImages === 0) {
                            startPrint();
                            return;
                        }
                        
                        const imageLoadHandler = function() {
                            loadedImages++;
                            if (loadedImages >= totalImages) {
                                startPrint();
                            }
                        };
                        
                        Array.from(images).forEach(img => {
                            if (img.complete) {
                                loadedImages++;
                                if (loadedImages >= totalImages) {
                                    startPrint();
                                }
                            } else {
                                img.addEventListener('load', imageLoadHandler);
                                img.addEventListener('error', imageLoadHandler);
                            }
                        });
                    };
                    
                    function startPrint() {
                        // Small delay to ensure all content is rendered
                        setTimeout(() => {
                            // Force print dialog
                            window.print();
                            
                            // Close after print or after timeout
                            setTimeout(() => {
                                window.close();
                            }, 1000);
                        }, 500);
                    }
                    
                    // Close the window if user cancels print
                    window.onafterprint = function() {
                        setTimeout(() => window.close(), 100);
                    };
                </script>
            </head>
            <body style="margin: 0 auto; width: 100%; max-width: 190mm;">
                ${pdfContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
    } catch (error) {
        console.error('Chyba při generování PDF:', error);
        showError('Nepodařilo se otevřít tiskové rozhraní: ' + (error.message || error));
    }
}

// View PDF - FIXED to show proper preview
function viewPdf() {
    if (!validateForm()) {
        alert('Vyplňte prosím všechna povinná pole.');
        return;
    }
    
    try {
        const formData = collectFormData();
        const pdfContent = generatePdfContent(formData);
        
        // Parse the PDF content to extract body innerHTML and wrap in isolated container
        const parser = new DOMParser();
        const doc = parser.parseFromString(pdfContent, 'text/html');
        const bodyContent = doc.body.innerHTML;
        const styles = doc.head.innerHTML;
        
        const pdfPreview = document.getElementById('pdfPreview');
        if (pdfPreview) {
            pdfPreview.innerHTML = `<div class="pdf-preview-content"><style>${styles}</style>${bodyContent}</div>`;
        }
        
        const modal = document.getElementById('pdfPreviewModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        }
        
    } catch (error) {
        console.error('Error generating PDF preview:', error);
        showError('Chyba při generování náhledu PDF: ' + error.message);
    }
}

// Download PDF from preview
function downloadPdf() {
    generatePdf();
}

// Send Email
function sendEmail() {
    if (!validateForm()) {
        alert('Vyplňte prosím všechna povinná pole.');
        return;
    }
    
    try {
        const formData = collectFormData();
        
        // Create HTML email content
        const subject = `Protokol č. ${formData.protocolNumber} - ${formData.companyName}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #4b53a1; padding: 20px; color: white; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Dobrý den,</h1>
                </div>
                
                <div style="padding: 20px; background-color: #f9f9f9;">
                    <p>v příloze naleznete protokol o provedeném ošetření.</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #eef2ff; border-left: 4px solid #4b53a1;">
                        <p style="margin: 5px 0;"><strong>Číslo protokolu:</strong> ${formData.protocolNumber}</p>
                        <p style="margin: 5px 0;"><strong>Společnost:</strong> ${formData.companyName}</p>
                        <p style="margin: 5px 0;"><strong>Datum zásahu:</strong> ${formData.interventionDate}</p>
                    </div>
                    
                    <p>V případě jakýchkoli dotazů nás neváhejte kontaktovat.</p>
                    
                    <p>S pozdravem,<br>${formData.companyName}</p>
                </div>
                
                <div style="text-align: center; padding: 15px; background-color: #f0f0f0; font-size: 12px; color: #666;">
                    <p>Tento email byl vygenerován automaticky, prosím neodpovídejte na něj.</p>
                </div>
            </div>
        `;
        
        // Create mailto link with HTML content
        const emailBody = encodeURIComponent(htmlContent);
        const mailtoLink = `mailto:${formData.clientEmail}?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
    } catch (error) {
        console.error('Chyba při přípravě e-mailu:', error);
        showError('Chyba při přípravě e-mailu: ' + error.message);
    }
}

// Clear form
function clearForm() {
    if (confirm('Opravdu chcete vyčistit celý formulář? Všechna data budou ztracena.')) {
        document.getElementById('protocolForm').reset();
        
        // Clear signature pads
        if (clientSignaturePad) clientSignaturePad.clear();
        if (surveySignaturePad) surveySignaturePad.clear();
        
        // Hide conditional fields
        const conditionalFields = document.querySelectorAll('.hidden');
        conditionalFields.forEach(field => {
            if (field.id.includes('Spec')) {
                field.classList.add('hidden');
            }
        });
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('interventionDate').value = today;
        
        showSuccess('Formulář byl vyčištěn.');
    }
}

// Open settings
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Save settings
function saveSettings(event) {
    event.preventDefault();
    
    const emailServiceId = document.getElementById('emailServiceId').value;
    const emailTemplateId = document.getElementById('emailTemplateId').value;
    const emailPublicKey = document.getElementById('emailPublicKey').value;
    
    localStorage.setItem('emailServiceId', emailServiceId);
    localStorage.setItem('emailTemplateId', emailTemplateId);
    localStorage.setItem('emailPublicKey', emailPublicKey);
    
    showSuccess('Nastavení bylo uloženo.');
    
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Load settings
function loadSettings() {
    const emailServiceId = localStorage.getItem('emailServiceId');
    const emailTemplateId = localStorage.getItem('emailTemplateId');
    const emailPublicKey = localStorage.getItem('emailPublicKey');
    
    if (emailServiceId) document.getElementById('emailServiceId').value = emailServiceId;
    if (emailTemplateId) document.getElementById('emailTemplateId').value = emailTemplateId;
    if (emailPublicKey) document.getElementById('emailPublicKey').value = emailPublicKey;
}

// Validate form
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    return true;
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('protocolForm');
    const formData = new FormData(form);
    const data = {};
    
    // Get all form elements including checkboxes
    const formElements = form.elements;
    
    // Process all form elements
    for (let element of formElements) {
        const name = element.name;
        if (!name) continue;
        
        if (element.type === 'checkbox') {
            // Handle checkboxes - only collect checked ones
            if (element.checked) {
                if (!data[name]) {
                    data[name] = [];
                }
                data[name].push(element.value);
            }
        } else if (element.type === 'radio') {
            // Handle radio buttons - only collect checked ones
            if (element.checked) {
                data[name] = element.value;
            }
        } else if (element.type !== 'submit' && element.type !== 'button') {
            // Handle all other input types except submit/button
            const value = element.value;
            if (data[name]) {
                if (Array.isArray(data[name])) {
                    data[name].push(value);
                } else {
                    data[name] = [data[name], value];
                }
            } else {
                data[name] = value;
            }
        }
    }
    
    // Add signature data
    if (clientSignaturePad && !clientSignaturePad.isEmpty()) {
        data.clientSignatureData = clientSignaturePad.toDataURL();
    }
    
    if (surveySignaturePad && !surveySignaturePad.isEmpty()) {
        data.surveySignatureData = surveySignaturePad.toDataURL();
    }
    
    // Add phone signature info
    const phoneSignature = document.getElementById('phoneSignature');
    if (phoneSignature && phoneSignature.checked) {
        data.phoneSignature = true;
        data.phoneSignatureDate = new Date().toLocaleDateString('cs-CZ');
    }
    
    // Collect chemical quantities
    const chemicals = [];
    document.querySelectorAll('.chemical-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
        const parent = checkbox.closest('.chemical-checkbox');
        if (!parent) return;
        
        const name = checkbox.value;
        const quantityInput = parent.querySelector('.quantity-input');
        const quantity = quantityInput ? quantityInput.value.trim() : '';
        
        chemicals.push({
            name: name,
            quantity: quantity
        });
    });
    
    if (chemicals.length > 0) {
        data.chemicals = chemicals;
    }
    
    // Collect pest infestation data
    const noPests = document.getElementById('noPestsCheckbox')?.checked || false;
    data.noPests = noPests;
    
    if (!noPests) {
        const pestItems = document.querySelectorAll('.pest-item');
        const pestInfestations = [];
        
        pestItems.forEach(item => {
            const pestName = item.querySelector('.pest-name')?.value.trim();
            const level = item.querySelector('.infestation-level')?.value;
            
            if (pestName) {
                pestInfestations.push({
                    pest: pestName,
                    level: level || 'Neznámý'
                });
            }
        });
        
        if (pestInfestations.length > 0) {
            data.pestInfestations = pestInfestations;
        }
    }
    
    return data;
}

// Generate PDF content - FIXED for one-page layout
function generatePdfContent(data) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('cs-CZ');
    };
    
    const formatArray = (array) => {
        if (!array) return '';
        if (Array.isArray(array)) {
            return array.join(', ');
        }
        return array;
    };
    
    const formatCheckboxList = (array) => {
        if (!array) return '';
        if (Array.isArray(array)) {
            return array.map(item => `<div style="margin: 2px 0; padding-left: 15px; position: relative;">• ${item}</div>`).join('');
        }
        return `<div style="margin: 2px 0; padding-left: 15px; position: relative;">• ${array}</div>`;
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    font-size: 10px;
                    line-height: 1.2;
                    color: #000;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                    background: white;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #333;
                }
                .header h1 { 
                    font-size: 16px; 
                    margin: 0 0 4px 0;
                    color: #2c5282;
                    font-weight: bold;
                }
                .header h2 { 
                    font-size: 12px; 
                    margin: 0 0 6px 0;
                    color: #4a5568;
                    font-weight: normal;
                }
                .section { 
                    margin-bottom: 8px;
                    page-break-inside: avoid;
                }
                .section h3 { 
                    background: #2c5282; 
                    color: white; 
                    padding: 4px 8px; 
                    margin: 0 0 6px 0;
                    font-size: 10px;
                    font-weight: bold;
                    border-radius: 2px;
                }
                .two-columns {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 8px;
                }
                .column {
                    flex: 1;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                    font-size: 9px;
                }
                .info-item {
                    margin-bottom: 4px;
                }
                .info-label {
                    font-weight: bold;
                    color: #4a5568;
                    font-size: 9px;
                }
                .signature-section {
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px solid #ccc;
                }
                .signature-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 8px;
                }
                .signature-box {
                    text-align: center;
                    flex: 1;
                    margin: 0 5px;
                    min-height: 60px;
                }
                .signature-line {
                    border-top: 1px solid #2c5282 !important;
                    border-color: #2c5282 !important;
                    margin: 5px 0 3px 0;
                    padding-top: 3px;
                    height: 8px;
                }
                .signature-img {
                    max-width: 120px;
                    max-height: 40px;
                    object-fit: contain;
                    margin: 5px auto;
                    display: block;
                }
                .supplier-info {
                    background: #f7fafc;
                    padding: 10px;
                    border-radius: 4px;
                    border-left: 3px solid #2c5282;
                    margin-top: 10px;
                    font-size: 8px;
                    text-align: center;
                }
                .compact-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                }
                .compact-table tr {
                    border-bottom: 1px solid #eee;
                }
                .compact-table td {
                    padding: 2px 4px;
                    vertical-align: top;
                }
                .compact-table tr td:first-child {
                    width: 40%;
                    font-weight: bold;
                }
                .checkbox-list {
                    margin: 4px 0;
                    font-size: 9px;
                }
                .recommendations {
                    background: #f0f9ff;
                    padding: 6px;
                    border-radius: 3px;
                    border-left: 3px solid #3182ce;
                    font-size: 9px;
                    margin-top: 4px;
                }
                @media print {
                    body { 
                        margin: 0 auto;
                        padding: 10mm;
                        width: 190mm;
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>PROTOKOL O PROVEDENÉ DERATIZACI A DEZINSEKCI</h1>
                <h2>Deratem - Profesionální služby DDD</h2>
                <div style="font-size: 9px;">
                    <strong>Číslo protokolu:</strong> ${data.protocolNumber || ''} | 
                    <strong>Místo zásahu:</strong> ${data.interventionPlace || ''} | 
                    <strong>Datum zásahu:</strong> ${formatDate(data.interventionDate) || ''}
                </div>
            </div>

            <!-- Odběratel a kontakt -->
            <div class="two-columns">
                <div class="column">
                    <div class="section">
                        <h3>ODBĚRATEL</h3>
                        <table class="compact-table">
                            <tr><td>Jméno/Název společnosti:</td><td>${data.customer || ''}</td></tr>
                            <tr><td>IČO:</td><td>${data.ico || 'neuvedeno'}</td></tr>
                            <tr><td>Adresa/Sídlo:</td><td>${data.address || ''}</td></tr>
                        </table>
                    </div>
                </div>
                <div class="column">
                    <div class="section">
                        <h3>KONTAKT</h3>
                        <table class="compact-table">
                            <tr><td>Kontaktní osoba:</td><td>${data.clientName || ''}</td></tr>
                            <tr><td>Telefon:</td><td>${data.clientPhone || ''}</td></tr>
                            <tr><td>E-mail:</td><td>${data.clientEmail || ''}</td></tr>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Detaily zásahu -->
            <div class="two-columns">
                <div class="column">
                    <div class="section">
                        <h3>DETAILY ZÁSAHU</h3>
                        <table class="compact-table">
                            <tr><td>Typ zásahu:</td><td>${data.interventionType === 'Jiný' ? (data.otherInterventionTypeSpec || '') : (data.interventionType || '')}</td></tr>
                            <tr><td>Druh práce:</td><td>${formatArray(data.workType)} ${data.otherWorkTypeSpec || ''}</td></tr>
                            <tr><td>Zjištění škůdci:</td><td>${formatArray(data.pests)} ${data.otherPestsSpec || ''}</td></tr>
                            <tr>
                                <td>Stupeň zamoření:</td>
                                <td>
                                    ${data.noPests 
                                        ? 'Žádný výskyt škůdců'
                                        : (data.pestInfestations && data.pestInfestations.length > 0 
                                            ? data.pestInfestations.map(p => `${p.pest} - ${p.level}`).join('<br>')
                                            : 'Nezadáno'
                                        )}
                                </td>
                            </tr>
                            <tr><td>Nutnost dalšího zásahu:</td><td>${data.furtherIntervention || ''}</td></tr>
                            <tr><td>Po dohodě s odběratelem použit biocid:</td><td>${data.biocideAgreement || ''}</td></tr>
                            <tr><td>Po dohodě s odběratelem byla ponechána nástraha v deratizačních staničkách:</td><td>${data.baitLeftInStations || ''}</td></tr>
                        </table>
                    </div>
                </div>
                <div class="column">
                    <div class="section">
                        <h3>PŘÍPRAVKY A MNOŽSTVÍ</h3>
                        <table class="compact-table">
                            ${data.chemicals && data.chemicals.length > 0 
                                ? data.chemicals.map(chem => 
                                    `<tr>
                                        <td>${chem.name}</td>
                                        <td>${chem.quantity || ''}</td>
                                    </tr>`
                                ).join('')
                                : '<tr><td colspan="2">Žádné přípravky nebyly vybrány</td></tr>'
                            }
                        </table>
                    </div>
                </div>
            </div>

            <!-- Doporučení a bezpečnost -->
            <div class="two-columns">
                <div class="column">
                    <div class="section">
                        <h3>DOPORUČENÍ</h3>
                        <div class="checkbox-list">
                            ${formatCheckboxList(data.recommendedActions)}
                            ${data.otherRecommendationSpec ? `<div style="margin: 2px 0; padding-left: 15px;">• ${data.otherRecommendationSpec}</div>` : ''}
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="section">
                        <h3>BEZPEČNOST</h3>
                        <div class="checkbox-list">
                            ${formatCheckboxList(data.safetyMeasures)}
                            ${data.otherSafetySpec ? `<div style="margin: 2px 0; padding-left: 15px;">• ${data.otherSafetySpec}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Poučení pro odběratele -->
            <div class="section">
                <h3>POUČENÍ PRO ODBĚRATELE</h3>
                <div class="recommendations">
                    Odběratel potvrzuje, že výše uvedené práce byly řádně provedeny a že byl poučen o možném nebezpečí plynoucím z provedených prací včetně následků zneužití nebo znehodnocení použitých přípravků. Poučení zahrnuje rovněž bezpečnostní opatření po ukončení práce. Při likvidaci škůdce vyžadující dva zásahy poskytujeme záruku až po 2. zásahu. Záruku poskytujeme pouze v případě dodržení všech našich pokynů.
                </div>
            </div>

            <!-- Podpisy -->
            <div class="signature-section">
                <div class="signature-container">
                    <!-- Podpis klienta -->
                    <div class="signature-box">
                        <div style="margin-bottom: 4px; font-weight: bold; font-size: 9px;">
                            Podpis klienta
                        </div>
                        ${data.phoneSignature ? `
                            <div style="text-align: center; font-style: italic; font-size: 8px; margin: 5px 0 10px;">
                                Souhlas po telefonu<br>
                                ${data.clientName || ''}<br>
                                ${data.phoneSignatureDate || ''}
                            </div>
                        ` : (data.clientSignatureData ? `
                            <img src="${data.clientSignatureData}" class="signature-img" style="background: transparent; margin: 5px auto 10px; display: block;">
                        ` : `
                            <div style="height: 40px; margin: 5px 0 10px;"></div>
                        `)}
                        <div class="signature-line"></div>
                        <div style="margin-top: 2px; font-size: 8px;">
                            ${data.clientName || 'Jméno klienta'}
                        </div>
                    </div>

                    <!-- Průzkum proveden za účasti -->
                    ${data.surveyName ? `
                    <div class="signature-box">
                        <div style="margin-bottom: 4px; font-weight: bold; font-size: 9px;">
                            Průzkum za účasti
                        </div>
                        ${data.surveySignatureData ? `
                            <img src="${data.surveySignatureData}" class="signature-img" style="background: transparent; margin: 5px auto 10px; display: block;">
                        ` : `
                            <div style="height: 40px; margin: 5px 0 10px;"></div>
                        `}
                        <div class="signature-line"></div>
                        <div style="margin-top: 2px; font-size: 8px;">
                            ${data.surveyName || 'Jméno'}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Podpis technika -->
                    <div class="signature-box">
                        <div style="margin-bottom: 4px; font-weight: bold; font-size: 9px;">
                            Podpis technika
                        </div>
                        <img src="podpis.png" class="signature-img" style="background: transparent; margin: 5px auto 10px; display: block;">
                        <div class="signature-line" style="margin-top: 5px;"></div>
                        <div style="margin-top: 2px; font-size: 8px;">
                            Tomáš Šmídek
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dodavatel -->
            <div class="supplier-info">
                <div style="text-align: center; font-weight: bold; margin-bottom: 6px; font-size: 10px;">DODAVATEL</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 8px; text-align: center;">
                    <div style="border-right: 1px solid #2c5282; padding-right: 8px;">
                        <strong>Tomáš Šmídek – Deratem</strong><br>
                        Štětínská 375/14, Praha 8<br>
                        IČO: 18633617
                    </div>
                    <div style="padding-left: 8px;">
                        Č. účtu: 1312513790297/0100<br>
                        Tel.: 777 333 164<br>
                        E-mail: info@deratem.cz
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Utility functions
function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.insertBefore(messageDiv, formContainer.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Setup chemical search and quantity functionality
function setupChemicalSearch() {
    const searchInput = document.getElementById('chemicalSearch');
    if (!searchInput) return;

    // Normalize text by removing diacritics and converting to lowercase
    const normalizeText = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    // Handle search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = normalizeText(e.target.value).trim();
        const chemicalItems = document.querySelectorAll('.chemical-item');
        
        chemicalItems.forEach(item => {
            const itemText = item.textContent;
            const normalizedText = normalizeText(itemText);
            
            // Show all items if search is empty
            if (searchTerm === '') {
                item.style.display = 'flex';
                return;
            }
            
            // Check if the search term appears consecutively in the text
            const regex = new RegExp(searchTerm.split('').join('.*?'), 'i');
            const isMatch = regex.test(normalizedText);
            
            item.style.display = isMatch ? 'flex' : 'none';
        });
    });

    // Handle checkbox changes to show/hide quantity inputs
    document.querySelectorAll('.chemical-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const parent = this.closest('.chemical-checkbox');
            if (!parent) return;
            
            const quantityInput = parent.querySelector('.quantity-input');
            if (quantityInput) {
                quantityInput.style.display = this.checked ? 'block' : 'none';
                if (!this.checked) {
                    quantityInput.value = ''; // Clear quantity when unchecked
                }
            }
        });
    });
}

// Helper function to get chemical quantities
    function getChemicalQuantities() {
        const chemicals = [];
        document.querySelectorAll('.chemical-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
            const parent = checkbox.closest('.chemical-checkbox');
            const name = checkbox.value;
            const quantityInput = parent ? parent.querySelector('.quantity-input') : null;
            let quantity = '';
            
            // Only include quantity if it's not empty and not the default placeholder
            if (quantityInput && quantityInput.value.trim() && quantityInput.value.trim() !== 'Množství') {
                quantity = quantityInput.value.trim().split(' ')[0];
            }
            
            chemicals.push({
                name: name,
                quantity: quantity
            });
        });
        return chemicals;
    }

// Make functions available globally
window.generatePdf = generatePdf;
window.viewPdf = viewPdf;
window.sendEmail = sendEmail;
window.openSettings = openSettings;
