#!/usr/bin/env python3
"""Genera i file JSON statici delle traduzioni del menu aribrì."""

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/data/translations/_source.json"
OUT = ROOT / "src/data/translations"

UI = {
    "en": {
        "allergenListTitle": "ALLERGEN LIST",
        "allergensPresent": "Allergens:",
        "noFavorites": "No favorites yet. Tap the heart next to a dish to save it here.",
        "showFavorites": "Show favorites only",
        "showFullMenu": "Show full menu",
        "translationError": "Translation not available for this language.",
        "addFavorite": "Add to favorites",
        "removeFavorite": "Remove from favorites",
        "selectLanguage": "Select language",
        "tableServiceFee": "Table service: €2.5",
        "frozenProductNote": "* Product blast-frozen at origin",
        "treesSavedLabel": "Trees saved",
        "oxygenProducedLabel": "Kg. oxygen produced",
        "veganTag": "Vegan",
        "vegetarianTag": "Vegetarian",
    },
    "fr": {
        "allergenListTitle": "LISTE DES ALLERGÈNES",
        "allergensPresent": "Allergènes :",
        "noFavorites": "Aucun favori pour le moment. Touchez le cœur à côté d'un plat pour l'enregistrer ici.",
        "showFavorites": "Afficher uniquement les favoris",
        "showFullMenu": "Afficher le menu complet",
        "translationError": "Traduction non disponible pour cette langue.",
        "addFavorite": "Ajouter aux favoris",
        "removeFavorite": "Retirer des favoris",
        "selectLanguage": "Choisir la langue",
        "tableServiceFee": "Service à table : 2,5 €",
        "frozenProductNote": "* Produit abattu à l'origine",
        "treesSavedLabel": "Arbres sauvés",
        "oxygenProducedLabel": "Kg. oxygène produits",
        "veganTag": "Végétalien",
        "vegetarianTag": "Végétarien",
    },
    "de": {
        "allergenListTitle": "ALLERGENLISTE",
        "allergensPresent": "Allergene:",
        "noFavorites": "Noch keine Favoriten. Tippen Sie auf das Herz neben einem Gericht, um es hier zu speichern.",
        "showFavorites": "Nur Favoriten anzeigen",
        "showFullMenu": "Gesamtes Menü anzeigen",
        "translationError": "Übersetzung für diese Sprache nicht verfügbar.",
        "addFavorite": "Zu Favoriten hinzufügen",
        "removeFavorite": "Aus Favoriten entfernen",
        "selectLanguage": "Sprache wählen",
        "tableServiceFee": "Tischservice: 2,5 €",
        "frozenProductNote": "* Produkt am Ursprung schockgefrostet",
        "treesSavedLabel": "Gerettete Bäume",
        "oxygenProducedLabel": "Kg. produzierter Sauerstoff",
        "veganTag": "Vegan",
        "vegetarianTag": "Vegetarisch",
    },
    "es": {
        "allergenListTitle": "LISTA DE ALÉRGENOS",
        "allergensPresent": "Alérgenos:",
        "noFavorites": "Aún no hay favoritos. Toca el corazón junto a un plato para guardarlo aquí.",
        "showFavorites": "Mostrar solo favoritos",
        "showFullMenu": "Mostrar menú completo",
        "translationError": "Traducción no disponible para este idioma.",
        "addFavorite": "Añadir a favoritos",
        "removeFavorite": "Quitar de favoritos",
        "selectLanguage": "Seleccionar idioma",
        "tableServiceFee": "Servicio en mesa: 2,5 €",
        "frozenProductNote": "* Producto abatido en origen",
        "treesSavedLabel": "Árboles salvados",
        "oxygenProducedLabel": "Kg. oxígeno producidos",
        "veganTag": "Vegano",
        "vegetarianTag": "Vegetariano",
    },
}

RESTAURANT = {
    "en": {
        "subtitle": "Restaurant · Pizzeria · B&B",
        "notes": '<p>The foods served in this establishment and their seasonings may contain traces of ingredients classified as "allergens" that can cause allergies or intolerances in some people and may pose a health risk. Consumers, especially those with food allergies or intolerances, are therefore invited to make informed choices for their safety. Please ask our dining room staff for any questions or information.</p>',
    },
    "fr": {
        "subtitle": "Restaurant · Pizzeria · Chambres d'hôtes",
        "notes": "<p>Les aliments servis dans cet établissement et leurs assaisonnements peuvent contenir des traces d'ingrédients classés comme « allergènes » pouvant provoquer des allergies ou intolérances chez certaines personnes et constituer un danger pour la santé. Les consommateurs, en particulier ceux souffrant d'allergies ou d'intolérances alimentaires, sont invités à faire des choix éclairés pour leur sécurité. Adressez-vous à notre personnel de salle pour toute question ou information.</p>",
    },
    "de": {
        "subtitle": "Restaurant · Pizzeria · B&B",
        "notes": '<p>In den in diesem Betrieb servierten Lebensmitteln und deren Würzungen können Spuren von als "Allergene" eingestuften Zutaten enthalten sein, die bei manchen Personen Allergien oder Unverträglichkeiten auslösen und eine Gesundheitsgefahr darstellen können. Verbraucher, insbesondere Personen mit Nahrungsmittelallergien oder -unverträglichkeiten, werden daher eingeladen, informierte Entscheidungen für ihre Sicherheit zu treffen. Wenden Sie sich an unser Servicepersonal für Fragen oder Informationen.</p>',
    },
    "es": {
        "subtitle": "Restaurante · Pizzería · B&B",
        "notes": '<p>Los alimentos servidos en este establecimiento y sus condimentos pueden contener trazas de ingredientes clasificados como "alérgenos" que pueden provocar alergias o intolerancias en algunas personas y suponer un riesgo para la salud. Se invita a los consumidores, especialmente a quienes padecen alergias o intolerancias alimentarias, a tomar decisiones informadas para su seguridad. Consulte a nuestro personal de sala para cualquier pregunta o información.</p>',
    },
}

CATEGORIES = {
    "en": {
        "anti": "Appetizers",
        "trad": "Tradition Corner",
        "primi": "First Courses",
        "secon": "Main Courses",
        "cont": "Side Dishes",
        "ins": "Salad Bowls",
        "pizze": "Pizzas",
        "dolci": "Desserts",
        "bev": "Drinks",
        "vini": "Wines",
    },
    "fr": {
        "anti": "Entrées",
        "trad": "Coin Tradition",
        "primi": "Plats de pâtes",
        "secon": "Plats principaux",
        "cont": "Accompagnements",
        "ins": "Salades composées",
        "pizze": "Pizzas",
        "dolci": "Desserts",
        "bev": "Boissons",
        "vini": "Vins",
    },
    "de": {
        "anti": "Vorspeisen",
        "trad": "Traditionsecke",
        "primi": "Erste Gänge",
        "secon": "Hauptgerichte",
        "cont": "Beilagen",
        "ins": "Salatschüsseln",
        "pizze": "Pizzen",
        "dolci": "Desserts",
        "bev": "Getränke",
        "vini": "Weine",
    },
    "es": {
        "anti": "Entrantes",
        "trad": "Rincón de la tradición",
        "primi": "Primeros platos",
        "secon": "Segundos platos",
        "cont": "Guarniciones",
        "ins": "Ensaladas",
        "pizze": "Pizzas",
        "dolci": "Postres",
        "bev": "Bebidas",
        "vini": "Vinos",
    },
}

