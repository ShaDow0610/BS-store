# Bresty Gift & Shop

Site statique : ouvrir index.html, sans installation. Boutique basée à Douala.

## Commandes WhatsApp

Le numéro validé est +237 699 306 675, défini dans STORE.whatsapp (app.js). Les boutons ouvrent une conversation avec un récapitulatif prérempli : le client doit envoyer le message pour transmettre sa demande. Aucune commande ni aucun paiement ne sont enregistrés sur le site.

## Packs cadeaux

Les neuf formules de la grille Love in a box sont définies dans GIFT_PACKS (gifting.js), de 10 000 à 20 000 FCFA. Les noms des formules servent uniquement à faciliter leur sélection. Les compositions et les prix reprennent la grille fournie.

Le visiteur choisit une formule ou ajoute librement les articles, de 0 à 20 unités par article et de 1 à 99 packs identiques. Une composition correspondant exactement à une formule conserve son prix. Toute autre composition est sur devis : les tarifs unitaires n’ont pas été fournis. Le prix affiché exclut livraison et éventuels suppléments de personnalisation ou emballage. Disponibilité et tarif final sont à confirmer sur WhatsApp.

Le récapitulatif transmis inclut la composition par pack, les quantités totales, le nombre de packs, les prix connus, la ville, la date, le destinataire, l’occasion et les personnalisations. Les champs du client sont affichés comme texte, sans insertion HTML.

## Magazines

Formulaire de demande de devis : business, mariage, anniversaire et naissance. Nom, ville, date, pages, exemplaires et description sont transmis sur WhatsApp. Les photos et textes se partagent ensuite dans la conversation. Aucun tarif ni délai inventé.

## Accessoires et livraison

Modifier PRODUCTS dans app.js pour le catalogue. price: null affiche « Prix sur demande ». Le coffret à 22 000 FCFA reprend le projet initial et reste à vérifier. Départ des livraisons : Douala. Frais, délais et modalités à compléter avec les informations de la boutique.

## Vérification

Syntaxe des scripts et intégrité des ancres, labels et ressources contrôlées. Calculs des neuf formules, quantités multiples, compositions modifiées, messages et saisies invalides vérifiés. La présentation mobile et les formulaires restent à vérifier visuellement dans un navigateur, ainsi que l’ouverture réelle sur WhatsApp Business.

## Ergonomie et livraison au Cameroun

Navigation rapide sur mobile, champs à 16 px pour limiter le zoom automatique, boutons de quantités tactiles et sous-total visible pendant la composition. Les sous-totaux des neuf formules se recalculent avec le nombre de packs.

Les prix unitaires se configurent dans GIFT_UNIT_PRICES (gifting.js). Tous restent null en attendant les vrais tarifs de la boutique. Un prix manquant n’est jamais considéré comme gratuit : le calcul affiche les montants connus et indique les références restant à chiffrer. Dès que tous les articles sélectionnés ont un prix, le sous-total se calcule automatiquement. Emballage, personnalisation et livraison restent à confirmer séparément.

Les trois formulaires utilisent des suggestions de villes camerounaises et des quartiers selon la ville. La saisie libre permet de renseigner une ville ou un quartier absent. La liste est non exhaustive et ne garantit pas la desserte. Le pays de livraison est le Cameroun ; ville et quartier figurent dans le message WhatsApp. Aucun service de géolocalisation ni appel réseau n’est nécessaire.

Sources des suggestions géographiques : [Commune de Douala Ier](https://douala1.cm/histoire/), [Atlas du Cameroun, IRD](https://horizon.documentation.ird.fr/exl-doc/pleins_textes/2022-09/010039088.pdf), [répertoire indicatif des quartiers](https://au237.com/immo/quartiers). Ajouter les zones effectivement desservies dans delivery.js une fois confirmées par la boutique.

Contrôles complémentaires effectués : prix complets et partiels, tarifs manquants, recherches de quartiers sans accents, adresse et caractères spéciaux dans les messages WhatsApp, intégrité des nouveaux champs. L’affichage réel sur les appareils reste à vérifier dans un navigateur.

## Tarifs provisoires activés

À la demande du propriétaire, les tarifs unitaires de démonstration sont renseignés dans GIFT_UNIT_PRICES. GIFT_PRICES_PROVISIONAL reste true. Les notices visibles et le récapitulatif WhatsApp indiquent que ces montants doivent être confirmés.

Emballages provisoires par pack : classique 1 000 FCFA, personnalisé 2 000 FCFA, panier 3 500 FCFA (GIFT_WRAPPING). Le total inclut les articles ou le forfait exact de la grille, puis un emballage par pack ; il exclut livraison et éventuelle personnalisation des articles. Une formule modifiée est recalculée aux tarifs unitaires de démonstration. Le choix de l’emballage actualise immédiatement le prix.

Pour passer aux tarifs réels, remplacer GIFT_UNIT_PRICES et GIFT_WRAPPING, mettre GIFT_PRICES_PROVISIONAL à false, puis actualiser les options d’emballage et les notices de démonstration dans index.html. Ces données remplacent le statut « tarifs manquants » décrit dans les sections précédentes.
