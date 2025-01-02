// ----------------------------------
// Data and Initial Setup
// ----------------------------------

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

// Profile Section DOM Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const descriptionName = document.querySelector(".profile__description");

// Edit Profile Modal DOM Elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Add Card Modal DOM Elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");

// Cards Section DOM Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//Preview Modal DOM Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

// ----------------------------------
// Open & Close Modal Functions
// ----------------------------------

// Function to open a modal
function openModal(modal) {
  modal.classList.add("modal_opened");
}

// Function to close a modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// ----------------------------------
// Card Creation & Deletion
// ----------------------------------

// Function to create a card HTML element
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImg = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardTitle.textContent = data.name;
  cardImg.alt = data.name;
  cardImg.src = data.link;

  // Like button toggle
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  // Delete button functionality
  cardDeleteBtn.addEventListener("click", deleteCard);

  //Open preview modal
  cardImg.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

//Close preview modal
previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

// Function to delete a card
function deleteCard(evt) {
  const cardToDelete = evt.target.closest(".card");
  cardToDelete.remove();
}

// ----------------------------------
// Modal Form Handlers
// ----------------------------------

// Handle edit profile form submission
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  descriptionName.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

// Handle add card form submission
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

// ----------------------------------
// Event Listeners
// ----------------------------------

// Edit profile button click event
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = descriptionName.textContent;
  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

// Edit profile modal close button click event
editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

// Add card button click event
profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

// Add card modal close button click event
cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
  resetValidation(cardForm, [cardNameInput, cardLinkInput], settings);
  cardForm.reset();
});

// Form submission event listeners
editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

// ----------------------------------
// Initial Card Rendering
// ----------------------------------

// Render initial cards from the array
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
