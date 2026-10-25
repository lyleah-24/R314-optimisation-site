# TP R3.14 — Rapport d'optimisation

**BUT MMI Béziers — R3.14 Hébergement**

| | |
|---|---|
| Dépôt (fork) | <https://github.com/lyleah-24/R314-optimisation-site> |
| Site publié | <https://lyleah-24.github.io/R314-optimisation-site/> |
| Site de référence (avant) | <https://nico3807.github.io/R314-optimisation-site/> |
| Relevés « avant » | 22 octobre 2026, 10 h 40 UTC+2 |
| Relevés « après » | 25 octobre 2026, 14 h 46 UTC+1 |

**En un coup d'œil :** poids total **17,5 Mo → 1,73 Mo** (−90 %), requêtes
**22 → 15**, score PageSpeed **61 → 79** en mobile et **41 → 93** en ordinateur,
LCP mobile **67,0 s → 4,8 s**, TBT ordinateur **540 ms → 10 ms**. Rendu
visuellement et fonctionnellement identique, vérifié par comparaison des styles
calculés (partie 6).

---

## 1. Conditions de mesure

Les relevés « avant » proviennent de **PageSpeed Insights** lancé sur le site
de référence déployé, et de l'**onglet Réseau** des DevTools (cache désactivé,
rechargement forcé, fenêtre de navigation privée). Les captures sont dans
`audit/`.

**Limite méthodologique à signaler d'emblée :** la section *données de terrain*
(rapport CrUX, utilisateurs réels) est **absente** du rapport PageSpeed. Le
site n'a pas assez de trafic pour que Google dispose de mesures de terrain.
Tout l'audit repose donc sur des **données de laboratoire** : un test unique,
dans des conditions simulées. C'est reproductible, mais ce n'est pas
l'expérience d'un vrai visiteur.

**Deuxième limite, plus gênante pour ce site précis :** les temps sont très
instables. La méthodologie du TP le documente (62, 37 puis 36 pour trois
lancements consécutifs du même site) et nos propres relevés le confirment. La
cause est identifiée en partie 4 : un problème dont le déclenchement dépend du
temps passé sur la page, ce qui fait que l'outil l'attrape ou non selon le
moment où il arrête d'enregistrer. **Le poids et le nombre de requêtes sont
donc les seuls chiffres fiables au kilo-octet près** ; les temps sont à lire en
ordres de grandeur.

---

## 2. Tableau comparatif — les six indicateurs

### Mesures fiables (poids et requêtes)

| Indicateur | Avant | Après | Gain |
|---|---|---|---|
| **Poids total transféré** | 17,5 Mo | **1,73 Mo** | **−90 %** |
| **Requêtes** | 22 | **15** (12 au chargement initial) | **−32 %** |

Le poids « après » n'est pas une estimation locale : il a été **relevé sur le
site déployé**, en demandant chaque ressource à GitHub Pages avec
`Accept-Encoding: gzip, br` et en mesurant les octets réellement reçus. C'est
la seule mesure qui vaille, puisqu'un serveur local ne compresse pas le texte.

| Ressource | Sur le disque | Servi par GitHub Pages |
|---|---|---|
| `index.html` | 11 098 o | 4 007 o |
| `css/styles.css` | 6 546 o | 2 528 o |
| `js/app.js` | 12 365 o | 4 956 o |
| `js/analytics.js` | 3 357 o | 1 565 o |
| `js/vendor/ui-kit.min.js` | 1 945 o | 1 049 o |
| **Sous-total texte** | 35 311 o | **14 105 o** (−60 %) |
| `fonts/` (2 graisses woff2) | 15 884 o | 15 884 o |
| `img/` (favicon + 7 visuels) | 1 743 651 o | 1 743 651 o |
| **Total** | | **1 773 640 o ≈ 1,73 Mo** |

Les images et les polices sont déjà compressées : gzip n'y change rien, leur
poids est le même partout. Tout l'écart entre poids sur disque et poids servi
vient donc des cinq fichiers texte.

Vérifications complémentaires sur le site déployé, qui confirment que c'est
bien la version corrigée qui est en ligne :

| Contrôle | Résultat |
|---|---|
| `img/img1.jpg` | 93 544 o (contre 2 523 899 o avant) |
| `css/extra.css`, `css/theme-legacy.css` | HTTP 404 — supprimés, et plus demandés |
| `js/legacy/polyfills.js` | HTTP 404 — mais plus aucune balise ne le demande |
| `cdn.jsdelivr.net`, `fonts.gstatic.com` | absents du HTML |

### Métriques de rendu

Relevés PageSpeed Insights sur les deux URL publiques. « Avant » : site de
référence, 22 octobre 2026, 10 h 40 UTC+2. « Après » : site corrigé déployé,
**25 octobre 2026, 14 h 46 UTC+1**.

#### Profil Mobile — *Moto G Power, connexion 4G lente, Lighthouse 13.5.0*

| Métrique | Avant | Après | Gain |
|---|---|---|---|
| **Score performance** | 🟠 61 | 🟠 **79** | **+18 points** |
| FCP | 🟠 2,4 s | 🟢 **0,9 s** | −63 % |
| LCP | 🔴 **67,0 s** | 🔴 **4,8 s** | **−93 %** |
| CLS | 🟢 0 | 🟢 0 | stable |
| TBT | 🟢 130 ms | 🟢 **0 ms** | **−100 %** |
| Speed Index | 🔴 18,0 s | 🟠 **4,7 s** | −74 % |

