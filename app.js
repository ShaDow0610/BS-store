'use strict';
// Numéro WhatsApp au format international, chiffres uniquement (sans + ni espaces).
// Exemple de format : indicatif du pays suivi du numéro local.
const STORE = Object.freeze({ whatsapp: '237699306675', name: 'Bresty Gift & Shop', departureCity: 'Douala' });
const PRODUCTS = [
  { id: 'signature', name: 'Coffret Doré Signature', category: 'montres', label: 'Montres & coffrets', image: 'img/img4.png.webp', price: 22000, badge: 'Une attention personnelle', short: 'Montre, bracelet et collier : trois détails, une même attention.', description: 'Un ensemble de trois pièces à la finition dorée : une montre, un bracelet et un collier. Le visuel présente un exemple de gravure. Précisez le prénom souhaité pour vérifier les possibilités de personnalisation, les délais et le tarif final.' },
  { id: 'duo', name: 'Royal Steel Duo', category: 'montres', label: 'Montres & coffrets', image: 'img/img3.png.webp', price: null, badge: 'À partager', short: 'Deux montres argentées assorties, à découvrir ensemble.', description: 'Un duo de montres à bracelet argenté et cadran sombre, présenté en coffret sur le visuel. Demandez le prix, les dimensions et les détails du modèle sur WhatsApp avant de confirmer votre choix.' },
  { id: 'dore', name: 'Duo Éclat Doré', category: 'montres', label: 'Montres & coffrets', image: 'img/img1.png.webp', price: null, badge: 'Éclat au quotidien', short: 'Deux silhouettes dorées pour une allure coordonnée.', description: 'Deux montres à finition dorée et cadran clair figurent sur cette photo. Confirmez avec nous le prix à l’unité ou du duo, les dimensions, les matériaux et les informations de marque avant votre achat.' },
  { id: 'collier', name: 'Collier Épure', category: 'bijoux', label: 'Bijoux', image: 'img/img5.png.webp', price: null, badge: 'Votre touche personnelle', short: 'Une ligne délicate, un prénom, une attention à garder près de soi.', description: 'Un collier à pendentif rectangulaire et finition dorée. Les prénoms du visuel illustrent un exemple de personnalisation : précisez votre demande pour connaître les possibilités, le prix et le délai.' },
  { id: 'morning', name: 'Morning Reign', category: 'deco', label: 'Décoration', image: 'img/img2.png.webp', price: null, badge: 'Pour votre intérieur', short: 'Une touche de caractère pour commencer la journée avec assurance.', description: 'Un tableau décoratif aux tons doux, illustré du message « Start everyday like a BOSS ». Format indiqué dans le catalogue d’origine : 40 × 30 cm. Le prix, le format disponible et la finition du cadre sont à confirmer ensemble.' }
];
const money = amount => `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
const priceLabel = product => product.price === null ? 'Prix sur demande' : money(product.price);
const productsContainer = document.querySelector('#products');
productsContainer.innerHTML = PRODUCTS.map(product => `<article class="product-card" data-category="${product.category}"><div class="product-image"><span class="product-badge">${product.badge}</span><img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" width="500" height="530"></div><p class="product-category">${product.label}</p><div class="product-title-row"><h3>${product.name}</h3><span class="product-price">${priceLabel(product)}</span></div><p class="product-description">${product.short}</p><button class="product-select" data-product="${product.id}" aria-label="Choisir ${product.name}">Choisir cette pièce <span aria-hidden="true"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span></button></article>`).join('');
const productDialog = document.querySelector('#product-dialog');
const contactDialog = document.querySelector('#contact-dialog');
const form = document.querySelector('#order-form');
const quantity = document.querySelector('#quantity');
let selectedProduct = null;

function openDialog(dialog, trigger) {
  dialog.returnFocus = trigger;
  dialog.showModal();
  document.body.classList.add('modal-open');
}
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) { document.body.classList.remove('modal-open'); const trigger = dialog.returnFocus; if (trigger?.isConnected && !trigger.closest('dialog:not([open])')) trigger.focus(); else document.querySelector('[data-contact]').focus(); } });
}
document.querySelector('.dialog-dismiss').addEventListener('click', () => contactDialog.close());
function whatsappUrl(message) {
  const phone = STORE.whatsapp.replace(/[\s()+-]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
function goToWhatsApp(message, trigger) {
  const url = whatsappUrl(message);
  if (!url) {
    if (productDialog.open) productDialog.close();
    openDialog(contactDialog, trigger?.isConnected ? trigger : document.querySelector('[data-contact]'));
    return;
  }
  // Ouverture directe à la suite du clic : compatible avec les bloqueurs de fenêtres.
  window.open(url, '_blank', 'noopener,noreferrer');
}
for (const button of document.querySelectorAll('[data-contact]')) button.addEventListener('click', () => goToWhatsApp('Bonjour Bresty Gift & Shop ! Je souhaite en savoir plus sur votre collection. Pouvez-vous me conseiller ?', button));
for (const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click', () => {
  for (const filter of document.querySelectorAll('[data-filter]')) { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); }
  let count = 0;
  for (const card of productsContainer.children) { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) count++; }
  document.querySelector('#result-count').textContent = `${count} pièce${count > 1 ? 's' : ''} à découvrir`;
});
function updateTotal() {
  const amount = Number(quantity.value);
  document.querySelector('#order-total').textContent = selectedProduct.price === null ? 'À confirmer' : Number.isInteger(amount) && amount >= 1 && amount <= 99 ? money(selectedProduct.price * amount) : 'Quantité à vérifier';
}
productsContainer.addEventListener('click', event => {
  const button = event.target.closest('[data-product]');
  if (!button) return;
  selectedProduct = PRODUCTS.find(product => product.id === button.dataset.product);
  form.reset();
  document.querySelector('#dialog-title').textContent = selectedProduct.name;
  document.querySelector('#dialog-category').textContent = selectedProduct.label;
  document.querySelector('#dialog-description').textContent = selectedProduct.description;
  document.querySelector('#dialog-price').textContent = priceLabel(selectedProduct);
  const image = document.querySelector('#dialog-image');
  image.src = selectedProduct.image;
  image.alt = selectedProduct.name;
  updateTotal();
  openDialog(productDialog, button);
});
quantity.addEventListener('input', updateTotal);
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!selectedProduct || !form.reportValidity()) return;
  const count = Number(quantity.value);
  if (!Number.isInteger(count) || count < 1 || count > 99) return;
  const city = document.querySelector('#city').value.trim();
  const note = document.querySelector('#order-note').value.trim();
  const lines = ['Bonjour Bresty Gift & Shop ! Je souhaite commander :', '', `Article : ${selectedProduct.name}`, `Référence : ${selectedProduct.id.toUpperCase()}`, `Quantité : ${count}`, `Prix indiqué : ${priceLabel(selectedProduct)}`, `Sous-total articles : ${selectedProduct.price === null ? 'à confirmer' : money(selectedProduct.price * count)}`, `Ville de départ : ${STORE.departureCity}`, 'Livraison : frais et délais à confirmer'];
  if (city) lines.push(`Adresse de livraison : ${deliveryAddress(city, document.querySelector('#district').value)}`);
  if (note) lines.push(`Précision : ${note}`);
  lines.push('', 'Pouvez-vous confirmer la disponibilité, le montant total avec livraison et les modalités de paiement ?');
  goToWhatsApp(lines.join('\n'), document.querySelector('.submit-order'));
});
document.querySelector('#year').textContent = new Date().getFullYear();


