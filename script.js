// Cities
const cities = [
    "Mumbai", "Pune", "Nashik", "Kolhapur",
    "Solapur", "Jalna", "Amravati", "Nanded", "Nagpur"
];

// Graph (same 9×9 matrix)
const graph = [
    [0, 150, 170, 410, 0, 210, 0, 0, 0],
    [150, 0, 210, 230, 250, 0, 0, 0, 0],
    [170, 210, 0, 0, 0, 185, 245, 0, 0],
    [410, 230, 0, 0, 185, 0, 0, 0, 0],
    [0, 250, 0, 185, 0, 300, 0, 250, 0],
    [210, 0, 185, 0, 300, 0, 330, 0, 470],
    [0, 0, 245, 0, 0, 330, 0, 0, 155],
    [0, 0, 0, 0, 250, 0, 0, 0, 327],
    [0, 0, 0, 0, 0, 470, 155, 327, 0]
];

// Fill dropdowns
const sourceSelect = document.getElementById("source");
const destSelect = document.getElementById("dest");

cities.forEach((city, index) => {
    sourceSelect.innerHTML += `<option value="${index}">${city}</option>`;
    destSelect.innerHTML += `<option value="${index}">${city}</option>`;
});

// Function to send data to C
async function findRoute() {
    let src = sourceSelect.value;
    let dest = destSelect.value;

    if (src === dest) {
        document.getElementById("output").innerText =
            "⚠️ Source and destination cannot be same!";
        return;
    }

    // Convert JS data → C input format
    let input = "";

    input += cities.length + "\n";

    input += cities.join(" ") + "\n";

    graph.forEach(row => {
        input += row.join(" ") + "\n";
    });

    input += src + " " + dest;

    // Send to backend
    const res = await fetch("/route", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: input
    });

    const data = await res.text();
    document.getElementById("output").innerText = data;
}