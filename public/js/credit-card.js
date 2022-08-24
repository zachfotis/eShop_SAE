// ccCVCInput = document.querySelector('.cc-cvc-input'),
// ccCVCPattern = /^\d{0,3}$/g,

// Add More Credit Cards
const addNewCardButton = document.querySelector('.payment-section .add-card');
addNewCardButton.addEventListener('click', (e) => {
  const creditCardsContainer = document.querySelector('.credit-cards-container');
  const newCardElement = `
    <section class="credit-card floating new-card">
      <form method="POST" action="/user/profile/updateCard" class="credit-card">
        <div class="card-details">
          <input type="text" id="cardOwner" name="cardOwner" class="flex-1 input input-sm input-outline" placeholder="Card Owner" />
          <input type="text" id="cardNumber" name="cardNumber" maxlength="19" class="flex-1 input input-sm input-outline" placeholder="Card Number" />
          <input type="text" id="cardExpirationDate" name="cardExpirationDate" maxlength="5" class="flex-2 input input-sm input-outline" placeholder="MM / YY" />
        </div>
        <div class="buttons">
          <input type="submit" value="Add New Card" class="btn btn-sm btn-outline btn-accent" />
        </div>
      </form>
    </section>
    `;
  creditCardsContainer.insertAdjacentHTML('beforeend', newCardElement);
  addNewCardButton.style.display = 'none';

  let ccNumberInput = document.querySelector('#cardNumber'),
    ccNumberPattern = /^\d{0,16}$/g,
    ccNumberSeparator = '-',
    ccNumberInputOldValue,
    ccNumberInputOldCursor,
    ccExpiryInput = document.querySelector('#cardExpirationDate'),
    ccExpiryPattern = /^\d{0,4}$/g,
    ccExpirySeparator = '/',
    ccExpiryInputOldValue,
    ccExpiryInputOldCursor;

  let mask = (value, limit, separator) => {
    var output = [];
    for (let i = 0; i < value.length; i++) {
      if (i !== 0 && i % limit === 0) {
        output.push(separator);
      }

      output.push(value[i]);
    }

    return output.join('');
  };
  let unmask = (value) => value.replace(/[^\d]/g, '');
  let checkSeparator = (position, interval) => Math.floor(position / (interval + 1));
  let ccNumberInputKeyDownHandler = (e) => {
    let el = e.target;
    ccNumberInputOldValue = el.value;
    ccNumberInputOldCursor = el.selectionEnd;
  };
  let ccNumberInputInputHandler = (e) => {
    let el = e.target,
      newValue = unmask(el.value),
      newCursorPosition;

    if (newValue.match(ccNumberPattern)) {
      newValue = mask(newValue, 4, ccNumberSeparator);

      newCursorPosition =
        ccNumberInputOldCursor -
        checkSeparator(ccNumberInputOldCursor, 4) +
        checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) +
        (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

      el.value = newValue !== '' ? newValue : '';
    } else {
      el.value = ccNumberInputOldValue;
      newCursorPosition = ccNumberInputOldCursor;
    }

    el.setSelectionRange(newCursorPosition, newCursorPosition);
  };
  let ccExpiryInputKeyDownHandler = (e) => {
    let el = e.target;
    ccExpiryInputOldValue = el.value;
    ccExpiryInputOldCursor = el.selectionEnd;
  };
  let ccExpiryInputInputHandler = (e) => {
    let el = e.target,
      newValue = el.value;

    newValue = unmask(newValue);
    if (newValue.match(ccExpiryPattern)) {
      newValue = mask(newValue, 2, ccExpirySeparator);
      el.value = newValue;
    } else {
      el.value = ccExpiryInputOldValue;
    }
  };

  ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
  ccNumberInput.addEventListener('input', ccNumberInputInputHandler);

  ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
  ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);
});
