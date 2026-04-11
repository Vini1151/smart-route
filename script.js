// Cities
const cities = [
    "Mumbai", "Pune", "Nashik", "Kolhapur",
    "Solapur", "Jalna", "Amravati", "Nanded", "Nagpur"
];
const cityCoords = [
  { name: "Mumbai",   lat: 19.0760, lng: 72.8777 },
  { name: "Pune",     lat: 18.5204, lng: 73.8567 },
  { name: "Nashik",   lat: 19.9975, lng: 73.7898 },
  { name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
  { name: "Solapur",  lat: 17.6805, lng: 75.9064 },
  { name: "Jalna",    lat: 19.8347, lng: 75.8816 },
  { name: "Amravati", lat: 20.9320, lng: 77.7523 },
  { name: "Nanded",   lat: 19.1383, lng: 77.3210 },
  { name: "Nagpur",   lat: 21.1458, lng: 79.0882 }
];

// Graph (9x9 matrix)
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

const API_URL = "https://smart-route-ssir.onrender.com";

const sourceSelect = document.getElementById("source");
const destSelect = document.getElementById("dest");

cities.forEach((city, index) => {
    sourceSelect.innerHTML += `<option value="${index}">${city}</option>`;
    destSelect.innerHTML += `<option value="${index}">${city}</option>`;
});

destSelect.value = 8;
const map = L.map('map').setView([19.5, 76.0], 7);
 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
 
let routeLayer = null;
let routeMarkers = [];

function drawAllCities() {
    cityCoords.forEach((city) => {
        L.circleMarker([city.lat, city.lng], {
            radius: 8,
            fillColor: '#3388ff',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9
        })
        .addTo(map)
        .bindTooltip(city.name, {
            permanent: true,
            direction: 'top',
            offset: [0, -8]
        });
    });
}
 
drawAllCities();
 
function drawRouteOnMap(routeText) {
    if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
    routeMarkers.forEach(m => map.removeLayer(m));
    routeMarkers = [];
 
    const match = routeText.match(/Best Route:\s*(.+)/);
    if (!match) return;
 
    const routeCities = match[1].split('->').map(c => c.trim());
 
    const latlngs = routeCities.map(name => {
        const city = cityCoords.find(c => c.name === name);
        return city ? [city.lat, city.lng] : null;
    }).filter(Boolean);
 
    if (latlngs.length < 2) return;
 
    routeLayer = L.polyline(latlngs, {
        color: '#e05a2b',
        weight: 5,
        opacity: 0.85,
        dashArray: '10, 6'
    }).addTo(map);

    routeCities.forEach((name, idx) => {
        const city = cityCoords.find(c => c.name === name);
        if (!city) return;
 
        const isEndpoint = (idx === 0 || idx === routeCities.length - 1);
 
        const marker = L.circleMarker([city.lat, city.lng], {
            radius: isEndpoint ? 13 : 9,
            fillColor: isEndpoint ? '#e05a2b' : '#ffa040',
            color: '#ffffff',
            weight: 2.5,
            fillOpacity: 1
        })
        .addTo(map)
        .bindPopup(
            `<strong>${name}</strong><br>${isEndpoint ? (idx === 0 ? 'Start' : 'End') : 'Via'}`
        );
 
        routeMarkers.push(marker);
    });

    map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
}
 
function swapCities() {
    const temp = sourceSelect.value;
    sourceSelect.value = destSelect.value;
    destSelect.value = temp;
}

async function findRoute() {
    let src = sourceSelect.value;
    let dest = destSelect.value;

    if (src === dest) {
        document.getElementById("output").innerText =
            "⚠️ Source and destination cannot be same!";
        return;
    }

    document.getElementById("output").innerText = "⏳ Finding route...";

    let input = "";
    input += cities.length + "\n";
    input += cities.join(" ") + "\n";
    graph.forEach(row => {
        input += row.join(" ") + "\n";
    });
    input += src + " " + dest;

    try {
        const res = await fetch(`${API_URL}/route`, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: input
        });

        if (!res.ok) throw new Error("Server error");

        const data = await res.text();
        document.getElementById("output").innerText = data;
        drawRouteOnMap(data);
    } catch (err) {
        document.getElementById("output").innerText =
            "❌ Could not connect to server. Please try again.";
    }
}
