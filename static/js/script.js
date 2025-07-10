let enteredPin = ""

function press(value) {

    if (value == 'clear') {
        document.getElementById('pincode').innerText = "";
        enteredPin = "";
        return;
    }    
    else if (value == 'enter') {

        if (enteredPin != "") {

            fetch('/check_passcode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ passcode: enteredPin })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location = "/main"
                } else {
                    alert("Access Denied");
                }
            })
            .catch(error => console.error('Error:', error));
    
            document.getElementById('pincode').innerText = "";
            enteredPin = "";
            return;
        }
    }
    else if (enteredPin.length < 6) {
        document.getElementById('pincode').innerText += "*\u00A0";
        enteredPin += value;
        return;
    }

}


// Main Page
function updateClock() {
    const now = new Date();

    const date = now.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedTime = `${date} ${month} ${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = formattedTime;
}

updateClock(); 
setInterval(updateClock, 1000); 




menuButton.addEventListener('click', () => {
    sidePane.classList.toggle('open');
});


document.addEventListener('click', (event) => {
    if (!sidePane.contains(event.target) && !menuButton.contains(event.target)) {
        sidePane.classList.remove('open');
    }
});


// function updateTimeDifference() {
//     const targetTime = "14:30"; // Time from your HTML
//     const [targetHour, targetMinute] = targetTime.split(":").map(Number);

//     const now = new Date();
//     const target = new Date(now);
//     target.setHours(targetHour, targetMinute, 0, 0);

//     // If target time is in the past today, adjust for tomorrow
//     if (target < now) {
//       target.setDate(target.getDate() + 1);
//     }

//     const diffMs = target - now;
//     const diffMins = Math.floor(diffMs / 60000);
//     const hours = Math.floor(diffMins / 60);
//     const minutes = diffMins % 60;

//     const display = `${hours}h ${minutes}m`;

//     document.querySelector(".time-diff").textContent = display;
//   }

//   updateTimeDifference();
//   setInterval(updateTimeDifference, 60000);