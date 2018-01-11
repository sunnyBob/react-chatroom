import i18next from 'i18next';
import resources from './i18n';

window.i18next = i18next;
i18next.init({
  lng: 'zh',
  resources,
}, function(err, t) {
  window.t = t;
});