ALLERGENS = {
    "en": {
        "1": ("1-Gluten-containing cereals", "wheat, spelt, khorasan wheat, rye, barley, oats"),
        "2": ("2-Crustaceans", "shrimp, langoustines, lobsters, crabs, hermit crabs and similar"),
        "3": ("3-Eggs", "mayonnaise, omelettes, emulsifiers, egg pasta, sweet and savoury biscuits and cakes, ice cream and creams, etc."),
        "4": ("4-Fish", "including derivatives, i.e. all food products containing fish, even in small percentages"),
        "5": ("5-Peanuts and peanut products", "peanuts and peanut products"),
        "6": ("6-Soybeans and soy products", "soybeans and soy products"),
        "7": ("7-Milk and milk products", "yogurt, biscuits and cakes, ice cream and various creams. Including lactose"),
        "8": ("8-Nuts", "almonds, hazelnuts, common walnuts, cashews, pecans, Brazil and Queensland nuts, pistachios"),
        "9": ("9-Celery and derivatives", "present in pieces but also in preparations for soups, sauces and vegetable concentrates"),
        "10": ("10-Mustard and mustard products", "mustard and mustard products"),
        "11": ("11-Sesame seeds and sesame products", "sesame seeds and sesame products"),
        "12": ("12-Sulphur dioxide and sulphites", "sulphur dioxide and sulphites in concentrations above 10 mg/kg or 10 mg/litre"),
        "13": ("13-Lupin and lupin products", "lupin and lupin products"),
        "14": ("14-Molluscs", "canestrello, razor clams, scallops, mussels, clams, octopus and similar"),
    },
    "fr": {
        "1": ("1-Céréales contenant du gluten", "blé, épeautre, blé khorasan, seigle, orge, avoine"),
        "2": ("2-Crustacés", "crevettes, langoustines, homards, crabes, bernard-l'hermite et similaires"),
        "3": ("3-Œufs", "mayonnaise, omelettes, émulsifiants, pâtes aux œufs, biscuits et gâteaux salés ou sucrés, glaces et crèmes, etc."),
        "4": ("4-Poisson", "y compris les dérivés, c'est-à-dire tous les produits alimentaires contenant du poisson, même en faible proportion"),
        "5": ("5-Arachides et produits à base d'arachides", "arachides et produits à base d'arachides"),
        "6": ("6-Graines de soja et produits à base de soja", "graines de soja et produits à base de soja"),
        "7": ("7-Lait et produits à base de lait", "yaourt, biscuits et gâteaux, glaces et crèmes diverses. Lactose inclus"),
        "8": ("8-Fruits à coque", "amandes, noisettes, noix communes, noix de cajou, noix de pécan, noix du Brésil et du Queensland, pistaches"),
        "9": ("9-Céleri et dérivés", "présent en morceaux mais aussi dans les préparations pour soupes, sauces et concentrés végétaux"),
        "10": ("10-Moutarde et produits à base de moutarde", "moutarde et produits à base de moutarde"),
        "11": ("11-Graines de sésame et produits à base de sésame", "graines de sésame et produits à base de sésame"),
        "12": ("12-Anhydride sulfureux et sulfites", "anhydride sulfureux et sulfites en concentrations supérieures à 10 mg/kg ou 10 mg/litre"),
        "13": ("13-Lupin et produits à base de lupin", "lupin et produits à base de lupin"),
        "14": ("14-Mollusques", "canestrello, couteaux, pétoncles, moules, palourdes, poulpe et similaires"),
    },
    "de": {
        "1": ("1-Glutenhaltiges Getreide", "Weizen, Dinkel, Khorasan-Weizen, Roggen, Gerste, Hafer"),
        "2": ("2-Krebstiere", "Garnelen, Langusten, Hummer, Krabben, Paguristen und ähnliche"),
        "3": ("3-Eier", "Mayonnaise, Omeletts, Emulgatoren, Eiernudeln, süße und herzhafte Kekse und Kuchen, Eis und Cremes usw."),
        "4": ("4-Fisch", "einschließlich Derivate, d.h. alle Lebensmittel, die Fisch enthalten, auch in geringen Mengen"),
        "5": ("5-Erdnüsse und Erdnussprodukte", "Erdnüsse und Erdnussprodukte"),
        "6": ("6-Sojabohnen und Sojaprodukte", "Sojabohnen und Sojaprodukte"),
        "7": ("7-Milch und Milchprodukte", "Joghurt, Kekse und Kuchen, Eis und verschiedene Cremes. Einschließlich Laktose"),
        "8": ("8-Schalenfrüchte", "Mandeln, Haselnüsse, Walnüsse, Cashewnüsse, Pekannüsse, Paranüsse und Queenslandnüsse, Pistazien"),
        "9": ("9-Sellerie und Derivative", "in Stücken vorhanden, aber auch in Zubereitungen für Suppen, Saucen und Gemüsekonzentrate"),
        "10": ("10-Senf und Senfprodukte", "Senf und Senfprodukte"),
        "11": ("11-Sesamsamen und Sesamprodukte", "Sesamsamen und Sesamprodukte"),
        "12": ("12-Schwefeldioxid und Sulfite", "Schwefeldioxid und Sulfite in Konzentrationen über 10 mg/kg oder 10 mg/Liter"),
        "13": ("13-Lupinen und Lupinenprodukte", "Lupinen und Lupinenprodukte"),
        "14": ("14-Weichtiere", "Canestrello, Messermuscheln, Jakobsmuscheln, Miesmuscheln, Venusmuscheln, Oktopus und ähnliche"),
    },
    "es": {
        "1": ("1-Cereales con gluten", "trigo, espelta, trigo khorasan, centeno, cebada, avena"),
        "2": ("2-Crustáceos", "gamba, cigala, langosta, cangrejo, paguro y similares"),
        "3": ("3-Huevos", "mayonesa, tortilla, emulsionantes, pasta al huevo, galletas y pasteles dulces y salados, helados y cremas, etc."),
        "4": ("4-Pescado", "incluidos los derivados, es decir, todos los productos alimenticios que contienen pescado, aunque sea en pequeñas cantidades"),
        "5": ("5-Cacahuetes y productos a base de cacahuetes", "cacahuetes y productos a base de cacahuetes"),
        "6": ("6-Soja y productos a base de soja", "soja y productos a base de soja"),
        "7": ("7-Leche y productos lácteos", "yogur, galletas y pasteles, helado y cremas varias. Incluida la lactosa"),
        "8": ("8-Frutos de cáscara", "almendras, avellanas, nueces comunes, anacardos, nueces pecanas, nueces de Brasil y de Queensland, pistachos"),
        "9": ("9-Apio y derivados", "presente en trozos pero también en preparados para sopas, salsas y concentrados vegetales"),
        "10": ("10-Mostaza y productos a base de mostaza", "mostaza y productos a base de mostaza"),
        "11": ("11-Semillas de sésamo y productos a base de sésamo", "semillas de sésamo y productos a base de sésamo"),
        "12": ("12-Dióxido de azufre y sulfitos", "dióxido de azufre y sulfitos en concentraciones superiores a 10 mg/kg o 10 mg/litro"),
        "13": ("13-Altramuces y productos a base de altramuces", "altramuces y productos a base de altramuces"),
        "14": ("14-Moluscos", "canestrello, navajas, vieiras, mejillones, almejas, pulpo y similares"),
    },
}