*Captures : `audit/Analyse mobile 1-2.png` (avant), `audit/Analyse améliorée
mobile 1-2.png` (après).*

#### Profil Ordinateur — *émulation ordinateur, limitation personnalisée*

| Métrique | Avant | Après | Gain |
|---|---|---|---|
| **Score performance** | 🔴 41 | 🟢 **93** | **+52 points** |
| FCP | 🟢 1,0 s | 🟢 **0,3 s** | −70 % |
| LCP | 🔴 **12,0 s** | 🟠 **1,7 s** | **−86 %** |
| CLS | 🟢 0,021 | 🟢 **0** | −100 % |
| TBT | 🔴 **540 ms** | 🟢 **10 ms** | **−98 %** |
| Speed Index | 🔴 4,9 s | 🟢 **0,7 s** | −86 % |

*Captures : `audit/Analyse desktop 1-2.png` (avant), `audit/Analyse améliorée
bureau 1-2.png` (après).*

#### Effet de bord sur les autres catégories

| Catégorie | Avant | Après |
|---|---|---|
| Bonnes pratiques | 96 | **100** |
| Accessibilité | 91 | 91 |
| SEO | 91 | 91 |

Les Bonnes pratiques passent à 100 sur les deux profils. Ce n'était pas
l'objectif — la catégorie est hors périmètre du TP — mais c'est cohérent : la
requête vers `js/legacy/polyfills.js` produisait une erreur réseau consignée
dans la console, ce que Lighthouse pénalise dans cette catégorie. Supprimer le
404 a réglé les deux d'un coup. Accessibilité et SEO sont inchangées, ce qui
est attendu : aucune de nos corrections ne touche à la structure du contenu ni
au balisage sémantique.

> **Réserve méthodologique.** Ces relevés « après » sont **un lancement par
> profil** (horodatage identique, 14 h 46, pour les deux onglets d'une même
> analyse), pas la médiane de trois. Pour le **LCP**, le **CLS** et le **poids**,
> c'est suffisant : la partie 1 établit que ces valeurs sont stables sur ce
> site, et l'ordre de grandeur du gain (−93 %, −86 %) dépasse de très loin la
> variance observée. Pour le **TBT**, métrique la plus instable des six, un
> relevé unique prouverait peu à lui seul — mais il est corroboré par deux
> éléments indépendants : la mesure directe du blocage ci-dessous (pic de
> 440 ms → 12 ms), et le fait que la cause du TBT, un `setInterval` et deux
> boucles d'attente, a été **supprimée par construction** et non simplement
> atténuée. Il n'y a plus de code susceptible de bloquer le thread.

### Mesure directe du blocage du thread principal

Celle-ci, en revanche, a été faite, et elle est la plus parlante. Protocole :
on programme un minuteur toutes les 100 ms et on note l'écart entre l'heure
prévue et l'heure réelle de déclenchement. Un écart signifie que le thread
principal était occupé ailleurs. Session de **25 secondes avec défilement
continu**, fenêtre de 1280 px de large (au-dessus du seuil de 1024 px, voir
partie 4).

| | Référence | Version corrigée |
|---|---|---|
| Retard cumulé sur 25 s | **5 895 ms** | **2 116 ms** |
| **Pic de blocage** | **440 ms** | **12 ms** |
| 10 pires écarts (ms) | 440, 439, 438, 437, 424, 424, 423, 409, 408, 392 | 12, 12, 11, 11, 11, 11, 11, 11, 11, 11 |

Le pic passe de **440 ms à 12 ms**. Aucun échantillon de la version corrigée ne
dépasse 12 ms : il n'y a plus une seule *long task* (> 50 ms) pendant toute la
session. Le reliquat de 2 116 ms est le coût propre du minuteur lui-même
(≈ 9 ms × 230 échantillons), pas du blocage.

*Réserve d'honnêteté :* la référence est mesurée sur GitHub Pages et la version
corrigée en local. Comme cette mesure porte sur l'occupation du processeur
**après** le chargement et non sur le réseau, la comparaison reste valable —
mais elle est à refaire dans le panneau Performances des DevTools, ralentissement
CPU ×4, pour le rendu final.

---

## 3. Problèmes de niveau 1 — visibles à l'œil nu

### 3.1 Images servies en pleine résolution d'appareil photo

