const shippingForm = document.querySelector('.shipping-section form');
const lat = Number(shippingForm.dataset.lat) ? Number(shippingForm.dataset.lat) : 39.0742;
const lng = Number(shippingForm.dataset.lng) ? Number(shippingForm.dataset.lng) : 21.8243;
const isCoordinates = Number(shippingForm.dataset.lat) && Number(shippingForm.dataset.lng) ? true : false;
const zoomLevel = isCoordinates ? 13 : 2;

let map = L.map('map').setView([lat, lng], zoomLevel);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);

if (isCoordinates) {
  let marker = L.marker([lat, lng]).addTo(map);
}