# item id -> (en, fr, de, es) for name; optional description tuple per lang appended after
ITEMS = {
    "2048800": (("Sporcamusi", "Sporcamusi", "Sporcamusi", "Sporcamusi"),),
    "2048801": (("Tonka Panna Cotta", "Panna cotta tonka", "Tonka-Panna-Cotta", "Panna cotta de tonka"),),
    "2048802": (("Cheesecake", "Cheesecake", "Cheesecake", "Tarta de queso"),),
    "2048803": (("Hazelnut & Chocolate Semifreddo", "Spumoncino noisette et chocolat", "Spumoncino Haselnuss und Schokolade", "Spumoncino avellana y chocolate"),),
    "2048804": (("Seasonal Fruit", "Fruits de saison", "Saisonobst", "Fruta de temporada"),),
    "2048805": (("Lemon Sorbet", "Sorbet au citron", "Zitronensorbet", "Sorbete de limón"),),
    "2048806": (("Cured Meats Board", "Plateau de charcuterie", "Wurstplatte", "Tabla de embutidos"),),
    "2048807": (("Cheese Board", "Plateau de fromages", "Käseplatte", "Tabla de quesos"),),
    "2048808": (("Tomato Bruschetta", "Bruschetta tomate", "Bruschetta mit Tomaten", "Bruschetta de tomate"),),
    "2048809": (("Mixed Land Fritters", "Friture mixte terre", "Gemischte Land-Frittiertes", "Fritura mixta de tierra"),),
    "2048810": (("Salentine Friselle", "Friselle salentine", "Salentinische Friselle", "Friselle salentinas"),),
    "2048811": (("Mixed Seafood Antipasto", "Antipasto mixte mer", "Gemischte Meeresvorspeise", "Antipasto mixto de mar"),),
    "2048812": (("Raw Seafood", "Crudités de mer", "Rohe Meeresfrüchte", "Crudos de mar"),),
    "2048813": (("Gratinated Mussels", "Moules gratinées", "Gratinierte Miesmuscheln", "Mejillones gratinados"),),
    "2048814": (("Peppered Mussels", "Moules au poivre", "Miesmuscheln mit Pfeffer", "Mejillones al peppe"),),
    "2048815": (("Seafood Salad", "Salade de fruits de mer", "Meeresfrüchtesalat", "Ensalada de mar"),),
    "2048816": (("Marinated Anchovies", "Anchois marinés", "Marinierte Sardellen", "Anchoas marinadas"),),
    "2048817": (("Capocollo & Burrata", "Capocollo et burrata", "Capocollo und Burrata", "Capocollo y burrata"),),
    "2048818": (("Fava Beans & Chicory", "Fèves et cicorie", "Saubohnen und Chicorée", "Habas y cicoria"),),
    "2048819": (("Orecchiette & Pizzarieddri", "Orecchiette et pizzarieddri", "Orecchiette und Pizzarieddri", "Orecchiette y pizzarieddri"),),
    "2048820": (("Ciciri e Tria", "Ciciri e tria", "Ciciri e Tria", "Ciciri e tria"),),
    "2048821": (("Eggplant Parmigiana", "Parmigiana d'aubergines", "Auberginen-Parmigiana", "Parmigiana de berenjena"),),
    "2048822": (("Horse Meat in Clay Pot", "Cheval à la pignata", "Pferdefleisch in Tontopf", "Carne de caballo a la pignata"),),
    "2048823": (("Turcinieddri", "Turcinieddri", "Turcinieddri", "Turcinieddri"),),
    "2048824": (("Octopus in Clay Pot", "Poulpe à la pignata", "Oktopus im Tontopf", "Pulpo a la pignata"),),
    "2048825": (("Aribri Cavatelli", "Cavatelli Aribri", "Aribri-Cavatelli", "Cavatelli Aribri"),),
    "2048826": (("Troccoli with Tomatoes & Burrata", "Troccoli tomates et burrata", "Troccoli mit Tomaten und Burrata", "Troccoli con tomates y burrata"),),
    "2048827": (("Gnocchi with Ricotta & Pesto", "Gnocchi ricotta et pesto", "Gnocchi mit Ricotta und Pesto", "Ñoquis con ricotta y pesto"),),
    "2048828": (("Grouper Ravioli", "Ravioli au mérou", "Ravioli mit Zackenbarsch", "Ravioli de mero"),),
    "2048829": (("Troccoli with Langoustines & Prawns", "Troccoli langoustines et crevettes", "Troccoli mit Langusten und Garnelen", "Troccoli con cigalas y gambas"),),
    "2048830": (("Scialatielli with Mussels", "Scialatielli aux moules", "Scialatielli mit Miesmuscheln", "Scialatielli con mejillones"),),
    "2048831": (("Gnocchi with Swordfish & Eggplant", "Gnocchi espadon et aubergines", "Gnocchi mit Schwertfisch und Auberginen", "Ñoquis con pez espada y berenjena"),),
    "2048832": (("Spaghetti with Clams", "Spaghetti aux palourdes", "Spaghetti mit Venusmuscheln", "Espaguetis con almejas"),),
    "2048833": (("Mixed Grilled Meats", "Grillade mixte de viande", "Gemischte Fleischgrillplatte", "Parrillada mixta de carne"),),
    "2048834": (("Roast Sausage", "Saucisse rôtie", "Gebratene Wurst", "Salchicha asada"),),
    "2048835": (
        ("Entrecôte Tagliata", "Tagliata d'entrecôte", "Entrecôte-Tagliata", "Tagliata de entrecot"),
        ("FRESH TOMATOES, GRANA, ARUGULA", "TOMATES FRAÎCHES, GRANA, ROQUETTE", "FRISCHE TOMATEN, GRANA, RUCOLA", "TOMATES FRESCOS, GRANA, RÚCULA"),
    ),
    "2048836": (("Veal Rib Steak", "Côte de veau", "Kalbskotelett", "Chuleta de ternera"),),
    "2048837": (
        ("Seared Tuna", "Thon saisi", "Thunfisch kurz angebraten", "Atún sellado"),
        ("SESAME SEEDS", "GRAINES DE SÉSAME", "SESAMSAMEN", "SEMILLAS DE SÉSAMO"),
    ),
    "2048838": (("Roast Prawns", "Gambas rôties", "Gebratene Riesengarnelen", "Gambones asados"),),
    "2048839": (("Fried Mixed Fish", "Friture de petits poissons", "Frittierte Fischmischung", "Fritura de pescadito"),),
    "2048840": (("Grilled Squid", "Calmar grillé", "Gegrillter Tintenfisch", "Calamar a la plancha"),),
    "2048841": (("Fried Squid & Prawns", "Friture calamars et crevettes", "Frittierte Tintenfische und Garnelen", "Fritura de calamares y gambas"),),
    "2048842": (("Fresh Fish of the Day", "Poisson frais du jour", "Frischer Fisch des Tages", "Pescado fresco del día"),),
    "2048843": (("Green Salad", "Salade verte", "Grüner Salat", "Ensalada verde"),),
    "2048844": (("Mixed Salad", "Salade mixte", "Gemischter Salat", "Ensalada mixta"),),
    "2048845": (("Seasonal Cooked Vegetables", "Légumes cuits de saison", "Saisonales Gemüse", "Verduras cocidas de temporada"),),
    "2048846": (("Giardiniera", "Giardiniera", "Giardiniera", "Giardiniera"),),
    "2048847": (("Grilled Vegetables", "Légumes grillés", "Gegrilltes Gemüse", "Verduras a la plancha"),),
    "2048848": (("Roast Potatoes", "Pommes de terre au four", "Ofenkartoffeln", "Patatas al horno"),),
    "2048849": (("French Fries", "Frites", "Pommes frites", "Patatas fritas"),),
    "2048869": (
        ("Gluten-Free Margherita", "Margherita sans gluten", "Margherita glutenfrei", "Margarita sin gluten"),
        ("TOMATO, MOZZARELLA", "TOMATE, MOZZARELLA", "TOMATE, MOZZARELLA", "TOMATE, MOZZARELLA"),
    ),
    "2048870": (
        ("Maxi Margherita", "Margherita maxi", "Margherita Maxi", "Margarita maxi"),
        ("TOMATO, MOZZARELLA", "TOMATE, MOZZARELLA", "TOMATE, MOZZARELLA", "TOMATE, MOZZARELLA"),
    ),
    "2048871": (
        ("Margherita", "Margherita", "Margherita", "Margarita"),
        ("TOMATO, MOZZARELLA, GREEN OLIVES", "TOMATE, MOZZARELLA, OLIVES VERTES", "TOMATE, MOZZARELLA, GRÜNE OLIVEN", "TOMATE, MOZZARELLA, ACEITUNAS VERDES"),
    ),
    "2048873": (
        ("Aribri", "Aribri", "Aribri", "Aribri"),
        ("TOMATO, MOZZARELLA, SPECK, ARUGULA, SPICY", "TOMATE, MOZZARELLA, SPECK, ROQUETTE, ÉPICÉ", "TOMATE, MOZZARELLA, SPECK, RUCOLA, SCHARF", "TOMATE, MOZZARELLA, SPECK, RÚCULA, PICANTE"),
    ),
    "2048880": (
        ("Diavola", "Diavola", "Diavola", "Diavola"),
        ("TOMATO, MOZZARELLA, SPICY SALAMI", "TOMATE, MOZZARELLA, SALAMI ÉPICÉ", "TOMATE, MOZZARELLA, SCHARFE SALAMI", "TOMATE, MOZZARELLA, SALAMI PICANTE"),
    ),
    "2048881": (
        ("Marinara", "Marinara", "Marinara", "Marinara"),
        ("TOMATO, GARLIC OIL, OREGANO", "TOMATE, HUILE À L'AIL, ORIGAN", "TOMATE, KNOBLAUCHÖL, OREGANO", "TOMATE, ACEITE DE AJO, ORÉGANO"),
    ),
    "2048882": (
        ("Bufala", "Bufala", "Bufala", "Búfala"),
        ("TOMATO, BUFFALO MOZZARELLA, BASIL", "TOMATE, MOZZARELLA DE BUFFLONNE, BASILIC", "TOMATE, BÜFFELMOZZARELLA, BASILIKUM", "TOMATE, MOZZARELLA DE BÚFALA, ALBAHACA"),
    ),
    "2048883": (
        ("Tuna & Onion", "Thon et oignon", "Thunfisch und Zwiebel", "Atún y cebolla"),
        ("TOMATO, MOZZARELLA, TUNA, ONION, OREGANO", "TOMATE, MOZZARELLA, THON, OIGNON, ORIGAN", "TOMATE, MOZZARELLA, THUNFISCH, ZWIEBEL, OREGANO", "TOMATE, MOZZARELLA, ATÚN, CEBOLLA, ORÉGANO"),
    ),
    "2048884": (
        ("Sausage", "Saucisse", "Wurst", "Salchicha"),
        ("TOMATO, MOZZARELLA, FRESH SAUSAGE", "TOMATE, MOZZARELLA, SAUCISSÉE FRAÎCHE", "TOMATE, MOZZARELLA, FRISCHE WURST", "TOMATE, MOZZARELLA, SALCHICHA FRESCA"),
    ),
    "2048885": (
        ("Porcini Mushrooms", "Porcini", "Steinpilze", "Porcini"),
        ("TOMATO, MOZZARELLA, PORCINI MUSHROOMS", "TOMATE, MOZZARELLA, CÈPES", "TOMATE, MOZZARELLA, STEINPILZE", "TOMATE, MOZZARELLA, SETAS PORCINI"),
    ),
    "2048887": (
        ("Frankfurters & Fries", "Saucisses et frites", "Würstchen und Pommes", "Salchichas y patatas fritas"),
        ("TOMATO, MOZZARELLA, FRANKFURTERS, FRENCH FRIES", "TOMATE, MOZZARELLA, SAUCISSES, FRITES", "TOMATE, MOZZARELLA, WÜRSTCHEN, POMMES FRITES", "TOMATE, MOZZARELLA, SALCHICHAS, PATATAS FRITAS"),
    ),
    "2048888": (
        ("Capricciosa", "Capricciosa", "Capricciosa", "Capricciosa"),
        ("TOMATO, MOZZARELLA, FRESH MUSHROOMS, ARTICHOKE HEARTS, COOKED HAM, GREEN OLIVES", "TOMATE, MOZZARELLA, CHAMPIGNONS FRAIS, CŒURS D'ARTICHAUT, JAMBON CUIT, OLIVES VERTES", "TOMATE, MOZZARELLA, FRISCHE CHAMPIGNONS, ARTISCHOCKENHERZEN, KOCHSCHINKEN, GRÜNE OLIVEN", "TOMATE, MOZZARELLA, CHAMPIÑONES FRESCOS, ALCACHOFAS, JAMÓN COCIDO, ACEITUNAS VERDES"),
    ),
    "2048889": (
        ("Four Seasons", "Quatre saisons", "Vier Jahreszeiten", "Cuatro estaciones"),
        ("TOMATO, MOZZARELLA, FRESH MUSHROOMS, ARTICHOKE HEARTS, COOKED HAM, GREEN OLIVES, SPICY SALAMI", "TOMATE, MOZZARELLA, CHAMPIGNONS FRAIS, CŒURS D'ARTICHAUT, JAMBON CUIT, OLIVES VERTES, SALAMI ÉPICÉ", "TOMATE, MOZZARELLA, FRISCHE CHAMPIGNONS, ARTISCHOCKENHERZEN, KOCHSCHINKEN, GRÜNE OLIVEN, SCHARFE SALAMI", "TOMATE, MOZZARELLA, CHAMPIÑONES FRESCOS, ALCACHOFAS, JAMÓN COCIDO, ACEITUNAS VERDES, SALAMI PICANTE"),
    ),
    "2048890": (
        ("Stracchino & Radicchio", "Stracchino et radicchio", "Stracchino und Radicchio", "Stracchino y radicchio"),
        ("TOMATO, MOZZARELLA, STRACCHINO, RADICCHIO", "TOMATE, MOZZARELLA, STRACCHINO, RADICCHIO", "TOMATE, MOZZARELLA, STRACCHINO, RADICCHIO", "TOMATE, MOZZARELLA, STRACCHINO, RADICCHIO"),
    ),
    "2048891": (
        ("Sausage & Friarielli", "Saucisse et friarielli", "Wurst und Friarielli", "Salchicha y friarielli"),
        ("TOMATO, MOZZARELLA, FRESH SAUSAGE, FRIARIELLI", "TOMATE, MOZZARELLA, SAUCISSÉE FRAÎCHE, FRIARIELLI", "TOMATE, MOZZARELLA, FRISCHE WURST, FRIARIELLI", "TOMATE, MOZZARELLA, SALCHICHA FRESCA, FRIARIELLI"),
    ),
    "2048892": (
        ("Seafood", "Fruits de mer", "Meeresfrüchte", "Frutti di mare"),
        ("TOMATO, MOZZARELLA, MUSSELS, SQUID, PRAWNS, PARSLEY", "TOMATE, MOZZARELLA, MOULES, CALAMARS, CREVETTES, PERSIL", "TOMATE, MOZZARELLA, MIESMUSCHELN, TINTENFISCH, GARNELEN, PETERSILIE", "TOMATE, MOZZARELLA, MEJILLONES, CALAMARES, GAMBAS, PEREJIL"),
    ),
    "2048893": (
        ("Garden & Sea", "Orto mare", "Garten und Meer", "Huerto y mar"),
        ("TOMATO, MOZZARELLA, ZUCCHINI, SHRIMP", "TOMATE, MOZZARELLA, COURGETTES, CREVETTES", "TOMATE, MOZZARELLA, ZUCHINI, GARNELEN", "TOMATE, MOZZARELLA, CALABACÍN, GAMBAS"),
    ),
    "2048894": (
        ("Valtellina", "Valtellina", "Valtellina", "Valtellina"),
        ("TOMATO, MOZZARELLA, BRESAOLA, ARUGULA, GRANA", "TOMATE, MOZZARELLA, BRESAOLA, ROQUETTE, GRANA", "TOMATE, MOZZARELLA, BRESAOLA, RUCOLA, GRANA", "TOMATE, MOZZARELLA, BRESAOLA, RÚCULA, GRANA"),
    ),
    "2048895": (
        ("Black Forest", "Forêt noire", "Schwarzwald", "Bosque negro"),
        ("TOMATO, MOZZARELLA, PORCINI MUSHROOMS, FRANKFURTERS, SPECK", "TOMATE, MOZZARELLA, CÈPES, SAUCISSES, SPECK", "TOMATE, MOZZARELLA, STEINPILZE, WÜRSTCHEN, SPECK", "TOMATE, MOZZARELLA, PORCINI, SALCHICHAS, SPECK"),
    ),
    "2048896": (
        ("Smoked", "Fumé", "Geräuchert", "Ahumada"),
        ("TOMATO, MOZZARELLA, SPECK, SMOKED SCAMORZA", "TOMATE, MOZZARELLA, SPECK, SCAMORZA FUMÉE", "TOMATE, MOZZARELLA, SPECK, GERÄUCHERTE SCAMORZA", "TOMATE, MOZZARELLA, SPECK, SCAMORZA AHUMADA"),
    ),
    "2048897": (
        ("Miss Italia", "Miss Italia", "Miss Italia", "Miss Italia"),
        ("TOMATO, MOZZARELLA, FRESH TOMATOES, ARUGULA", "TOMATE, MOZZARELLA, TOMATES FRAÎCHES, ROQUETTE", "TOMATE, MOZZARELLA, FRISCHE TOMATEN, RUCOLA", "TOMATE, MOZZARELLA, TOMATES FRESCOS, RÚCULA"),
    ),
    "2048904": (
        ("Sicilian", "Sicilienne", "Sizilianisch", "Siciliana"),
        ("TOMATO, MOZZARELLA, ANCHOVIES, FRIED EGGPLANT, OREGANO", "TOMATE, MOZZARELLA, ANCHOIS, AUBERGINES FRITES, ORIGAN", "TOMATE, MOZZARELLA, SARDELLEN, FRITTIERTE AUBERGINE, OREGANO", "TOMATE, MOZZARELLA, ANCHOAS, BERENJENA FRITA, ORÉGANO"),
    ),
    "2048905": (
        ("Four Cheeses", "Quatre fromages", "Vier Käse", "Cuatro quesos"),
        ("TOMATO, MOZZARELLA, SWISS, GORGONZOLA, GRANA", "TOMATE, MOZZARELLA, SUISSE, GORGONZOLA, GRANA", "TOMATE, MOZZARELLA, SCHWEIZER, GORGONZOLA, GRANA", "TOMATE, MOZZARELLA, SUIZO, GORGONZOLA, GRANA"),
    ),
    "2048906": (
        ("Napoli", "Napoli", "Neapel", "Nápoles"),
        ("TOMATO, MOZZARELLA, ANCHOVIES, OREGANO", "TOMATE, MOZZARELLA, ANCHOIS, ORIGAN", "TOMATE, MOZZARELLA, SARDELLEN, OREGANO", "TOMATE, MOZZARELLA, ANCHOAS, ORÉGANO"),
    ),
    "2048907": (
        ("Salentine Sunday", "Dimanche salentino", "Salentinischer Sonntag", "Domingo salentino"),
        ("SAN MARZANO TOMATO, FIOR DI LATTE, FRIED MEATBALLS, CACIORICOTTA", "TOMATE SAN MARZANO, FIOR DI LATTE, BOULETTES FRITES, CACIORICOTTA", "SAN-MARZANO-TOMATE, FIOR DI LATTE, FRITTIERTE FLEISCHBÄLLCHEN, CACIORICOTTA", "TOMATE SAN MARZANO, FIOR DI LATTE, ALBÓNDIGAS FRITAS, CACIORICOTTA"),
    ),
    "2048908": (
        ("Caprese 2.0", "Caprese 2.0", "Caprese 2.0", "Caprese 2.0"),
        ("SUN-DRIED TOMATO CREAM, YELLOW CHERRY TOMATOES, BUFFALO MOZZARELLA, OREGANO, BASIL", "CRÈME DE TOMATES SÉCHÉES, TOMATES CERISES JAUNES, MOZZARELLA DE BUFFLONNE, ORIGAN, BASILIC", "CREME AUS GETROCKNETEN TOMATEN, GELBE CHERRY-TOMATEN, BÜFFELMOZZARELLA, OREGANO, BASILIKUM", "CREMA DE TOMATES SECOS, TOMATES CHERRY AMARILLOS, MOZZARELLA DE BÚFALA, ORÉGANO, ALBAHACA"),
    ),
    "2048909": (
        ("All About Anchovies", "A tutta alici", "Alles mit Sardellen", "A tope con anchoas"),
        ("SAN MARZANO TOMATO, STRACCIATELLA, CANTABRIAN ANCHOVIES, LEMON ZEST", "TOMATE SAN MARZANO, STRACCIATELLA, ANCHOIS CANTABRIQUE, ZESTE DE CITRON", "SAN-MARZANO-TOMATE, STRACCIATELLA, KANTABRISCHE SARDELLEN, ZITRONENZESTE", "TOMATE SAN MARZANO, STRACCIATELLA, ANCHOAS DEL CANTÁBRICO, RALLADURA DE LIMÓN"),
    ),
    "2048910": (
        ("Signora Mortadella", "Signora Mortadella", "Signora Mortadella", "Signora Mortadella"),
        ("FIOR DI LATTE, PISTACHIO CREAM, MORTADELLA, CHOPPED PISTACHIOS", "FIOR DI LATTE, CRÈME DE PISTACHE, MORTADELLE, PISTACHES CONCASSÉES", "FIOR DI LATTE, PISTAZIENCREME, MORTADELLA, GEHACKTE PISTAZIEN", "FIOR DI LATTE, CREMA DE PISTACHO, MORTADELA, PISTACHO PICADO"),
    ),
    "2048912": (
        ("Taste of Valle d'Itria", "Sapore Valle d'Itria", "Geschmack des Valle d'Itria", "Sabor del Valle de Itria"),
        ("FIOR DI LATTE, YELLOW CHERRY TOMATOES, STRACCIATELLA, CAPOCOLLO", "FIOR DI LATTE, TOMATES CERISES JAUNES, STRACCIATELLA, CAPOCOLLO", "FIOR DI LATTE, GELBE CHERRY-TOMATEN, STRACCIATELLA, CAPOCOLLO", "FIOR DI LATTE, TOMATES CHERRY AMARILLOS, STRACCIATELLA, CAPOCOLLO"),
    ),
    "2048913": (
        ("Underbrush", "Sottobosco", "Unterholz", "Sotobosque"),
        ("FIOR DI LATTE, FRESH SAUSAGE, TRUFFLE OIL, BURRATA", "FIOR DI LATTE, SAUCISSÉE FRAÎCHE, HUILE DE TRUFFE, BURRATA", "FIOR DI LATTE, FRISCHE WURST, TRÜFFELÖL, BURRATA", "FIOR DI LATTE, SALCHICHA FRESCA, ACEITE DE TRUFA, BURRATA"),
    ),
    "2048915": (
        ("Biancaneve", "Blanc-neige", "Schneewittchen", "Blancanieves"),
        ("MOZZARELLA, GRANA", "MOZZARELLA, GRANA", "MOZZARELLA, GRANA", "MOZZARELLA, GRANA"),
    ),
    "2048916": (
        ("Brie", "Brie", "Brie", "Brie"),
        ("MOZZARELLA, BRIE, ARUGULA", "MOZZARELLA, BRIE, ROQUETTE", "MOZZARELLA, BRIE, RUCOLA", "MOZZARELLA, BRIE, RÚCULA"),
    ),
    "2048917": (
        ("Grilled Vegetables", "Légumes grillés", "Gegrilltes Gemüse", "Verduras a la plancha"),
        ("MOZZARELLA, ZUCCHINI, EGGPLANT, PEPPERS, FRESH MUSHROOMS", "MOZZARELLA, COURGETTES, AUBERGINES, POIVRONS, CHAMPIGNONS FRAIS", "MOZZARELLA, ZUCHINI, AUBERGINE, PAPRIKA, FRISCHE CHAMPIGNONS", "MOZZARELLA, CALABACÍN, BERENJENA, PIMIENTOS, CHAMPIÑONES FRESCOS"),
    ),
    "2048918": (
        ("Gorgonzola & Walnuts", "Gorgonzola et noix", "Gorgonzola und Walnüsse", "Gorgonzola y nueces"),
        ("MOZZARELLA, GORGONZOLA, WALNUTS", "MOZZARELLA, GORGONZOLA, NOIX", "MOZZARELLA, GORGONZOLA, WALNÜSSE", "MOZZARELLA, GORGONZOLA, NUECES"),
    ),
    "2048919": (
        ("Pancetta", "Pancettina", "Pancetta", "Panceta"),
        ("MOZZARELLA, PANCETTA, GRILLED EGGPLANT", "MOZZARELLA, PANCETTA, AUBERGINES GRILLÉES", "MOZZARELLA, PANCETTA, GEGRILLTE AUBERGINE", "MOZZARELLA, PANCETA, BERENJENA A LA PLANCHA"),
    ),
    "2048920": (
        ("Caprese", "Caprese", "Caprese", "Caprese"),
        ("MOZZARELLA, FRESH TOMATOES, ARUGULA, OREGANO", "MOZZARELLA, TOMATES FRAÎCHES, ROQUETTE, ORIGAN", "MOZZARELLA, FRISCHE TOMATEN, RUCOLA, OREGANO", "MOZZARELLA, TOMATES FRESCOS, RÚCULA, ORÉGANO"),
    ),
    "2048921": (
        ("Buffalo Caprese", "Caprese bufala", "Büffel-Caprese", "Caprese de búfala"),
        ("FRESH TOMATOES, ARUGULA, BUFFALO MOZZARELLA", "TOMATES FRAÎCHES, ROQUETTE, MOZZARELLA DE BUFFLONNE", "FRISCHE TOMATEN, RUCOLA, BÜFFELMOZZARELLA", "TOMATES FRESCOS, RÚCULA, MOZZARELLA DE BÚFALA"),
    ),
    "2048922": (
        ("Simple", "Semplice", "Einfach", "Sencilla"),
        ("ROSEMARY", "ROMARIN", "ROSMARIN", "ROMERO"),
    ),
    "2048924": (("Still Water 75 cl", "Eau plate 75 cl", "Stilles Wasser 75 cl", "Agua sin gas 75 cl"),),
    "2048925": (("Sparkling Water 75 cl", "Eau pétillante 75 cl", "Sprudelwasser 75 cl", "Agua con gas 75 cl"),),
    "2048926": (("Coca-Cola 33 cl", "Coca-Cola 33 cl", "Coca-Cola 33 cl", "Coca-Cola 33 cl"),),
    "2048927": (("Coca Zero 33 cl", "Coca Zero 33 cl", "Coca Zero 33 cl", "Coca Zero 33 cl"),),
    "2048928": (("Fanta 33 cl", "Fanta 33 cl", "Fanta 33 cl", "Fanta 33 cl"),),
    "2048929": (("Coca-Cola 1 L", "Coca-Cola 1 L", "Coca-Cola 1 L", "Coca-Cola 1 L"),),
    "2048930": (("Menabrea Blonde 66 cl", "Menabrea Blonde 66 cl", "Menabrea Blond 66 cl", "Menabrea Rubia 66 cl"),),
    "2048931": (("Weihenstephaner Vitus 50 cl", "Weihenstephaner Vitus 50 cl", "Weihenstephaner Vitus 50 cl", "Weihenstephaner Vitus 50 cl"),),
    "2048932": (("Menabrea Top Restaurant 75 cl", "Menabrea Top Restaurant 75 cl", "Menabrea Top Restaurant 75 cl", "Menabrea Top Restaurant 75 cl"),),
    "2048933": (("Menabrea Blonde 33 cl", "Menabrea Blonde 33 cl", "Menabrea Blond 33 cl", "Menabrea Rubia 33 cl"),),
    "2048934": (("Menabrea Red 33 cl", "Menabrea Rouge 33 cl", "Menabrea Rot 33 cl", "Menabrea Roja 33 cl"),),
    "2048935": (("Blonde Draft 0.2 L", "Blonde pression 0,2 L", "Blond vom Fass 0,2 L", "Rubia de barril 0,2 L"),),
    "2048936": (("Blonde Draft 0.4 L", "Blonde pression 0,4 L", "Blond vom Fass 0,4 L", "Rubia de barril 0,4 L"),),
    "2048937": (("Blonde Pitcher 1 L", "Pichet blonde 1 L", "Krug Blond 1 L", "Jarra rubia 1 L"),),
    "2048938": (("Blonde Pitcher 1.5 L", "Pichet blonde 1,5 L", "Krug Blond 1,5 L", "Jarra rubia 1,5 L"),),
    "2048939": (("Red Pitcher 1.5 L", "Pichet rouge 1,5 L", "Krug Rot 1,5 L", "Jarra roja 1,5 L"),),
    "2048940": (("Red Pitcher 1 L", "Pichet rouge 1 L", "Krug Rot 1 L", "Jarra roja 1 L"),),
    "2048941": (("Red Draft 0.2 L", "Rouge pression 0,2 L", "Rot vom Fass 0,2 L", "Roja de barril 0,2 L"),),
    "2048942": (("Red Draft 0.4 L", "Rouge pression 0,4 L", "Rot vom Fass 0,4 L", "Roja de barril 0,4 L"),),
    "2048943": (("House Red Wine 1 L", "Vin rouge maison 1 L", "Hausrotwein 1 L", "Vino tinto de la casa 1 L"),),
    "2048944": (("House Rosé Wine 1 L", "Vin rosé maison 1 L", "Hausroséwein 1 L", "Vino rosado de la casa 1 L"),),
    "2048945": (("House White Wine 1 L", "Vin blanc maison 1 L", "Hausweißwein 1 L", "Vino blanco de la casa 1 L"),),
    "2055431": (("Liante Castello Monaci", "Liante Castello Monaci", "Liante Castello Monaci", "Liante Castello Monaci"),),
    "2055432": (("Piluna Castello Monaci", "Piluna Castello Monaci", "Piluna Castello Monaci", "Piluna Castello Monaci"),),
    "2055433": (("Maru Castello Monaci", "Maru Castello Monaci", "Maru Castello Monaci", "Maru Castello Monaci"),),
    "2055434": (("Coribante Castello Monaci", "Coribante Castello Monaci", "Coribante Castello Monaci", "Coribante Castello Monaci"),),
    "2055435": (("Selva Rossa Due Palme", "Selva Rossa Due Palme", "Selva Rossa Due Palme", "Selva Rossa Due Palme"),),
    "2055436": (("Kreos Castello Monaci", "Kreos Castello Monaci", "Kreos Castello Monaci", "Kreos Castello Monaci"),),
    "2055437": (("Artats Castello Monaci", "Artats Castello Monaci", "Artats Castello Monaci", "Artats Castello Monaci"),),
    "2055438": (("Rosalbore", "Rosalbore", "Rosalbore", "Rosalbore"),),
    "2055439": (("Frontenere", "Frontenere", "Frontenere", "Frontenere"),),
    "2055440": (("Tormaresca Calafuria", "Tormaresca Calafuria", "Tormaresca Calafuria", "Tormaresca Calafuria"),),
    "2055441": (("Simera Chardonnay", "Simera Chardonnay", "Simera Chardonnay", "Simera Chardonnay"),),
    "2055442": (("Petra Luce Verdeca", "Petra Luce Verdeca", "Petra Luce Verdeca", "Petra Luce Verdeca"),),
    "2055443": (("Acante Fiano Salento", "Acante Fiano Salento", "Acante Fiano Salento", "Acante Fiano Salento"),),
    "2055444": (("Brut Rosé", "Brut rosé", "Brut Rosé", "Brut rosado"),),
    "2055445": (("Brut Prosecco", "Prosecco brut", "Brut Prosecco", "Prosecco brut"),),
    "2055446": (("Sweet Sparkling Wine", "Spumante dolce", "Süßer Sekt", "Espumoso dulce"),),
    "2055711": (("Meatballs", "Polpette", "Fleischbällchen", "Albóndigas"),),
    "2055715": (("Potato Croquettes", "Croquettes de pommes de terre", "Kartoffelkroketten", "Croquetas de patata"),),
    "2055716": (("Fried Zucchini Flowers", "Fleurs de courgette frites", "Frittierte Zucchiniblüten", "Flores de calabacín fritas"),),
    "2055717": (("Pittule", "Pittule", "Pittule", "Pittule"),),
    "2055925": (("Sparkling Water 50 cl", "Eau pétillante 50 cl", "Sprudelwasser 50 cl", "Agua con gas 50 cl"),),
    "2055926": (("Still Water 50 cl", "Eau plate 50 cl", "Stilles Wasser 50 cl", "Agua sin gas 50 cl"),),
    "2055927": (("House White Wine 1/2 L", "Vin blanc maison 1/2 L", "Hausweißwein 1/2 L", "Vino blanco de la casa 1/2 L"),),
    "2055928": (("House Rosé Wine 1/2 L", "Vin rosé maison 1/2 L", "Hausroséwein 1/2 L", "Vino rosado de la casa 1/2 L"),),
    "2055929": (("House Red Wine 1/2 L", "Vin rouge maison 1/2 L", "Hausrotwein 1/2 L", "Vino tinto de la casa 1/2 L"),),
    "2055930": (("Glass of Red Wine", "Verre de rouge", "Glas Rotwein", "Copa de tinto"),),
    "2055931": (("Glass of White Wine", "Verre de blanc", "Glas Weißwein", "Copa de blanco"),),
    "2055932": (("Glass of Rosé Wine", "Verre de rosé", "Glas Roséwein", "Copa de rosado"),),
    "2060795": (("House Rosé Wine 1/4 L", "Vin rosé maison 1/4 L", "Hausroséwein 1/4 L", "Vino rosado de la casa 1/4 L"),),
    "2060796": (("House Red Wine 1/4 L", "Vin rouge maison 1/4 L", "Hausrotwein 1/4 L", "Vino tinto de la casa 1/4 L"),),
    "2060797": (("House White Wine 1/4 L", "Vin blanc maison 1/4 L", "Hausweißwein 1/4 L", "Vino blanco de la casa 1/4 L"),),
    "2060810": (("Hazelnut & Pistachio Semifreddo", "Spumoncino noisette et pistache", "Spumoncino Haselnuss und Pistazie", "Spumoncino avellana y pistacho"),),
    "2060813": (("Sicilian Flavour Semifreddo", "Spumoncino sapore di Sicilia", "Spumoncino Sizilien-Geschmack", "Spumoncino sabor de Sicilia"),),
    "2060815": (("Fig & Cupeta Semifreddo", "Spumoncino figues et cupeta", "Spumoncino Feigen und Cupeta", "Spumoncino higos y cupeta"),),
    "2060816": (("Rocher Semifreddo", "Spumoncino Rocher", "Spumoncino Rocher", "Spumoncino Rocher"),),
    "2060821": (("Meat in Clay Pot", "Viande à la pignata", "Fleisch im Tontopf", "Carne a la pignata"),),
    "2060822": (("Stuffed Rolls in Sauce", "Involtini au sauce", "Rouladen in Sauce", "Rollos rellenos en salsa"),),
    "2060852": (("Chara Castello Monaci", "Chara Castello Monaci", "Chara Castello Monaci", "Chara Castello Monaci"),),
    "2060855": (("Tramari Rosato San Marzano", "Tramari Rosato San Marzano", "Tramari Rosato San Marzano", "Tramari Rosato San Marzano"),),
    "2060856": (("Aiace Rosso Riserva Castello Monaci", "Aiace Rosso Riserva Castello Monaci", "Aiace Rosso Riserva Castello Monaci", "Aiace Rosso Riserva Castello Monaci"),),
    "2068732": (("Salum Cantina S. Pancrazio", "Salum Cantina S. Pancrazio", "Salum Cantina S. Pancrazio", "Salum Cantina S. Pancrazio"),),
    "2068733": (("Campo Appio Negroamaro", "Campo Appio Negroamaro", "Campo Appio Negroamaro", "Campo Appio Negroamaro"),),
    "2068734": (("Campo Appio Primitivo", "Campo Appio Primitivo", "Campo Appio Primitivo", "Campo Appio Primitivo"),),
    "2068745": (("Salad Bowl with Walnuts", "Insalatona aux noix", "Salatschüssel mit Walnüssen", "Ensalada con nueces"),),
    "2068746": (("Salad Bowl with Bresaola", "Insalatona à la bresaola", "Salatschüssel mit Bresaola", "Ensalada con bresaola"),),
    "2068748": (("Salad Bowl with Bresaola", "Insalatona à la bresaola", "Salatschüssel mit Bresaola", "Ensalada con bresaola"),),
    "2088233": (("Battered Salt Cod", "Morue pastellée", "Pastellierter Kabeljau", "Bacalao rebozado"),),
    "2095577": (("Meatballs in Sauce", "Polpette au sauce", "Fleischbällchen in Sauce", "Albóndigas en salsa"),),
    "3246307": (("Pistachio, Hazelnut & Crunch Semifreddo", "Spumoncino pistache, noisette, crocc", "Spumoncino Pistazie, Haselnuss, Crunch", "Spumoncino pistacho, avellana, crujiente"),),
    "3246308": (("Greek Yogurt & Berry Semifreddo", "Spumoncino yaourt grec fruits rouges", "Spumoncino griechischer Joghurt Beeren", "Spumoncino yogur griego frutos rojos"),),
    "3246309": (("Pistachio Gran & Cream Semifreddo", "Spumoncino gran pistache et crème", "Spumoncino Gran Pistazie und Creme", "Spumoncino gran pistacho y crema"),),
    "3246310": (("Caramel Cream & Crumble Semifreddo", "Spumoncino caramel crème et crumble", "Spumoncino Karamell Creme und Crumble", "Spumoncino caramelo crema y crumble"),),
}

