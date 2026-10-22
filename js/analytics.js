/* analytics.js — collecte d'audience anonyme (aucune donnée personnelle)
 *
 *  ── Ce qui a été corrigé ───────────────────────────────────────────
 *  La version d'origine était volontairement illisible : noms d'une
 *  lettre, chaînes encodées en base64 et déchiffrées à l'exécution par
 *  atob(). Une fois remises à plat, elles donnaient "innerWidth",
 *  "performance", "now" et "hidden".
 *
 *  Le comportement obtenu était le suivant :
 *
 *    window.addEventListener('load', ...)   -> attendre 6 500 ms
 *    puis setInterval(_tick, 2600)          -> toutes les 2,6 s
 *    _tick :  si l'onglet est caché         -> ne rien faire
 *             si innerWidth <= 1024         -> ne rien faire
 *             sinon : boucler à vide pendant _p ms en recalculant
 *                     l'empreinte du DOM, puis _p = min(_p * 1.28, 430)
 *
 *  Autrement dit : une long task qui ne démarre qu'après 6,5 s, qui ne
 *  se produit que sur les écrans de plus de 1024 px, qui ne se produit
 *  pas quand l'onglet est en arrière-plan — et qui grossit à chaque
 *  passage, de 46 ms jusqu'à 430 ms toutes les 2,6 s. C'est le « sur mon
 *  portable ça rame après quelques secondes » du client, et c'est aussi
 *  pourquoi deux lancements Lighthouse du même site donnaient 62 puis
 *  37 : selon le moment où l'outil arrête d'enregistrer, il attrape
 *  zéro, une ou trois de ces tâches.
 *
 *  La boucle `while` ne calculait rien d'utile : elle re-hachait la
 *  même chaîne en boucle jusqu'à épuisement de son budget de temps. Et
 *  rien n'est envoyé nulle part — le résultat n'est que posé dans
 *  window.__au.
 *
 *  Correction : la mesure est conservée, à l'identique dans son
 *  résultat, mais calculée une seule fois et pendant un temps mort du
 *  navigateur. Plus de setInterval, plus de budget de temps croissant,
 *  plus d'attente artificielle de 6,5 s.
 *  ───────────────────────────────────────────────────────────────────
 */
(function (w, d) {
  'use strict';

  /* Signature de la structure du document : balise, classes et id de
     chaque élément. */
  function signature() {
    var nodes = d.querySelectorAll('*');
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      out.push(nodes[i].tagName + '.' + nodes[i].className + '#' + nodes[i].id);
    }
    return out.join('~');
  }

  /* Empreinte djb2 de la signature. */
  function fingerprint(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }

  function collect() {
    w.__au = { v: fingerprint(signature()), n: 1 };
  }

  /* requestIdleCallback : le calcul attend que le navigateur n'ait
     plus rien de prioritaire à faire, il ne retarde donc ni le rendu
     ni les interactions. Repli sur un simple différé là où il n'est
     pas disponible (Safari). */
  w.addEventListener('load', function () {
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(collect, { timeout: 2000 });
    } else {
      w.setTimeout(collect, 200);
    }
  });
})(window, document);
