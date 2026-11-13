'use strict';
// Suggestions géographiques, pas une promesse de desserte. Liste non exhaustive.
// Douala : douala1.cm/histoire/ et Atlas du Cameroun (IRD).
const CAMEROON_CITIES = ['Douala','Yaoundé','Bafoussam','Bamenda','Bertoua','Buea','Buéa','Dschang','Ebolowa','Edéa','Foumban','Foumbot','Garoua','Kribi','Kumba','Limbé','Limbe','Maroua','Ngaoundéré','Nkongsamba','Bafang','Bafia','Bangangté','Banyo','Batouri','Bélabo','Buea','Dibombari','Dizangué','Fontem','Guider','Kaélé','Kousséri','Loum','Manjo','Mbalmayo','Mbanga','Mbouda','Meiganga','Melong','Mora','Nanga-Eboko','Obala','Penja','Sangmélima','Tiko','Yabassi'];
const CAMEROON_DISTRICTS = {
 Douala: ['Akwa','Akwa Nord','Bali','Bépanda','Bessengue','Bonabéri','Bonamoussadi','Bonanjo','Bonapriso','Cité des Palmiers','Deido','Joss','Kotto','Logbessou','Logpom','Makepe','Ndogbong','Ndokoti','New Bell','Nylon'],
 'Yaoundé': ['Bastos','Essos','Mendong','Mvan','Mvog-Ada','Mvog-Mbi','Nlongkak','Omnisports'],
 Bafoussam: ['Tamdja'], 'Limbé': ['Bota','Down Beach'], Buea: ['Molyko','Great Soppo']
};
const normalizePlace = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/[’' -]/g,'').trim();
function suggestedDistricts(city) {
 const key=Object.keys(CAMEROON_DISTRICTS).find(name=>normalizePlace(name)===normalizePlace(city));
 return key ? CAMEROON_DISTRICTS[key] : [];
}
function deliveryAddress(city, district) {
 return `Cameroun · ${city.trim()}${district.trim() ? ` · ${district.trim()}` : ''}`;
}
(() => {
 const cities=[...new Set(CAMEROON_CITIES)].filter((city,index,all)=>all.findIndex(other=>normalizePlace(other)===normalizePlace(city))===index);
 // Listes natives : recherche au clavier et navigation tactile sans dépendance réseau.
 const cityList=document.createElement('datalist');cityList.id='cameroon-cities';
 for(const city of cities){const option=document.createElement('option');option.value=city;cityList.append(option);}
 document.body.append(cityList);
 for(const [cityId,districtId] of [['city','district'],['gift-city','gift-district'],['magazine-city','magazine-district']]) {
  const city=document.getElementById(cityId), district=document.getElementById(districtId);
  const list=document.createElement('datalist');list.id=`${districtId}-suggestions`;district.after(list);
  city.setAttribute('list','cameroon-cities');city.setAttribute('aria-describedby',`${cityId}-help`);
  district.setAttribute('list',list.id);district.setAttribute('aria-describedby',`${cityId}-help`);
  let previousCity=normalizePlace(city.value);
  const update=()=>{
   const current=normalizePlace(city.value);
   if(current!==previousCity){district.value='';previousCity=current;}
   const names=suggestedDistricts(city.value);
   list.replaceChildren(...names.map(name=>{const option=document.createElement('option');option.value=name;return option;}));
   district.disabled=!city.value.trim();
   district.placeholder=names.length?'Tapez ou choisissez un quartier':'Saisissez votre quartier';
  };
  city.addEventListener('input',update);city.addEventListener('change',update);
  city.form?.addEventListener('reset',()=>setTimeout(update,0));
  update();
 }
})();
