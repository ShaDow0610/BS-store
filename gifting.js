'use strict';
// Tarifs de démonstration autorisés par le propriétaire, à remplacer par les vrais.
// null signifie « prix à confirmer », jamais gratuit.
const GIFT_PRICES_PROVISIONAL = true;
const GIFT_UNIT_PRICES = Object.freeze({parfum:3000,tasse:2500,rose:500,carte:500,montre:5000,ceinture:2000,bloc:1500,thermos:3500,monnaie:1500,chocolat:2000,bracelet:1500,portefeuille:2500,chaine:2000,cle:1000,ventilateur:3000,nounours:4000,cup:5000});
const GIFT_WRAPPING = Object.freeze({standard:{name:'Emballage classique',price:1000},personalise:{name:'Emballage personnalisé',price:2000},panier:{name:'Panier surprise',price:3500}});
const GIFT_ITEMS = [
 ['parfum','Parfum'],['tasse','Tasse personnalisée'],['rose','Rose'],['carte','Carte de vœux'],['montre','Montre'],['ceinture','Ceinture'],['bloc','Bloc-notes + stylo'],['thermos','Thermos'],['monnaie','Porte-monnaie'],['chocolat','Chocolat'],['bracelet','Bracelet'],['portefeuille','Portefeuille'],['chaine','Chaîne'],['cle','Porte-clés'],['ventilateur','Mini ventilateur'],['nounours','Nounours'],['cup','Stanley cup']
].map(([id,name]) => ({id,name,price:GIFT_UNIT_PRICES[id]}));
const GIFT_PACKS = [
 {id:'douceur',name:'Douce attention',price:10000,items:['parfum','tasse','rose','carte']},
 {id:'allure',name:'Belle allure',price:12000,items:['parfum','montre','ceinture','rose','carte']},
 {id:'quotidien',name:'Joli quotidien',price:14000,items:['parfum','bloc','thermos','chocolat','rose','carte']},
 {id:'essentiels',name:'Les essentiels',price:16000,items:['parfum','bloc','thermos','monnaie','rose','carte']},
 {id:'surprise',name:'Petite surprise',price:16000,items:['parfum','cle','bracelet','ceinture','ventilateur','carte']},
 {id:'elegance',name:'Élégance à offrir',price:17000,items:['parfum','montre','bracelet','ceinture','rose','carte']},
 {id:'signature',name:'Attention signature',price:20000,items:['parfum','portefeuille','ceinture','montre','chaine','bracelet','carte']},
 {id:'tendresse',name:'Un peu de tendresse',price:20000,items:['parfum','nounours','bracelet','cup','rose','carte']},
 {id:'instant',name:'Un instant pour soi',price:20000,items:['montre','thermos','bracelet','cup','rose','carte']}
];
function giftPricing(composition, packCount) {
 const entries = Object.entries(composition).filter(([,qty]) => qty > 0);
 const valid = entries.length > 0 && Object.entries(composition).every(([id,qty]) => GIFT_ITEMS.some(item=>item.id===id) && Number.isInteger(qty) && qty>=0 && qty<=20) && Number.isInteger(packCount) && packCount>=1 && packCount<=99;
 const match = valid ? GIFT_PACKS.find(pack=>entries.length===pack.items.length && pack.items.every(id=>composition[id]===1)) : null;
 const knownSubtotal = valid ? entries.reduce((sum,[id,qty])=>sum+(GIFT_ITEMS.find(item=>item.id===id).price ?? 0)*qty*packCount,0) : 0;
 const unknownCount = entries.filter(([id])=>GIFT_ITEMS.find(item=>item.id===id)?.price == null).length;
 return {valid,match,knownSubtotal,unknownCount,total:match?match.price*packCount:valid&&unknownCount===0?knownSubtotal:null};
}
function giftMessage(composition, count, details) {
 const pricing = giftPricing(composition,count);
 if(!pricing.valid) throw new Error('Composition ou quantité invalide');
 const estimate=giftEstimate(composition,count,details.wrap);
 const lines=[`Bonjour ${STORE.name} !`, 'Je souhaite commander un pack cadeau.', '', `Formule : ${pricing.match ? pricing.match.name : 'Composition personnalisée'}`, `Nombre de packs identiques : ${count}`, '', 'Composition de chaque pack :'];
 if(GIFT_PRICES_PROVISIONAL) lines.splice(2,0,'TARIFS DE DÉMONSTRATION : estimation provisoire, à confirmer par la boutique.');
 GIFT_ITEMS.filter(item=>composition[item.id]>0).forEach(item=>lines.push(`- ${composition[item.id]} × ${item.name} (soit ${composition[item.id]*count} au total) — ${pricing.match?'inclus dans le forfait':item.price===null?'prix unitaire à confirmer':money(item.price)+' / unité'}`));
 lines.push('');
 if(pricing.match) lines.push(`Prix de la formule : ${money(pricing.match.price)} / pack`, `Sous-total des packs : ${money(pricing.total)}`);
 else if(pricing.total!==null) lines.push(`Sous-total articles : ${money(pricing.total)}`);
 else lines.push(`Montant des articles chiffrés : ${money(pricing.knownSubtotal)} (total incomplet)`, `${pricing.unknownCount} référence(s) à chiffrer. Prix final sur devis.`);
 lines.push(`Emballage : ${estimate.wrapping.name} — ${money(estimate.wrapping.price)} / pack`, `Sous-total emballage : ${money(estimate.wrappingTotal)}`, `Total estimé hors livraison : ${estimate.total===null?'à confirmer':money(estimate.total)}`, 'Personnalisation des articles : éventuels suppléments à confirmer.', `Occasion : ${details.occasion}`, `Ville de départ : ${STORE.departureCity}`, `Adresse de livraison : ${deliveryAddress(details.city, details.district || '')}`, 'Livraison au Cameroun uniquement. Frais et desserte à confirmer.');
 if(details.recipient) lines.push(`Destinataire : ${details.recipient}`);
 if(details.date) lines.push(`Date souhaitée : ${details.date}`);
 if(details.notes) lines.push(`Message et personnalisations : ${details.notes}`);
 lines.push('', 'Merci de confirmer disponibilité, prix final, livraison, délai et modalités de paiement.');
 return lines.join('\n');
}
function giftEstimate(composition,count,wrap='standard') {
 const pricing=giftPricing(composition,count);
 const wrapping=GIFT_WRAPPING[wrap] || GIFT_WRAPPING.standard;
 const wrappingTotal=pricing.valid?wrapping.price*count:0;
 return {...pricing,wrapping,wrappingTotal,articlesTotal:pricing.total,total:pricing.total===null?null:pricing.total+wrappingTotal};
}
(() => {
 const $ = selector => document.querySelector(selector);
 const itemName = id=>GIFT_ITEMS.find(item=>item.id===id).name;
 let composition = {};
 const form = $('#gift-form');
 $('#gift-presets').innerHTML = GIFT_PACKS.map(pack=>`<article class="preset-card"><span class="eyebrow">LOVE IN A BOX</span><h3>${pack.name}</h3><strong>${money(pack.price)}</strong><ul>${pack.items.map(id=>`<li>${itemName(id)}</li>`).join('')}</ul><button class="product-select" type="button" data-pack="${pack.id}">Choisir et personnaliser <span><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span></button></article>`).join('');
 $('#gift-items').innerHTML = GIFT_ITEMS.map(item=>`<div class="gift-item"><label for="gift-qty-${item.id}">${item.name}<small>${item.price===null?'Prix unitaire à confirmer':money(item.price)+' / unité'}</small></label><div class="quantity-control"><button type="button" data-quantity="${item.id}" data-step="-1" aria-label="Retirer un article : ${item.name}"><i class="fa-solid fa-minus" aria-hidden="true"></i></button><input id="gift-qty-${item.id}" aria-label="Quantité de ${item.name} par pack" data-gift-item="${item.id}" type="number" min="0" max="20" step="1" value="0" required inputmode="numeric"><button type="button" data-quantity="${item.id}" data-step="1" aria-label="Ajouter un article : ${item.name}"><i class="fa-solid fa-plus" aria-hidden="true"></i></button></div></div>`).join('');
 function render(){
  const count=Number($('#gift-count').value);
  const pricing=giftEstimate(composition,count,$('#gift-wrap').value);
  const chosen=GIFT_ITEMS.filter(item=>composition[item.id]>0);
  $('#gift-summary-items').replaceChildren(...chosen.map(item=>{const li=document.createElement('li');li.textContent=`${composition[item.id]} × ${item.name} / pack — ${pricing.match?'inclus dans le forfait':item.price===null?'à chiffrer':money(item.price*composition[item.id])}`;return li;}));
  $('#gift-empty').hidden=chosen.length>0;
  $('#composition-title').textContent=pricing.match?pricing.match.name:'Votre composition personnalisée';
  $('#gift-total').textContent=pricing.total!==null?money(pricing.total):'Sur devis';
  $('#gift-live-price').textContent=!chosen.length?'Choisissez vos articles':!pricing.valid?'Vérifiez les quantités':pricing.total!==null?money(pricing.total):pricing.knownSubtotal>0?`${money(pricing.knownSubtotal)} + articles à chiffrer`:'Prix à confirmer · tarifs unitaires manquants';
  $('#gift-price-label').textContent=pricing.total!==null?`Total estimé hors livraison · ${count} pack${count>1?'s':''}`:'Prix de la composition';
  $('#gift-pricing-note').textContent=!chosen.length?'Choisissez vos articles pour voir le total.':!pricing.valid?'Vérifiez les quantités.':pricing.total!==null?`Articles : ${money(pricing.articlesTotal)}${pricing.match?' (forfait de la grille)':''}. ${pricing.wrapping.name} : ${money(pricing.wrappingTotal)} (${money(pricing.wrapping.price)} / pack). ${GIFT_PRICES_PROVISIONAL?'Prix de démonstration, à confirmer.':''}`:`Montant connu : ${money(pricing.knownSubtotal)}. ${pricing.unknownCount} référence(s) sans prix unitaire : le total reste à confirmer.`;
  for(const input of document.querySelectorAll('[data-gift-item]')){const qty=Number(input.value);input.closest('.gift-item').classList.toggle('has-quantity',qty>0);const controls=input.parentElement;controls.querySelector('[data-step="-1"]').disabled=qty<=0;controls.querySelector('[data-step="1"]').disabled=qty>=20;}
  $('#gift-submit').disabled=!pricing.valid;
  for(const button of document.querySelectorAll('[data-pack]')){const active=pricing.match?.id===button.dataset.pack;button.setAttribute('aria-pressed',String(active));button.closest('article').classList.toggle('selected',active);}
 }
 $('#gift-presets').addEventListener('click',event=>{
  const button=event.target.closest('[data-pack]');if(!button)return;
  const pack=GIFT_PACKS.find(pack=>pack.id===button.dataset.pack);
  composition=Object.fromEntries(pack.items.map(id=>[id,1]));
  for(const input of document.querySelectorAll('[data-gift-item]'))input.value=composition[input.dataset.giftItem]||0;
  render();form.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 });
 $('#gift-items').addEventListener('input',event=>{const input=event.target.closest('[data-gift-item]');if(!input)return;composition[input.dataset.giftItem]=Number(input.value);render();});
 $('#gift-items').addEventListener('click',event=>{const button=event.target.closest('[data-quantity]');if(!button)return;const id=button.dataset.quantity;const input=$(`#gift-qty-${id}`);const next=Math.min(20,Math.max(0,(Number(input.value)||0)+Number(button.dataset.step)));input.value=next;composition[id]=next;render();});
 $('#gift-count').addEventListener('input',render);
 $('#gift-wrap').addEventListener('change',render);
 $('#clear-gift').addEventListener('click',()=>{composition={};for(const input of document.querySelectorAll('[data-gift-item]'))input.value=0;render();});
 const value=id=>$(id).value.trim();
 const readableDate=id=>value(id)?value(id).split('-').reverse().join('/') : '';
 const today = new Date(); const localToday = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 for(const id of ['#gift-date','#magazine-date'])$(id).min=localToday;
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const count=Number($('#gift-count').value);
  if(!giftPricing(composition,count).valid){$('#gift-error').textContent='Choisissez au moins un article et vérifiez les quantités.';return;}
  $('#gift-error').textContent='';
  const details={wrap:value('#gift-wrap'),occasion:value('#gift-occasion'),city:value('#gift-city'),district:value('#gift-district'),recipient:value('#gift-recipient'),date:readableDate('#gift-date'),notes:value('#gift-notes')};
  goToWhatsApp(giftMessage(composition,count,details),$('#gift-submit'));
 });
 $('#magazine-form').addEventListener('submit',event=>{
  event.preventDefault();if(!event.currentTarget.reportValidity())return;
  const lines=[`Bonjour ${STORE.name} ! Je souhaite un devis pour un magazine personnalisé.`, '', `Type : ${value('#magazine-type')}`, `Nom / entreprise : ${value('#magazine-name')}`, `Adresse : ${deliveryAddress(value('#magazine-city'),value('#magazine-district'))}`, `Date souhaitée : ${readableDate('#magazine-date')||'À convenir'}`, `Pages souhaitées : ${value('#magazine-pages')||'À conseiller'}`, `Exemplaires souhaités : ${value('#magazine-copies')||'À conseiller'}`, `Projet : ${value('#magazine-notes')}`, '', 'Prix : sur devis. Merci de confirmer format, création, impression éventuelle, délai et montant total.'];
  goToWhatsApp(lines.join('\n'),event.currentTarget.querySelector('button[type="submit"]'));
 });
 render();
})();
