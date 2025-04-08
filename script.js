// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // Service Record Form
    const serviceRecordForm = document.getElementById('service-record-form');
    const serviceRecordBody = document.getElementById('service-record-body');
    
    // Load records from localStorage
    loadServiceRecords();
    
    serviceRecordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('service-date').value;
        const vehicle = document.getElementById('service-vehicle').value;
        const mileage = document.getElementById('service-mileage').value;
        const servicePerformed = document.getElementById('service-performed').value;
        const nextService = document.getElementById('next-service').value;
        
        addServiceRecord(date, vehicle, mileage, servicePerformed, nextService);
        
        // Reset form
        serviceRecordForm.reset();
    });
    
    // Function to add a service record
    function addServiceRecord(date, vehicle, mileage, servicePerformed, nextService) {
        // Create record object
        const record = {
            id: Date.now(),
            date: date,
            vehicle: vehicle,
            mileage: mileage,
            servicePerformed: servicePerformed,
            nextService: nextService
        };
        
        // Add to localStorage
        let records = getServiceRecords();
        records.push(record);
        localStorage.setItem('serviceRecords', JSON.stringify(records));
        
        // Add to table
        displayServiceRecord(record);
    }
    
    // Function to display a service record in the table
    function displayServiceRecord(record) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', record.id);
        
        row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${record.vehicle}</td>
            <td>${record.mileage}</td>
            <td>${record.servicePerformed}</td>
            <td>${record.nextService}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-record" data-id="${record.id}">Delete</button>
            </td>
        `;
        
        serviceRecordBody.appendChild(row);
        
        // Add event listener to delete button
        const deleteButton = row.querySelector('.delete-record');
        deleteButton.addEventListener('click', function() {
            deleteServiceRecord(this.getAttribute('data-id'));
        });
    }
    
    // Function to delete a service record
    function deleteServiceRecord(id) {
        // Remove from localStorage
        let records = getServiceRecords();
        records = records.filter(record => record.id != id);
        localStorage.setItem('serviceRecords', JSON.stringify(records));
        
        // Remove from table
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
    }
    
    // Function to get service records from localStorage
    function getServiceRecords() {
        const records = localStorage.getItem('serviceRecords');
        return records ? JSON.parse(records) : [];
    }
    
    // Function to load service records from localStorage
    function loadServiceRecords() {
        const records = getServiceRecords();
        records.forEach(record => {
            displayServiceRecord(record);
        });
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Print functionality
    const printButton = document.createElement('button');
    printButton.classList.add('btn');
    printButton.style.position = 'fixed';
    printButton.style.bottom = '20px';
    printButton.style.right = '20px';
    printButton.style.zIndex = '99';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Checklist';
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
});