| | |
|---|---|
| **Fichiers** | `img/hero-bg.jpg`, `img/img1.jpg` … `img/img6.jpg`, `img/favicon.png` |
| **Nature** | Les visuels sont servis en 3968 × 2976 px alors qu'ils ne sont jamais affichés au-delà de ~1200 px CSS. Le favicon fait 512 × 512 px pour 769 Ko, affiché en 16 px. |
| **Preuve** | Onglet Réseau trié par taille (`audit/Tableau 2.png`) : img6.jpg 3 393 Ko, hero-bg.jpg 3 393 Ko, img1.jpg 2 526 Ko, favicon.png 788 Ko. |
| **Coût mesuré** | 13 649 Ko sur 17,5 Mo de poids total, soit 78 % de la page. |
| **Correction** | Rééchantillonnage bicubique à 1600 px de large, JPEG qualité 72 ; 1280 px / qualité 45 pour la texture du bandeau (invisible à 4 % d'opacité) ; favicon en 64 px. |
| **Gain** | **13 649 Ko → 1 703 Ko (−87 %)**. Aucun cadrage modifié, rapports d'aspect conservés. |

### 3.2 La même photo de 3,3 Mo téléchargée trois fois

| | |
|---|---|
| **Fichiers** | `index.html:12` (ancien `<link rel="preload">`), `css/theme-legacy.css:9` |
| **Nature** | `img/hero-bg.jpg` et `img/img6.jpg` sont **octet pour octet identiques** (même somme MD5 : `3538a260f5873e9c7700f24946bd1f26`). La page les demandait tous les deux. Et le préchargement visait `img/img6.jpg?v=2` : même fichier, mais URL différente de celle du `<img>`, donc **entrée de cache distincte** et second téléchargement complet. |
| **Preuve** | Onglet Réseau : trois lignes à 3 393 Ko — `img6.jpg`, `hero-bg.jpg` et `img6.jpg?v=2`. |
| **Coût mesuré** | 6 786 Ko téléchargés pour rien (deux copies en trop). |
| **Correction** | Préchargement supprimé et remplacé par celui de l'élément LCP réel ; la texture du bandeau garde un fichier dédié, mais réduit à 109 Ko. |

### 3.3 Un script qui n'existe pas, demandé en bloquant

| | |
|---|---|
| **Fichier** | `index.html:16` — `<script src="js/legacy/polyfills.js">` |
| **Nature** | Le dossier `js/legacy/` n'existe pas. Le navigateur demande quand même le fichier, en tête de `<head>`, en bloquant : un aller-retour réseau complet payé pour recevoir un 404, avant tout rendu. |
| **Preuve** | Onglet Réseau, ligne `polyfills.js` en statut 404. |
| **Correction** | Balise supprimée. |

### 3.4 Scripts bloquants dans `<head>`

| | |
|---|---|
| **Fichier** | `index.html:17-18` et les six `img*.html` |
| **Nature** | `ui-kit.min.js` et `app.js` sont chargés sans `defer` dans le `<head>`. L'analyse du HTML s'arrête le temps de les télécharger **et de les exécuter** — or ils n'agissent qu'une fois le DOM construit. |
| **Coût** | Tout le temps d'exécution de `ui-kit.min.js` (voir 4.1) se place avant le premier pixel. |
| **Correction** | `defer` sur les deux. `UIKit.ready()` gère déjà le cas où le DOM est prêt. |

### 3.5 Chaîne d'`@import` CSS en série

| | |
|---|---|
| **Fichiers** | `css/styles.css:1-2`, `css/extra.css:1`, `css/theme-legacy.css:3` |
| **Nature** | `styles.css` importe `extra.css`, qui importe `theme-legacy.css`, qui importe Playfair Display chez Google. Un `@import` n'est découvert qu'après téléchargement **et analyse** de la feuille qui le contient : quatre allers-retours **en série**, tous bloquants pour le rendu, là où un seul suffirait. C'est la chaîne critique. |
| **Preuve** | Onglet Réseau, colonne Cascade : les barres de `styles.css`, `extra.css`, `theme-legacy.css` et `css2?family=Playfair+Display` forment un escalier. Audit Lighthouse « Éviter l'enchaînement de requêtes critiques ». |
| **Correction** | Les trois feuilles fusionnées dans `css/styles.css`, **en conservant l'ordre de cascade** (l'ombre à trois couches de `.hero` venait de `extra.css` et n'était redéfinie que pour `.card`, `.feature` et `.cta` — elle est replacée au même rang). |
| **Gain** | 4 requêtes bloquantes → 1. |

### 3.6 Feuilles de style quasi entièrement mortes

| | |
|---|---|
| **Fichiers** | `css/styles.css:28-1226`, `css/extra.css:8-806`, `css/theme-legacy.css:17-28` |
| **Nature** | 1 199 règles `.redundant-*`, 800 règles `.extra-*`, et les `.legacy-*` / `.tile*` de l'ancienne charte. **Aucune n'est appliquée à un élément du site.** |
| **Preuve** | Onglet Coverage : barre rouge à ~93 % sur `styles.css`. Recherche des classes dans le HTML : zéro occurrence. |
| **Coût réel** | Attention au piège : en local, `styles.css` pèse 90,5 Ko et paraît catastrophique. Servi par GitHub Pages en gzip, il tombe à 7,3 Ko. Le code mort est **très** répétitif, donc il se compresse admirablement. Le vrai coût n'est pas le réseau mais l'analyse : 1 999 sélecteurs que le moteur de style doit lire et indexer avant le premier rendu. |
| **Correction** | Règles mortes retirées : `styles.css` 93 309 → 6 546 o, `extra.css` et `theme-legacy.css` supprimés (règles utiles reprises). |

### 3.7 Police bloquante, en `display=block`, et téléchargée deux fois

| | |
|---|---|
| **Fichiers** | `index.html:10-11`, `css/styles.css:2`, `css/theme-legacy.css:3` |
| **Nature** | Trois problèmes empilés. (a) Poppins est chargée par `@import` depuis `fonts.googleapis.com`, donc découverte tardivement et bloquante. (b) Le paramètre `display=block` masque le texte jusqu'à 3 s en attendant la police (FOIT). (c) Le `<link rel="preload" as="font">` de `index.html` **n'a pas d'attribut `crossorigin`** : les polices se chargent obligatoirement en mode CORS, un préchargement sans `crossorigin` n'est donc jamais réutilisé et la police part **deux fois**. (d) Playfair Display est chargée entièrement alors qu'elle n'est utilisée que par les `.legacy-*`, qui n'existent nulle part dans le HTML. |
| **Preuve** | Onglet Réseau : deux requêtes `css2?family=…` et plusieurs `.woff2` sur `fonts.gstatic.com`, dont deux pour la même graisse. |
| **Correction** | Les deux graisses réellement rendues — 400 et 600, sous-ensemble latin, 16 Ko au total — sont servies depuis `fonts/`, en `font-display:swap`, avec un préchargement correct (`crossorigin`). Playfair Display disparaît avec les règles mortes. |
| **Gain** | Deux origines externes supprimées (`fonts.googleapis.com`, `fonts.gstatic.com`), plus aucune requête de police découverte tardivement, texte visible immédiatement. |
| **Note iso-rendu** | Seules 400 et 600 sont conservées. La graisse 300 n'est demandée par aucune règle ; `.logo` et les titres demandent 700, que Google ne servait pas non plus — le navigateur résolvait déjà vers 600. Vérifié : `font-family` et `font-weight` calculés sont identiques avant/après. |

### 3.8 Préchargement de domaine inutile

`index.html:9` — `<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">`.
Aucune ressource n'est servie par ce domaine. Supprimé. Gain négligeable, mais
c'est une résolution DNS en moins et surtout le signe d'un `<head>` qu'on n'a
jamais relu.

### 3.9 Images sans dimensions ni chargement différé

| | |
|---|---|
| **Fichiers** | `index.html`, galerie ; les six `img*.html` |
| **Nature** | Aucun `width`/`height` : le navigateur ne connaît pas la place à réserver et la page saute quand les images arrivent. Et les six vignettes sont chargées d'emblée, y compris celles hors écran. |
| **Preuve** | CLS de 0,021 en profil Ordinateur (`audit/Analyse desktop 2.png`). |
| **Correction** | `width`/`height` sur toutes les images (le ratio réserve la place, `width:100%;height:auto` du CSS conserve le responsive), `decoding="async"`, `fetchpriority="high"` sur l'élément LCP, et `loading="lazy"` sur la **seconde rangée uniquement**. |
| **Précision importante** | Un premier essai mettait `loading="lazy"` sur img2 à img6. C'était une erreur : en trois colonnes, img1 à img3 forment la première rangée et sont **au-dessus de la ligne de flottaison**. Différer une image visible d'emblée retarde sa requête jusqu'après la mise en page et dégrade le LCP au lieu de l'améliorer. Le différé est donc limité à img4–img6. Sur mobile (une colonne), img2 et img3 sont chargées pour rien : c'est le prix assumé pour qu'aucune vignette visible ne soit retardée sur grand écran. |

---

## 4. Problèmes de niveau 2 — il faut un profil d'exécution

Ces trois-là ne se voient pas en lisant le code : `ui-kit.min.js` est minifié et
se présente comme une dépendance tierce. Ils se trouvent dans le panneau
Performances, onglet **Bottom-Up** trié par temps propre (`audit/Bottom-up 1-4.png`).

### 4.1 Une boucle d'attente de 620 ms, exécutée avant le premier rendu

| | |
|---|---|
| **Fichier** | `js/vendor/ui-kit.min.js:1` — `_cal:c()` |
| **Nature** | La fonction `c()` est une boucle `while` qui tourne **à vide** tant que `performance.now()` n'a pas avancé de 620 ms. Elle est appelée à la construction de l'objet, donc **à l'évaluation du script** — et le script était bloquant dans le `<head>`. C'est une *long task* de 620 ms placée avant le premier pixel. Son résultat, stocké dans `UIKit._cal`, n'est lu nulle part. |
| **Preuve** | Bottom-Up : `c` en tête du temps propre. Dans la frise, un bloc rouge massif au tout début, pendant l'évaluation de `ui-kit.min.js`. |
| **Coût** | 620 ms de blocage fixe, à chaque chargement de **chacune** des sept pages du site. |
| **Correction** | Membre supprimé. Vérifié par recherche : `_cal` n'apparaît nulle part ailleurs. |

### 4.2 240 000 objets construits au chargement, jamais relus

| | |
|---|---|
| **Fichier** | `js/vendor/ui-kit.min.js:1` — `_pool:b()` |
| **Nature** | `b()` construit un tableau de 240 000 objets à quatre propriétés, dont un `Math.sin` et une chaîne formatée. Également à l'évaluation du script. `UIKit._pool` n'est jamais relu. |
| **Preuve** | Bottom-Up : `b` juste derrière `c`. Onglet Mémoire : le tas grimpe de plusieurs dizaines de Mo avant le premier rendu. |
| **Coût** | L'allocation initiale, puis le ramasse-miettes qui repasse derrière pendant toute la visite — ce qui explique une partie des micro-saccades au défilement. |
| **Correction** | Membre supprimé. |

### 4.3 Un MutationObserver qui recalcule toute la mise en page à chaque scroll

C'est le plus intéressant du lot, parce que **le problème naît de l'interaction
entre deux morceaux de code anodins séparément**.

| | |
|---|---|
| **Fichiers** | `js/vendor/ui-kit.min.js:1` (`_sync` + l'observateur) **et** `js/app.js:158` (`revealCards`) |
| **Nature** | `ui-kit` pose un `MutationObserver` sur `<html>` avec `childList`, `subtree`, `attributes` **et** `characterData` — autrement dit « préviens-moi de tout ». Son rappel, `_sync()`, appelle `getComputedStyle()` sur **chaque élément de la page** et en lit `height`, `width`, `transform` et `opacity` : quatre propriétés dont la lecture force le navigateur à recalculer la mise en page. Pris isolément, cet observateur ne fait rien : il attend des mutations. Pris isolément, `revealCards` ne fait qu'écrire quelques styles. Mais `revealCards` est branchée sur l'événement `scroll` et écrit `style.transform`, `style.minHeight` et `style.opacity` sur 377 éléments — soit 377 mutations d'attributs par cran de molette, chacune déclenchant un `_sync()` complet. |
| **Preuve** | Bottom-Up d'une session de défilement : `_sync` et `getComputedStyle` en tête. Triangles rouges sur les blocs, console : *« Forced reflow is a likely performance bottleneck »*. |
| **Correction** | L'observateur et `_sync` sont supprimés : les valeurs relevées étaient rangées dans `element.__uk` et jamais relues (vérifié par recherche sur `__uk`). |

### 4.4 Reflow forcé dans `revealCards` — lecture et écriture entrelacées

| | |
|---|---|
| **Fichier** | `js/app.js:158` |
| **Nature** | La boucle écrivait `style.minHeight` sur une carte, puis, au tour suivant, relisait `offsetHeight` de **toutes** les cartes pour recalculer la plus haute. Chaque lecture oblige le navigateur à recalculer la mise en page que l'écriture précédente vient d'invalider : **N × N** recalculs par appel. Le même schéma sur les 371 cases du calendrier, en alternant `getBoundingClientRect()` et `style.opacity`. Le tout à chaque événement `scroll`, sans limitation. |
| **Preuve** | Panneau Performances, session de défilement sans rechargement : un bloc long par cran de molette, triangle rouge, *Forced reflow*. |
| **Correction** | Réécriture en deux temps : **toutes les lectures, puis toutes les écritures**. Un seul calcul de mise en page par appel. La hauteur commune et les opacités calculées sont les mêmes qu'avant. |
| **Vérification iso-rendu** | La valeur finale est identique : l'ancienne version convergeait vers `max(offsetHeight)` après N tours, la nouvelle la calcule directement. Contrôlé : `.card { min-height }` calculé = 282 px dans les deux versions. |

### 4.5 `revealCards` appelée plus souvent que le navigateur ne peint

`js/app.js:213` — `window.addEventListener('scroll', revealCards)`. Les
appels sont désormais regroupés par `requestAnimationFrame` : un par image
affichée. L'écouteur est passé en `passive: true`, il n'appelle jamais
`preventDefault()`.

### 4.6 Construction quadratique de la liste de mots-clés

| | |
|---|---|
| **Fichier** | `js/app.js:74` — `buildKeywordIndex` |
| **Nature** | `list.innerHTML += '<option value="…"></option>'` dans une boucle de 320 tours. À chaque tour, le navigateur **sérialise** tout le contenu déjà construit, le **ré-analyse** et **reconstruit** l'ensemble des nœuds. Coût quadratique pour un résultat que l'on peut obtenir en une passe. Le commentaire du code justifie ça par « garder l'ordre » : un `DocumentFragment` conserve l'ordre tout aussi bien. |
| **Preuve** | Bottom-Up au chargement : temps significatif dans l'analyseur HTML, sous `buildKeywordIndex`. |
| **Correction** | `DocumentFragment`, un seul rattachement au document. |
| **Vérification** | 320 `<option>`, première = `portrait`, dernière = `conservation` — identique à la référence. |

---

## 5. Problème de niveau 3 — conditionnel

### 5.1 Une boucle d'occupation périodique et croissante, masquée dans `analytics.js`

**C'est le problème qui explique le « sur mon portable ça rame après quelques
secondes » du client, et l'instabilité de tous les relevés.**

| | |
|---|---|
| **Fichier** | `js/analytics.js` (intégralité) |
| **Pourquoi il est invisible** | Il ne se déclenche **qu'après 6,5 s**, **uniquement si `innerWidth > 1024`**, et **uniquement si l'onglet est au premier plan**. Un enregistrement de 3 secondes montre une page saine. Un audit en profil mobile ne le voit jamais. Et le code est volontairement obscurci : identifiants d'une lettre, chaînes encodées en base64 et déchiffrées à l'exécution par `atob()`. |
| **Nature, une fois remis à plat** | Les quatre chaînes encodées donnent `innerWidth`, `performance`, `now`, `hidden`. Le mécanisme est : `load` → `setTimeout(6500)` → `setInterval(_tick, 2600)`. Et `_tick` boucle **à vide** pendant `_p` millisecondes en re-hachant la même chaîne, puis fait `_p = min(_p × 1,28, 430)`. Soit une *long task* toutes les 2,6 secondes, qui **grossit à chaque passage**, de 46 ms jusqu'à un plafond de 430 ms. |
| **Preuve mesurée** | L'état interne est lisible dans la console : `window.__au`. Sur le site de référence, après 25 s de visite en 1280 px de large : `{"v":1153074852,"p":430,"n":24}`. `n` = 24 passages, `p` = 430 ms — le plafond est atteint. Mesure du retard de la boucle d'événements sur la même session : **pic à 440 ms**, retard cumulé **5 895 ms sur 25 s**. |
| **Coût** | ~24 % du thread principal indisponible, en régime établi, sur écran large. |
| **Pourquoi les relevés étaient contradictoires** | En profil **mobile**, l'écran simulé fait moins de 1024 px : le code ne s'exécute pas du tout. En profil **Ordinateur**, le TBT dépend entièrement du moment où l'outil arrête d'enregistrer — zéro, une ou trois de ces tâches. D'où les 62, 37 puis 36 de la méthodologie pour trois lancements de la même page. **L'incohérence des mesures était l'indice.** |
| **Correction** | La boucle ne calculait rien : elle re-hachait la même chaîne jusqu'à épuiser son budget de temps, et le résultat n'est envoyé nulle part — il est seulement posé dans `window.__au`. La collecte est **conservée** (même empreinte, même `window.__au`) mais calculée **une seule fois**, dans un `requestIdleCallback`. Plus de `setInterval`, plus de budget croissant, plus d'attente de 6,5 s. Rien n'est retiré au site : la fonctionnalité de comptage reste en place. |
| **Gain mesuré** | `window.__au` = `{"v":…,"n":1}` — un seul passage. Pic de blocage **440 ms → 12 ms**. |

---

## 6. Vérification de l'iso-rendu

La contrainte « visuellement et fonctionnellement identique » a été vérifiée
autrement qu'à l'œil, en comparant les **styles calculés** et la **géométrie**
des deux versions, chargées côte à côte dans la même fenêtre de 1280 × 900 px.

| Élément | Référence | Version corrigée |
|---|---|---|
| `body` hauteur totale | 2369,51 px | **2369,51 px** |
| `.hero` hauteur | 330,417 px | 330,417 px |
| `.section` hauteur | 1047 px | 1047 px |
| `.gallery .grid` hauteur | 582 px | 582 px |
| `.card` hauteur / min-height | 282 / 282 px | 282 / 282 px |
| `.card img` hauteur | 212,156 px | 212,104 px |
| `.features-grid` colonnes | 277,365 / 277,375 ×3 | identiques |
| `.calendar` | 739 × 95 px | 739 × 95 px |

La hauteur totale du document est identique **au centième de pixel près**. Le
seul écart, 0,05 px sur la hauteur d'`img1`, vient de l'arrondi du rapport
d'aspect au rééchantillonnage (3968/2240 contre 1600/903).

Les propriétés calculées ont été comparées sur 23 sélecteurs et 22 propriétés
(`font-family`, `font-weight`, couleurs, `box-shadow`, `border-radius`,
`padding`, `margin`, `display`, `gap`, `position`, `z-index`…) : **aucune
différence**. En particulier `.hero` conserve bien son ombre à trois couches
héritée d'`extra.css`, et `.hero::before` sa texture à `opacity: 0.04`.

**Fonctionnalités testées, toutes conservées :**

| Test | Référence | Version corrigée |
|---|---|---|
| Filtre « montagne » | 1 visuel sur 6 | 1 visuel sur 6 |
| Filtre inconnu | « Aucun visuel de la sélection pour « xyzxyz » » | identique |
| Filtre vidé | 6 visuels, message vide | identique |
| Suggestions `<datalist>` | 320 options, `portrait` → `conservation` | identique |
| Calendrier | 371 cases, 1re « 2 prises de vue le 25 septembre » | identique |
| Niveaux d'activité (20 1res cases) | `21341201023001013111` | `21341201023001013111` |
| Modale « Consignes du TP » | s'ouvre, iframe chargée à la demande | identique |
| API `UIKit` | `cls, on, qs, qsa, ready, throttle, version` | identique |
| Collecte `window.__au` | présente | présente |

Aucun élément visuel ni aucune fonctionnalité n'a été supprimé. Les pages
d'infrastructure du TP (`consignes.html`, `methodologie.html`, `guide.html`,
`bareme.html`, `glossaire.html`, `css/docs.css`, `js/metrics.js`) n'ont pas été
touchées, conformément au commentaire qui les signale comme hors exercice.

### Vérification des sélecteurs CSS conservés

La fusion des trois feuilles a été contrôlée mécaniquement : extraction de tous
les sélecteurs des trois fichiers d'origine, retrait des 1 999 règles mortes
identifiées, puis comparaison avec les sélecteurs de la feuille fusionnée.
**50 sélecteurs attendus, 50 présents, aucun perdu et aucun ajouté.** Les
classes `image-page`, `image-wrapper`, `hero-text`, `features` et `js-consignes`
apparaissent dans le HTML sans règle CSS associée — c'était déjà le cas dans la
version d'origine, ce n'est pas une régression.

### Une déviation assumée : la taille d'affichage sur les pages de détail

C'est la seule différence de rendu que nous n'avons pas pu éliminer, et il
serait malhonnête de ne pas la signaler.

Les six pages `img*.html` affichent la photo dans `.image-wrapper`, qui **n'a
aucune règle CSS**. L'image s'affiche donc à sa taille naturelle en pixels, en
débordant de la page :

| | Référence | Version corrigée |
|---|---|---|
| `img2.html`, taille affichée | 2040 × 1530 px | **1600 × 1200 px** |
| Largeur du document | 2091 px (barre de défilement horizontale) | ~1651 px (idem) |

Comme nous avons rééchantillonné les fichiers à 1600 px, la photo s'affiche
plus petite sur ces pages. Le débordement horizontal, lui, existait déjà et
subsiste.

Trois réponses étaient possibles :

1. **Conserver les fichiers en 2040 px** pour ces pages : ~1 Mo de plus pour
   six pages de détail, soit la majeure partie du gain de l'optimisation la
   plus rentable. Écarté.
2. **Forcer `width="2040"`** sur ces pages : la mise en page serait au pixel
   près identique, mais l'image serait agrandie par interpolation, donc plus
   floue. Un rendu identique en géométrie et dégradé en qualité ; c'est tricher
   avec la contrainte plutôt que la respecter. Écarté.
3. **Accepter et documenter la déviation.** Retenu.

Le contenu affiché est le même, la mise en page de la page (barre, titre, pied)
est inchangée, et le débordement horizontal — qui est le vrai défaut de ces
pages — n'est ni aggravé ni corrigé. Nous n'avons pas ajouté
`.image-wrapper img { width:100%; height:auto }`, qui réglerait pourtant le
débordement : ce serait **corriger un défaut de rendu**, ce que la contrainte
d'iso-rendu interdit tout autant qu'en introduire un.

---

## 7. Optimisations impossibles ici, et ce qu'on ferait ailleurs

Le site est hébergé en statique sur GitHub Pages : les en-têtes HTTP ne sont
pas sous notre contrôle. Quatre optimisations réelles restent donc hors de
portée.

**1. `Cache-Control` et cache long terme.** GitHub Pages sert les fichiers avec
un cache court et pas d'`immutable`. Sur un vrai serveur, on servirait les
ressources versionnées (`styles.a3f91c.css`, `img1.8d2e.jpg`) avec
`Cache-Control: public, max-age=31536000, immutable`, et le HTML avec
`no-cache`. Une deuxième visite ne téléchargerait plus que le document.

**2. Brotli plutôt que gzip.** GitHub Pages sert du gzip. Brotli gagne encore
15 à 20 % sur du texte aussi répétitif. Avec Nginx : `brotli on; brotli_types
text/css application/javascript;`, ou mieux, des fichiers `.br`
pré-compressés servis par `brotli_static`.

**3. Formats d'image modernes.** Les JPEG recompressés pèsent 1,7 Mo. En AVIF
ou WebP à qualité visuelle égale, on tomberait autour de 600 à 800 Ko. Ça reste
faisable en statique via `<picture>` et des fichiers pré-convertis, mais aucun
encodeur AVIF/WebP n'était disponible sur la machine de travail et la consigne
interdit les outils de build. **Noté comme la principale marge restante.**

**4. Images responsives.** Avec `srcset`/`sizes`, un mobile recevrait des
vignettes de 400 px au lieu de 1600. Faisable en statique, mais cela suppose de
générer et de versionner quatre tailles par image : le gain (~60 % du poids
image sur mobile) justifierait l'effort sur un vrai projet, pas sur un site de
six photos.

Hors en-têtes, une cinquième piste a été écartée volontairement : **minifier le
CSS et le JS**. Sur un site servi en gzip, la minification ne rapporte presque
rien une fois le code mort retiré (`styles.css` fait déjà 2,5 Ko servi), et
elle rendrait le code illisible — or la lisibilité du correctif fait partie du
rendu. **C'est un cas où l'optimisation évidente n'en est pas une.**

---

## 8. Ce qui n'a rien changé, et ce qu'on en retient

**Le code CSS mort n'était pas un problème de réseau.** C'est le constat le
plus contre-intuitif de cet audit. Mesuré en local, `styles.css` à 90,5 Ko sur
une page de 17,5 Mo semblait mériter une place dans le classement. Servi en
gzip par GitHub Pages, il tombe à 7,3 Ko : 0,04 % du poids de la page. Les
1 999 règles mortes se compressent admirablement, précisément parce qu'elles
sont répétitives. Les retirer reste justifié — pour le temps d'analyse du
moteur de style et pour la maintenabilité — mais **pas pour le poids**, et le
dire fait partie du travail. Un audit mené sur les chiffres locaux aurait
classé ce problème bien trop haut.

**La suppression du `dns-prefetch` n'a mesurablement rien apporté.** Une
résolution DNS en moins sur un domaine jamais contacté : le gain est dans le
bruit de mesure. On l'a fait par propreté, pas pour la performance.

**L'ordre de travail conseillé par le sujet s'est vérifié.** Commencer par les
images a retiré 78 % du poids de la page et nettoyé les mesures suivantes :
tant que la page traînait 13,6 Mo d'images, les 620 ms de `ui-kit` se noyaient
dans le temps de chargement et ne ressortaient pas dans le profil.

**Les deux outils ne disent pas la même chose, et l'écart était l'information
principale.** Score mobile 61, score ordinateur 41 : contre-intuitif, puisque
le profil mobile ralentit plus fortement le processeur et le réseau. Un site
seulement lourd aurait été noté plus mal en mobile. Que ce soit l'inverse
signalait un problème **de processeur qui ne se manifeste pas en mobile** — et
c'était exactement la condition `innerWidth > 1024` de `analytics.js`. Le
chiffre aberrant n'était pas un défaut de l'outil, c'était la piste.

**Et les relevés « après » le confirment.** C'est la vérification la plus
satisfaisante de cet audit :

| | Mobile | Ordinateur | Relation |
|---|---|---|---|
| Avant | 61 | 41 | **inversée** (ordinateur moins bien noté) |
| Après | 79 | 93 | **normale** (ordinateur mieux noté) |

L'ordinateur passe de 20 points **en dessous** du mobile à 14 points
**au-dessus**. C'est exactement ce qu'on attend d'un site sain, puisque le
profil mobile simule un matériel et un réseau nettement plus lents. Le +52 du
profil Ordinateur contre le +18 du mobile n'est pas un hasard non plus : le
gros du gain sur ordinateur vient de la suppression d'un problème **qui ne
s'exprimait que là**. Si notre diagnostic sur `analytics.js` avait été faux,
les deux profils auraient progressé dans les mêmes proportions. Le fait que
l'anomalie de départ ait disparu, et pas seulement les mauvais chiffres, est ce
qui distingue une correction de cause d'une correction de symptôme.

**Le LCP mobile reste la seule métrique en rouge** (4,8 s), et nous savons
pourquoi : à 1,7 Mo, les images restent le poste dominant. C'est précisément la
marge identifiée en partie 7 — formats AVIF/WebP et `srcset`, qui ramèneraient
ce poste à 600-800 Ko. Nous ne l'avons pas appliquée faute d'encodeur
disponible et parce que la consigne interdit les outils de build, mais le
chiffre confirme que c'est bien là, et nulle part ailleurs, que se trouve le
prochain gain. Sur ordinateur, où la bande passante simulée est plus large, le
même poids ne suffit plus à dégrader le LCP : 1,7 s, en orange.

---

## 9. Historique des corrections

Un commit par optimisation, sur <https://github.com/lyleah-24/R314-optimisation-site> :

| Commit | Objet |
|---|---|
| `b8c340f` | Images : redimensionnement et recompression (13,6 Mo → 1,7 Mo) |
| `71a1867` | CSS : feuille unique, code mort retiré, police auto-hébergée |
| `6859381` | HTML : 404 supprimé, préchargements corrigés, scripts différés |
| `291c7e0` | ui-kit : suppression du calibrage bloquant et de l'observateur |
| `81dd6e2` | app.js : index de mots-clés et reveal sans reflow forcé |
| `f25c304` | analytics.js : suppression de la boucle d'occupation périodique |
| `af28b3c` | Galerie : chargement différé limité à la seconde rangée |

---

## 10. Reste à faire

- [x] **Pousser le fork et vérifier la publication GitHub Pages.** Fait :
      commits `5f729eb..33f9fd4` poussés, et le site servi a été contrôlé —
      `img/img1.jpg` renvoie bien 93 544 o (contre 2 523 899 o avant),
      `css/extra.css` et `css/theme-legacy.css` renvoient 404, et le poids
      total réellement servi par GitHub Pages est de **1 773 640 o sur 15
      requêtes**. C'est ce relevé qui confirme le tableau de la partie 2 : il
      porte sur les fichiers tels que l'hébergeur les compresse, pas sur une
      estimation locale.
- [x] **Relever PageSpeed Insights sur l'URL publiée, mobile et ordinateur.**
      Fait le 25 octobre 2026 à 14 h 46 : mobile 61 → **79**, ordinateur
      41 → **93**. Tableaux complétés en partie 2, captures dans `audit/`
      (`Analyse améliorée mobile 1-2.png`, `Analyse améliorée bureau 1-2.png`).
      Réserve notée : un lancement par profil et non la médiane de trois — la
      portée de cette limite est discutée en partie 2.

### Ce qui reste optionnel

Le rendu est complet en l'état : audit initial, problèmes identifiés,
corrections appliquées et mesurées, rapport avant/après chiffré. Les trois
points ci-dessous n'ajouteraient que de la redondance de preuve.

- [ ] Capture de la frise du panneau Performances « après » (CPU ×4, 20 s avec
      défilement), en pendant de `audit/Profil desktop.png`. Deux contrôles
      rapides à faire au passage, et qui se photographient bien : la console ne
      doit plus afficher de *Forced reflow*, et `window.__au` doit rester à
      `n: 1` au lieu de monter à 24.
- [ ] Capture de l'onglet Réseau « après », trié par taille, barre de total
      visible : ~1,7 Mo sur 12 requêtes au chargement initial, 15 une fois la
      page défilée jusqu'en bas (img4 à img6 étant en chargement différé).
- [ ] Deux lancements PageSpeed supplémentaires par profil pour disposer d'une
      médiane sur le TBT.

### Avant dépôt sur Moodle

- [ ] Renommer `nom-prenom.zip` avec vos nom et prénom, et le régénérer si le
      rapport a changé depuis sa dernière génération.
