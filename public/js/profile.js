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

// Add More Credit Cards
const addNewCardButton = document.querySelector('.new-card img');
addNewCardButton.addEventListener('click', (e) => {
  const creditCardsContainer = document.querySelector('.credit-cards-container');
  const newCardElement = `
  <form class="credit-card rounded-lg outline outline-1 outline-slate-300">
    <label for="payment" class="text-sm mb-2">Credit Card</label>
    <div class="card-details-container">
      <div class="card-details">
        <input type="text" id="cardOwner" class="flex-1 input input-sm input-outline" placeholder="Card Owner" />
        <input type="text" id="cardNumber" class="flex-1 input input-sm input-outline" placeholder="Card Number" />
        <input type="text" id="cardExpirationDate" class="flex-2 input input-sm input-outline" placeholder="MM / YY" />
      </div>
      <div class="buttons">
        <input type="submit" value="Save" class="text-xs btn btn-xs btn-outline btn-accent" />
        <button class="text-xs btn btn-xs btn-outline btn-error">Delete</button>
      </div>
    </div>
  </form>
    `;
  creditCardsContainer.insertAdjacentHTML('beforeend', newCardElement);
});