LANG_INDEX = {"en": 0, "fr": 1, "de": 2, "es": 3}


def build_locale(lang: str, source: dict) -> dict:
    idx = LANG_INDEX[lang]
    bundle = {
        "version": source["version"],
        "ui": UI[lang],
        "restaurant": RESTAURANT[lang],
        "categories": {
            cat_id: {"name": CATEGORIES[lang][cat_id]}
            for cat_id in source["categories"]
        },
        "items": {},
        "allergens": {
            aid: {"name": ALLERGENS[lang][aid][0], "description": ALLERGENS[lang][aid][1]}
            for aid in source["allergens"]
        },
    }

    for item_id, source_item in source["items"].items():
        if item_id not in ITEMS:
            raise KeyError(f"Missing translation for item {item_id}: {source_item['name']}")
        entry = ITEMS[item_id]
        translated = {"name": entry[0][idx]}
        if len(entry) > 1:
            translated["description"] = entry[1][idx]
        elif source_item.get("description"):
            translated["description"] = source_item["description"]
        bundle["items"][item_id] = translated

    return bundle


def main() -> None:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)

    for lang in LANG_INDEX:
        path = OUT / f"{lang}.json"
        bundle = build_locale(lang, source)
        path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {path} ({len(bundle['items'])} items)")

    meta = {
        "version": source["version"],
        "generatedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "locales": list(LANG_INDEX.keys()),
        "source": "manual",
    }
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Done.")


if __name__ == "__main__":
    main()
