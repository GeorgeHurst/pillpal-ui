function generateSchedule(data) {

    const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const toTimeString = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const start = toMinutes(data.userPreferences.activeHoursAM);
    const end = toMinutes(data.userPreferences.activeHoursPM);
    const totalActiveMinutes = end - start;

    const allDoses = [];
    const skippedPills = [];

    for (const pill of data.pills) {
        const {
            name,
            dosePerPill,
            pillsPerDose,
            dosesPerDay,
            minHoursBetweenDoses
        } = pill;

        const minInterval = minHoursBetweenDoses * 60;
        const spacing = totalActiveMinutes / dosesPerDay;

        // Check if schedule is impossible for this pill
        if (spacing < minInterval) {
            skippedPills.push({
                name,
                reason: `Not enough active time (${totalActiveMinutes} mins) to fit ${dosesPerDay} doses with minimum ${minInterval} mins between doses.`
            });
            continue; // Skip this pill
        }

        let currentTime = start;
        for (let i = 0; i < dosesPerDay; i++) {
            if (currentTime > end) break;

            allDoses.push({
                time: Math.round(currentTime),
                pill: name,
                amount: pillsPerDose
            });

            currentTime += Math.max(minInterval, spacing);
        }
    }

    // Sort all doses by time
    allDoses.sort((a, b) => a.time - b.time);

    // Group doses that are within 10 minutes
    const timeThreshold = 10;
    const groupedSchedule = [];

    for (const dose of allDoses) {
        const lastGroup = groupedSchedule[groupedSchedule.length - 1];

        if (
            lastGroup &&
            Math.abs(lastGroup.time - dose.time) <= timeThreshold
        ) {
            const existing = lastGroup.pills.find(p => p.name === dose.pill);
            if (existing) {
                existing.amount += dose.amount;
            } else {
                lastGroup.pills.push({ name: dose.pill, amount: dose.amount });
            }
        } else {
            groupedSchedule.push({
                time: dose.time,
                pills: [{ name: dose.pill, amount: dose.amount }],
                taken: false
            });
        }
    }

    return {
        schedule: groupedSchedule.map(entry => ({
            time: toTimeString(entry.time),
            pills: entry.pills,
            taken: entry.taken
        })),
        skippedPills
    };

}


function getData() {
    fetch('http://localhost:5000/loadData')
    .then(response => response.json())
    .then(data => {fillSlots(data)/*; return data <-- does this work*/});
}

document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit_btn');
    const pillDiv = document.getElementById('pill_div');

    editBtn.addEventListener('click', () => {
        pillDiv.classList.toggle('editing');
        editBtn.textContent = pillDiv.classList.contains('editing') ? 'DONE' : 'EDIT';
        
    });

    getData();

    // This needs to be made specific for each info button
    document.querySelectorAll('.info_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Info: This is your pill information.');
        });
    });

})

function fillSlots(data) {
 
    const slots = [
        document.getElementById('pill_span1'),
        document.getElementById('pill_span2'),
        document.getElementById('pill_span3'),
        document.getElementById('pill_span4')
    ]

    for (const slot in slots) {
        slots[slot].innerText = (data.pills[slot].name) ? capitaliseFirstLetter(data.pills[slot].name) : "FREE SLOT"
    }

}


function capitaliseFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

