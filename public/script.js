const API_URL = 'http://localhost:3000/api/park-info';

const editBtn = document.getElementById('editBtn');
const cancelBtn = document.getElementById('cancelBtn');
const parkForm = document.getElementById('parkForm');
const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');

let currentData = {};

async function loadParkInfo() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        currentData = data;
        displayParkInfo(data);
    } catch (error) {
        console.error('Error loading park info:', error);
    }
}

function displayParkInfo(data) {
    document.getElementById('viewParkName').textContent = data.park_name || '-';
    document.getElementById('viewParkAddress').textContent = data.park_address || '-';
    document.getElementById('viewLotRent').textContent = data.lot_rent ? `$${data.lot_rent}` : '-';
    
    document.getElementById('viewWater').classList.toggle('active', data.water_included === 1);
    document.getElementById('viewTrash').classList.toggle('active', data.trash_included === 1);
    document.getElementById('viewSewer').classList.toggle('active', data.sewer_included === 1);
    document.getElementById('viewElectric').classList.toggle('active', data.electric_included === 1);
    
    document.getElementById('viewManagerName').textContent = data.manager_name || '-';
    document.getElementById('viewManagerPhone').textContent = data.manager_phone || '-';
    document.getElementById('viewManagerAddress').textContent = data.manager_address || '-';
    
    document.getElementById('viewCommunityEmail').textContent = data.community_email || '-';
    document.getElementById('viewOfficeHours').textContent = data.office_hours || '-';
    document.getElementById('viewEmergencyContact').textContent = data.emergency_contact || '-';
    
    document.getElementById('viewNotes').textContent = data.notes || '-';
    
    if (data.last_updated) {
        const date = new Date(data.last_updated);
        document.getElementById('lastUpdated').textContent = date.toLocaleString();
    }
}

function populateForm(data) {
    document.getElementById('parkName').value = data.park_name || '';
    document.getElementById('parkAddress').value = data.park_address || '';
    document.getElementById('lotRent').value = data.lot_rent || '';
    
    document.getElementById('waterIncluded').checked = data.water_included === 1;
    document.getElementById('trashIncluded').checked = data.trash_included === 1;
    document.getElementById('sewerIncluded').checked = data.sewer_included === 1;
    document.getElementById('electricIncluded').checked = data.electric_included === 1;
    
    document.getElementById('managerName').value = data.manager_name || '';
    document.getElementById('managerPhone').value = data.manager_phone || '';
    document.getElementById('managerAddress').value = data.manager_address || '';
    
    document.getElementById('communityEmail').value = data.community_email || '';
    document.getElementById('officeHours').value = data.office_hours || '';
    document.getElementById('emergencyContact').value = data.emergency_contact || '';
    
    document.getElementById('notes').value = data.notes || '';
}

editBtn.addEventListener('click', () => {
    populateForm(currentData);
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
});

parkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        park_name: document.getElementById('parkName').value,
        park_address: document.getElementById('parkAddress').value,
        lot_rent: parseFloat(document.getElementById('lotRent').value) || 0,
        water_included: document.getElementById('waterIncluded').checked,
        trash_included: document.getElementById('trashIncluded').checked,
        sewer_included: document.getElementById('sewerIncluded').checked,
        electric_included: document.getElementById('electricIncluded').checked,
        manager_name: document.getElementById('managerName').value,
        manager_phone: document.getElementById('managerPhone').value,
        manager_address: document.getElementById('managerAddress').value,
        community_email: document.getElementById('communityEmail').value,
        office_hours: document.getElementById('officeHours').value,
        emergency_contact: document.getElementById('emergencyContact').value,
        notes: document.getElementById('notes').value
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            await loadParkInfo();
            viewMode.style.display = 'block';
            editMode.style.display = 'none';
        } else {
            alert('Error saving information. Please try again.');
        }
    } catch (error) {
        console.error('Error saving park info:', error);
        alert('Error saving information. Please try again.');
    }
});

loadParkInfo();