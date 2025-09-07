// Appointment Management System JavaScript

class AppointmentSystem {
    constructor() {
        this.facilities = this.loadData('facilities') || [];
        this.providers = this.loadData('providers') || [];
        this.timeSlots = this.loadData('timeSlots') || [];
        this.appointments = this.loadData('appointments') || [];
        this.currentEditingId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFacilities();
        this.loadProviders();
        this.loadTimeSlots();
        this.loadAppointments();
        this.setupTabNavigation();
    }

    setupEventListeners() {
        // Facility form
        document.getElementById('facilityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFacility();
        });

        // Provider form
        document.getElementById('providerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProvider();
        });

        // Time slot form
        document.getElementById('slotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTimeSlots();
        });

        // Appointment form
        document.getElementById('appointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.bookAppointment();
        });

        // Modal close on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    // Data Management
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        const container = document.querySelector('.main-content');
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Modal Management
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentEditingId = null;
        this.clearForm(modalId.replace('Modal', 'Form'));
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    // Facility Management
    openFacilityModal(editId = null) {
        this.currentEditingId = editId;
        this.populateFacilitySelects();
        
        if (editId) {
            const facility = this.facilities.find(f => f.id === editId);
            if (facility) {
                document.getElementById('facilityName').value = facility.name;
                document.getElementById('facilityAddress').value = facility.address;
                document.getElementById('facilityPhone').value = facility.phone;
                document.getElementById('facilityEmail').value = facility.email;
                document.getElementById('facilityCapacity').value = facility.capacity;
            }
        }
        
        this.openModal('facilityModal');
    }

    saveFacility() {
        const facilityData = {
            id: this.currentEditingId || this.generateId(),
            name: document.getElementById('facilityName').value,
            address: document.getElementById('facilityAddress').value,
            phone: document.getElementById('facilityPhone').value,
            email: document.getElementById('facilityEmail').value,
            capacity: parseInt(document.getElementById('facilityCapacity').value),
            createdAt: this.currentEditingId ? 
                this.facilities.find(f => f.id === this.currentEditingId).createdAt : 
                new Date().toISOString()
        };

        if (this.currentEditingId) {
            const index = this.facilities.findIndex(f => f.id === this.currentEditingId);
            this.facilities[index] = facilityData;
            this.showMessage('Facility updated successfully!', 'success');
        } else {
            this.facilities.push(facilityData);
            this.showMessage('Facility added successfully!', 'success');
        }

        this.saveData('facilities', this.facilities);
        this.loadFacilities();
        this.closeModal('facilityModal');
    }

    loadFacilities() {
        const grid = document.getElementById('facilitiesGrid');
        
        if (this.facilities.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-building"></i>
                    <h3>No Facilities Found</h3>
                    <p>Add your first facility to get started with the appointment system.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.facilities.map(facility => `
            <div class="facility-card">
                <div class="card-header">
                    <h3 class="card-title">${facility.name}</h3>
                    <div class="card-actions">
                        <button class="btn btn-secondary" onclick="appointmentSystem.openFacilityModal('${facility.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="appointmentSystem.deleteFacility('${facility.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="card-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${facility.address}</p>
                    <p><i class="fas fa-phone"></i> ${facility.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${facility.email}</p>
                    <p><i class="fas fa-users"></i> Capacity: ${facility.capacity} people</p>
                </div>
            </div>
        `).join('');
    }

    deleteFacility(id) {
        if (confirm('Are you sure you want to delete this facility?')) {
            this.facilities = this.facilities.filter(f => f.id !== id);
            this.providers = this.providers.filter(p => p.facilityId !== id);
            this.timeSlots = this.timeSlots.filter(s => s.facilityId !== id);
            this.appointments = this.appointments.filter(a => a.facilityId !== id);
            
            this.saveData('facilities', this.facilities);
            this.saveData('providers', this.providers);
            this.saveData('timeSlots', this.timeSlots);
            this.saveData('appointments', this.appointments);
            
            this.loadFacilities();
            this.loadProviders();
            this.loadTimeSlots();
            this.loadAppointments();
            this.showMessage('Facility deleted successfully!', 'success');
        }
    }

    // Provider Management
    openProviderModal(editId = null) {
        this.currentEditingId = editId;
        this.populateProviderSelects();
        
        if (editId) {
            const provider = this.providers.find(p => p.id === editId);
            if (provider) {
                document.getElementById('providerName').value = provider.name;
                document.getElementById('providerSpecialty').value = provider.specialty;
                document.getElementById('providerEmail').value = provider.email;
                document.getElementById('providerPhone').value = provider.phone;
                document.getElementById('providerFacility').value = provider.facilityId;
            }
        }
        
        this.openModal('providerModal');
    }

    saveProvider() {
        const providerData = {
            id: this.currentEditingId || this.generateId(),
            name: document.getElementById('providerName').value,
            specialty: document.getElementById('providerSpecialty').value,
            email: document.getElementById('providerEmail').value,
            phone: document.getElementById('providerPhone').value,
            facilityId: document.getElementById('providerFacility').value,
            createdAt: this.currentEditingId ? 
                this.providers.find(p => p.id === this.currentEditingId).createdAt : 
                new Date().toISOString()
        };

        if (this.currentEditingId) {
            const index = this.providers.findIndex(p => p.id === this.currentEditingId);
            this.providers[index] = providerData;
            this.showMessage('Provider updated successfully!', 'success');
        } else {
            this.providers.push(providerData);
            this.showMessage('Provider added successfully!', 'success');
        }

        this.saveData('providers', this.providers);
        this.loadProviders();
        this.closeModal('providerModal');
    }

    loadProviders() {
        const grid = document.getElementById('providersGrid');
        
        if (this.providers.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-md"></i>
                    <h3>No Providers Found</h3>
                    <p>Add your first provider to start creating appointment slots.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.providers.map(provider => {
            const facility = this.facilities.find(f => f.id === provider.facilityId);
            return `
                <div class="provider-card">
                    <div class="card-header">
                        <h3 class="card-title">${provider.name}</h3>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="appointmentSystem.openProviderModal('${provider.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger" onclick="appointmentSystem.deleteProvider('${provider.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="card-info">
                        <p><i class="fas fa-stethoscope"></i> ${provider.specialty}</p>
                        <p><i class="fas fa-building"></i> ${facility ? facility.name : 'No Facility'}</p>
                        <p><i class="fas fa-phone"></i> ${provider.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${provider.email}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteProvider(id) {
        if (confirm('Are you sure you want to delete this provider?')) {
            this.providers = this.providers.filter(p => p.id !== id);
            this.timeSlots = this.timeSlots.filter(s => s.providerId !== id);
            this.appointments = this.appointments.filter(a => a.providerId !== id);
            
            this.saveData('providers', this.providers);
            this.saveData('timeSlots', this.timeSlots);
            this.saveData('appointments', this.appointments);
            
            this.loadProviders();
            this.loadTimeSlots();
            this.loadAppointments();
            this.showMessage('Provider deleted successfully!', 'success');
        }
    }

    // Time Slot Management
    openSlotModal() {
        this.populateSlotSelects();
        this.openModal('slotModal');
    }

    createTimeSlots() {
        const facilityId = document.getElementById('slotFacility').value;
        const providerId = document.getElementById('slotProvider').value;
        const date = document.getElementById('slotDate').value;
        const startTime = document.getElementById('slotStartTime').value;
        const endTime = document.getElementById('slotEndTime').value;
        const duration = parseInt(document.getElementById('slotDuration').value);

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);

        if (startDateTime >= endDateTime) {
            this.showMessage('End time must be after start time!', 'error');
            return;
        }

        const slots = [];
        let currentTime = new Date(startDateTime);

        while (currentTime < endDateTime) {
            const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
            
            if (slotEndTime <= endDateTime) {
                slots.push({
                    id: this.generateId(),
                    facilityId: facilityId,
                    providerId: providerId,
                    date: date,
                    startTime: currentTime.toTimeString().slice(0, 5),
                    endTime: slotEndTime.toTimeString().slice(0, 5),
                    duration: duration,
                    isBooked: false,
                    appointmentId: null,
                    createdAt: new Date().toISOString()
                });
            }
            
            currentTime = slotEndTime;
        }

        this.timeSlots.push(...slots);
        this.saveData('timeSlots', this.timeSlots);
        this.loadTimeSlots();
        this.closeModal('slotModal');
        this.showMessage(`${slots.length} time slots created successfully!`, 'success');
    }

    loadTimeSlots() {
        const container = document.getElementById('slotsContainer');
        
        if (this.timeSlots.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <h3>No Time Slots Found</h3>
                    <p>Create time slots to allow patients to book appointments.</p>
                </div>
            `;
            return;
        }

        // Group slots by date and provider
        const groupedSlots = this.timeSlots.reduce((groups, slot) => {
            const key = `${slot.date}-${slot.providerId}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(slot);
            return groups;
        }, {});

        container.innerHTML = Object.entries(groupedSlots).map(([key, slots]) => {
            const provider = this.providers.find(p => p.id === slots[0].providerId);
            const facility = this.facilities.find(f => f.id === slots[0].facilityId);
            
            return `
                <div class="slot-group">
                    <h4>${provider ? provider.name : 'Unknown Provider'} - ${new Date(slots[0].date).toLocaleDateString()}</h4>
                    <p><i class="fas fa-building"></i> ${facility ? facility.name : 'Unknown Facility'}</p>
                    <div class="slots-grid">
                        ${slots.map(slot => `
                            <div class="slot-card">
                                <div class="slot-time">${slot.startTime} - ${slot.endTime}</div>
                                <div class="slot-details">
                                    <span class="slot-status ${slot.isBooked ? 'booked' : 'available'}">
                                        ${slot.isBooked ? 'Booked' : 'Available'}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Appointment Management
    openAppointmentModal() {
        this.populateAppointmentSelects();
        this.openModal('appointmentModal');
    }

    loadAvailableSlots() {
        const facilityId = document.getElementById('appointmentFacility').value;
        const providerId = document.getElementById('appointmentProvider').value;
        const date = document.getElementById('appointmentDate').value;

        if (!facilityId || !providerId || !date) {
            return;
        }

        const availableSlots = this.timeSlots.filter(slot => 
            slot.facilityId === facilityId &&
            slot.providerId === providerId &&
            slot.date === date &&
            !slot.isBooked
        );

        const slotSelect = document.getElementById('appointmentSlot');
        slotSelect.innerHTML = '<option value="">Select Time Slot</option>';
        
        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.id;
            option.textContent = `${slot.startTime} - ${slot.endTime}`;
            slotSelect.appendChild(option);
        });
    }

    bookAppointment() {
        const slotId = document.getElementById('appointmentSlot').value;
        const patientName = document.getElementById('patientName').value;
        const patientEmail = document.getElementById('patientEmail').value;
        const patientPhone = document.getElementById('patientPhone').value;
        const notes = document.getElementById('appointmentNotes').value;

        const slot = this.timeSlots.find(s => s.id === slotId);
        if (!slot) {
            this.showMessage('Please select a valid time slot!', 'error');
            return;
        }

        const appointment = {
            id: this.generateId(),
            slotId: slotId,
            facilityId: slot.facilityId,
            providerId: slot.providerId,
            patientName: patientName,
            patientEmail: patientEmail,
            patientPhone: patientPhone,
            notes: notes,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Mark slot as booked
        slot.isBooked = true;
        slot.appointmentId = appointment.id;

        this.appointments.push(appointment);
        this.saveData('appointments', this.appointments);
        this.saveData('timeSlots', this.timeSlots);
        
        this.loadAppointments();
        this.loadTimeSlots();
        this.closeModal('appointmentModal');
        this.showMessage('Appointment booked successfully!', 'success');
    }

    loadAppointments() {
        const container = document.getElementById('appointmentsContainer');
        
        if (this.appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No Appointments Found</h3>
                    <p>Book appointments to see them listed here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.appointments.map(appointment => {
            const slot = this.timeSlots.find(s => s.id === appointment.slotId);
            const provider = this.providers.find(p => p.id === appointment.providerId);
            const facility = this.facilities.find(f => f.id === appointment.facilityId);
            
            return `
                <div class="appointment-card">
                    <div class="appointment-header">
                        <div class="appointment-time">
                            ${slot ? `${slot.startTime} - ${slot.endTime}` : 'Time TBD'}
                        </div>
                        <span class="appointment-status ${appointment.status}">
                            ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                    </div>
                    <div class="appointment-details">
                        <p><strong>Patient:</strong> ${appointment.patientName}</p>
                        <p><strong>Provider:</strong> ${provider ? provider.name : 'Unknown'}</p>
                        <p><strong>Facility:</strong> ${facility ? facility.name : 'Unknown'}</p>
                        <p><strong>Date:</strong> ${slot ? new Date(slot.date).toLocaleDateString() : 'TBD'}</p>
                        <p><strong>Phone:</strong> ${appointment.patientPhone}</p>
                        <p><strong>Email:</strong> ${appointment.patientEmail}</p>
                        ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Helper Methods
    populateFacilitySelects() {
        const selects = ['providerFacility', 'slotFacility', 'appointmentFacility'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Facility</option>';
                this.facilities.forEach(facility => {
                    const option = document.createElement('option');
                    option.value = facility.id;
                    option.textContent = facility.name;
                    select.appendChild(option);
                });
            }
        });
    }

    populateProviderSelects() {
        const selects = ['slotProvider', 'appointmentProvider'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Provider</option>';
                this.providers.forEach(provider => {
                    const option = document.createElement('option');
                    option.value = provider.id;
                    option.textContent = `${provider.name} (${provider.specialty})`;
                    select.appendChild(option);
                });
            }
        });
    }

    populateSlotSelects() {
        this.populateFacilitySelects();
        this.populateProviderSelects();
    }

    populateAppointmentSelects() {
        this.populateFacilitySelects();
        this.populateProviderSelects();
    }
}

// Global functions for HTML onclick events
function openFacilityModal(editId = null) {
    appointmentSystem.openFacilityModal(editId);
}

function openProviderModal(editId = null) {
    appointmentSystem.openProviderModal(editId);
}

function openSlotModal() {
    appointmentSystem.openSlotModal();
}

function openAppointmentModal() {
    appointmentSystem.openAppointmentModal();
}

function closeModal(modalId) {
    appointmentSystem.closeModal(modalId);
}

function loadAvailableSlots() {
    appointmentSystem.loadAvailableSlots();
}

// Initialize the appointment system when the page loads
let appointmentSystem;
document.addEventListener('DOMContentLoaded', () => {
    appointmentSystem = new AppointmentSystem();
});