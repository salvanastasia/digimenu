#!/usr/bin/env python3
"""Assegna i tag vegano/vegetariano alle portate del menu aribrì."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MENU_PATH = ROOT / "src/data/menu.json"

MEAT_FISH = (
    "alici",
    "alacche",
    "acciug",
    "baccala",
    "bacala",
    "mare",
    "cozze",
    "vongole",
    "pesce",
    "tonno",
    "gamber",
    "scampi",
    "calamar",
    "paranza",
    "cernia",
    "spada",
    "polpo",
    "salsiccia",
    "diavola",
    "wurstel",
    "pancett",
    "mortadella",
    "bresaola",
    "capocollo",
    "salum",
    "salumi",
    "cavallo",
    "carne",
    "entrecote",
    "vitellino",
    "tagliata",
    "grigliata mista",
    "frutti di mare",
    "a tutta alici",
    "involtini",
    "polpette",
    "fritto misto terra",
    "crudite di mare",
    "antipasto misto mare",
    "insalata di mare",
    "impepata di cozze",
    "turciniedd",
    "orecchiette e pizzarieddri",
    "porcini e salsiccia",
    "orto mare",
    "valtellina",
    "napoli",
    "siciliana",
)

DAIRY_EGGS = (
    "burrata",
    "mozzarella",
    "formagg",
    "ricotta",
    "bufala",
    "brie",
    "gorgonzola",
    "stracchino",
    "panna",
    "latte",
    "yogurt",
    "uovo",
    "uova",
    "spumoncino",
    "cheesecake",
    "sporcamusi",
    "cupeta",
    "mascarpone",
    "crema",
    "cioccolato",
    "nocciola",
    "pistac",
    "rocher",
    "crumble",
    "caramello",
    "pastella",
    "pittule",
    "crocchette",
    "fiori di zucca",
    "gnocchi",
    "parmigiana",
    "margherita",
    "caprese",
    "4 formaggi",
    "biancaneve",
    "semplice",
    "4 stagioni",
    "capricciosa",
    "forest",
    "miss italia",
    "domenica",
    "sottobosco",
    "signora",
    "pancettina",
    "friarielli",
    "radicchio",
    "porcini",
    "aribri",
    "sapore",
    "wurstel e patatine",
)

MANUAL: dict[str, list[str]] = {
    "2048808": ["vegan"],  # Bruschette Pomodoro
    "2048810": ["vegetarian"],  # Friselle Salentine
    "2048820": ["vegetarian"],  # Ciciri E Tria
    "2048818": ["vegan"],  # Fave E Cicorie
    "2048871": ["vegetarian"],  # Margherita
    "2048870": ["vegetarian"],  # Margherita Maxi
    "2048869": ["vegetarian"],  # Margherita Senza Glutine
    "2048881": ["vegan"],  # Marinara
    "2048917": ["vegetarian"],  # Verdure Grigliate (pizza)
}


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", text.lower()).strip()


def contains_any(text: str, *terms: str) -> bool:
    return any(term in text for term in terms)


def has_meat_or_fish(name: str) -> bool:
    return contains_any(normalize(name), *MEAT_FISH)


def has_dairy_or_eggs(name: str) -> bool:
    return contains_any(normalize(name), *DAIRY_EGGS)


def infer_tags(name: str, category: str, item_id: str) -> list[str]:
    if item_id in MANUAL:
        return MANUAL[item_id]

    n = normalize(name)
    cat = normalize(category)

    if has_meat_or_fish(name):
        return []

    if cat == "contorni":
        return ["vegan"]

    if cat == "insalatone" and contains_any(n, "noci"):
        return ["vegan"]

    if contains_any(n, "frutta di stagione", "sorbetto al limone"):
        return ["vegan"]

    if cat in {"bevande", "vini"}:
        return ["vegan"]

    if cat == "pizze":
        if contains_any(n, "marinara"):
            return ["vegan"]
        if contains_any(n, "verdure grigliate"):
            return ["vegetarian"]
        if has_dairy_or_eggs(name) or contains_any(
            n,
            "margherita",
            "bufala",
            "formaggi",
            "caprese",
            "biancaneve",
            "semplice",
            "4 stagioni",
            "capricciosa",
            "forest",
            "miss italia",
            "domenica",
            "sottobosco",
            "signora",
            "gorgonzola",
            "stracchino",
            "brie",
            "porcini",
            "friarielli",
            "radicchio",
            "aribri",
            "sapore",
        ):
            return ["vegetarian"]
        return []

    if cat == "dolci":
        return ["vegetarian"]

    if cat == "antipasti":
        if contains_any(n, "bruschette pomodoro"):
            return ["vegan"]
        if contains_any(
            n,
            "crocchette di patate",
            "fiori di zucca",
            "pittule",
            "friselle",
            "tagliere formaggi",
        ):
            return ["vegetarian"]
        return []

    if cat == "angolo tradizione":
        if contains_any(n, "fave e cicorie"):
            return ["vegan"]
        if contains_any(n, "parmigiana", "ciciri e tria"):
            return ["vegetarian"]
        return []

    if cat == "primi":
        if contains_any(n, "burrata", "ricotta", "pesto"):
            return ["vegetarian"]
        return []

    return []


def main() -> None:
    menu = json.loads(MENU_PATH.read_text(encoding="utf-8"))
    vegan_count = 0
    vegetarian_count = 0

    for category in menu["categories"]:
        for item in category["items"]:
            tags = infer_tags(item["name"], category["name"], item["id"])
            if tags:
                item["tags"] = tags
                if "vegan" in tags:
                    vegan_count += 1
                if "vegetarian" in tags:
                    vegetarian_count += 1
            elif "tags" in item:
                del item["tags"]

    MENU_PATH.write_text(
        json.dumps(menu, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Updated {MENU_PATH.name}: "
        f"{vegan_count} vegan, {vegetarian_count} vegetarian tags"
    )


if __name__ == "__main__":
    main()
