
document.addEventListener('DOMContentLoaded', () => {
    const slotId = document.getElementById('pill-data').dataset.slotId;

    const form = document.querySelector('.edit_form form');
    const nameInput = document.getElementById('name');
    const dosePerPillInput = document.getElementById('dosePerPill');
    const pillsPerDoseInput = document.getElementById('pillsPerDose');
    const dosesPerDayInput = document.getElementById('dosesPerDay');
    const minHoursBetweenDosesInput = document.getElementById('minHoursBetweenDoses');

    // Load existing pill data
    fetch(`/get_pill_data/${slotId}`)
        .then(response => response.json())
        .then(data => {
            nameInput.value = data.name ? data.name : "";
            dosePerPillInput.value = data.dosePerPill;
            pillsPerDoseInput.value = data.pillsPerDose;
            dosesPerDayInput.value = data.dosesPerDay;
            minHoursBetweenDosesInput.value = data.minHoursBetweenDoses;
        });




    
})

