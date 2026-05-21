#!/usr/bin/env python3
"""Assegna gli allergeni alle portate del menu aribrì in base a nome e categoria."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MENU_PATH = ROOT / "src/data/menu.json"

GLUTEN = 1
CRUSTACEANS = 2
EGGS = 3
FISH = 4
PEANUTS = 5
SOY = 6
MILK = 7
NUTS = 8
CELERY = 9
MUSTARD = 10
SESAME = 11
SULPHITES = 12
LUPIN = 13
MOLLUSCS = 14


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", text.lower()).strip()


def contains_any(text: str, *terms: str) -> bool:
    return any(term in text for term in terms)


def infer_allergens(name: str, category: str) -> list[int]:
    n = normalize(name)
    cat = normalize(category)
    allergens: set[int] = set()

    if contains_any(n, "senza glutine"):
        allergens.discard(GLUTEN)

    # --- Pizze ---
    if cat == "pizze":
        if "senza glutine" not in n:
            allergens.add(GLUTEN)
        if not contains_any(n, "marinara"):
            allergens.add(MILK)
        if contains_any(
            n,
            "margherita",
            "bufala",
            "4 formaggi",
            "formaggi",
            "brie",
            "stracchino",
            "gorgonzola",
            "caprese",
            "biancaneve",
            "semplice",
            "napoli",
            "diavola",
            "salsiccia",
            "wurstel",
            "porcini",
            "orto mare",
            "frutti di mare",
            "alici",
            "tonno",
            "valtellina",
            "siciliana",
            "forest",
            "miss italia",
            "capricciosa",
            "4 stagioni",
            "domenica",
            "sapore",
            "sottobosco",
            "signora",
            "pancettina",
            "aribri",
            "friarielli",
            "radicchio",
            "verdure",
            "patatine",
        ):
            allergens.add(MILK)
        if contains_any(n, "gorgonzola e noci", "nocciola", "pistac", "rocher", "forest"):
            allergens.add(NUTS)
        if contains_any(n, "frutti di mare", "orto mare"):
            allergens.update({CRUSTACEANS, FISH, MOLLUSCS})
        if contains_any(n, "alici", "a tutta alici"):
            allergens.update({FISH, MOLLUSCS})
        if contains_any(n, "tonno"):
            allergens.add(FISH)
        return sorted(allergens)

    # --- Dolci ---
    if cat == "dolci":
        if contains_any(n, "frutta di stagione", "sorbetto"):
            return []
        allergens.update({EGGS, MILK})
        if contains_any(n, "cheesecake", "sporcamusi", "crumble", "caramello"):
            allergens.add(GLUTEN)
        if contains_any(
            n,
            "nocciola",
            "pistac",
            "rocher",
            "noci",
            "cupeta",
            "frutti bosco",
        ):
            allergens.add(NUTS)
        return sorted(allergens)

    # --- Bevande / Vini ---
    if cat in {"bevande", "vini"}:
        if contains_any(
            n,
            "vino",
            "calice",
            "caraffa",
            "spumante",
            "prosecco",
            "brut",
            "spina rossa",
            "menabrea rossa",
            "aiace",
            "primitivo",
            "negroamaro",
            "chardonnay",
            "fiano",
            "verdeca",
            "rosato",
            "rosso",
            "bianco",
            "champagne",
            "acante",
            "coribante",
            "frontenere",
            "kreos",
            "liante",
            "maru",
            "petra",
            "piluna",
            "rosalbore",
            "salum",
            "selva",
            "simera",
            "tormaresca",
            "tramari",
            "chara",
            "campo appio",
            "artats",
            "castello monaci",
        ):
            allergens.add(SULPHITES)
        if contains_any(n, "birra", "menabrea", "weithen", "spina bionda"):
            allergens.add(GLUTEN)
        return sorted(allergens)

    # --- Contorni ---
    if cat == "contorni":
        if contains_any(n, "giardiniera"):
            allergens.add(SULPHITES)
        return sorted(allergens)

    # --- Insalatone ---
    if cat == "insalatone":
        if contains_any(n, "noci"):
            allergens.add(NUTS)
        if contains_any(n, "bresaola"):
            pass
        return sorted(allergens)

    # --- Antipasti ---
    if contains_any(n, "alici"):
        allergens.add(FISH)
    if contains_any(n, "baccala"):
        allergens.update({FISH, GLUTEN, EGGS})
    if contains_any(n, "bruschette", "friselle", "pittule"):
        allergens.add(GLUTEN)
    if contains_any(n, "burrata", "formaggi", "capocollo e burrata"):
        allergens.add(MILK)
    if contains_any(n, "cozze"):
        allergens.update({MOLLUSCS, FISH})
    if contains_any(n, "cozze gratinate"):
        allergens.update({GLUTEN, MILK})
    if contains_any(n, "crocchette"):
        allergens.update({GLUTEN, EGGS, MILK})
    if contains_any(n, "crudite di mare", "antipasto misto mare", "insalata di mare"):
        allergens.update({CRUSTACEANS, FISH, MOLLUSCS})
    if contains_any(n, "insalata di mare"):
        allergens.add(CELERY)
    if contains_any(n, "fiori di zucca"):
        allergens.update({GLUTEN, EGGS, MILK})
    if contains_any(n, "fritto misto terra"):
        allergens.update({GLUTEN, EGGS, MILK})
    if contains_any(n, "polpette"):
        allergens.update({GLUTEN, EGGS, MILK, CELERY})
    if contains_any(n, "tagliere formaggi"):
        allergens.add(MILK)

    # --- Angolo tradizione ---
    if cat == "angolo tradizione":
        if contains_any(n, "ciciri e tria", "orecchiette", "turcinieddri"):
            allergens.add(GLUTEN)
        if contains_any(n, "parmigiana"):
            allergens.update({GLUTEN, MILK})
        if contains_any(n, "polpo"):
            allergens.update({FISH, MOLLUSCS, CELERY})
        if contains_any(n, "cavallo", "pignata"):
            allergens.add(CELERY)

    # --- Primi ---
    if cat == "primi":
        allergens.add(GLUTEN)
        if contains_any(n, "burrata", "ricotta", "pesto"):
            allergens.add(MILK)
        if contains_any(n, "pesto"):
            allergens.add(NUTS)
        if contains_any(n, "cernia", "spada"):
            allergens.add(FISH)
        if contains_any(n, "cozze", "vongole"):
            allergens.update({MOLLUSCS, FISH})
        if contains_any(n, "scampi", "gamber"):
            allergens.update({CRUSTACEANS, FISH})

    # --- Secondi ---
    if cat == "secondi":
        if contains_any(
            n,
            "calamaro",
            "calamari",
            "gamber",
            "paranza",
            "pesce",
            "tonno",
            "frittura",
        ):
            allergens.update({CRUSTACEANS, FISH, MOLLUSCS})
        if contains_any(n, "frittura", "fritto"):
            allergens.update({GLUTEN, EGGS})
        if contains_any(n, "involtini"):
            allergens.update({GLUTEN, MILK, CELERY})
        if contains_any(n, "pignata", "pignatu"):
            allergens.add(CELERY)

    return sorted(allergens)


def main() -> None:
    menu = json.loads(MENU_PATH.read_text(encoding="utf-8"))
    assigned = 0

    for category in menu["categories"]:
        for item in category["items"]:
            allergens = infer_allergens(item["name"], category["name"])
            if allergens:
                item["allergens"] = allergens
                assigned += 1
            elif "allergens" in item:
                del item["allergens"]

    MENU_PATH.write_text(
        json.dumps(menu, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {MENU_PATH.name}: {assigned} items with allergens")


if __name__ == "__main__":
    main()
