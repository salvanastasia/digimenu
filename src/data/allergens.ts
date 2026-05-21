import type { Allergen } from "@/types/menu";

export const ALLERGENS: Allergen[] = [
  {
    id: 1,
    name: "1-Cereali contenenti glutine",
    description:
      "grano, farro, grano khorasan, segale, orzo, avena",
  },
  {
    id: 2,
    name: "2-Crostacei",
    description: "gamberi, scampi, aragoste, granchi, paguri e simili",
  },
  {
    id: 3,
    name: "3-Uova",
    description:
      "maionese, frittata, emulsionanti, pasta all'uovo, biscotti e torte anche salate, gelati e creme ecc",
  },
  {
    id: 4,
    name: "4-Pesce",
    description:
      "inclusi i derivati, cioè tutti quei prodotti alimentari che si compongono di pesce, anche se in piccole percentuali",
  },
  {
    id: 5,
    name: "5-Arachidi e prodotti a base di arachidi",
    description: "arachidi e prodotti a base di arachidi",
  },
  {
    id: 6,
    name: "6-Semi di soia e prodotti a base di soia",
    description: "semi di soia e prodotti a base di soia",
  },
  {
    id: 7,
    name: "7-Latte e prodotti a base di latte",
    description:
      "yogurt, biscotti e torte, gelato e creme varie. Incluso lattosio",
  },
  {
    id: 8,
    name: "8-Frutta a guscio",
    description:
      "mandorle, nocciole, noci comuni, noci di acagiù, noci pecan e del Brasile e Queensland, pistacchi",
  },
  {
    id: 9,
    name: "9-Sedano e derivati",
    description:
      "presente in pezzi ma pure all'interno di preparati per zuppe, salse e concentrati vegetali",
  },
  {
    id: 10,
    name: "10-Senape e prodotti a base di senape",
    description: "senape e prodotti a base di senape",
  },
  {
    id: 11,
    name: "11-Semi di sesamo e prodotti a base di sesamo",
    description: "semi di sesamo e prodotti a base di sesamo",
  },
  {
    id: 12,
    name: "12-Anidride solforosa e solfiti",
    description:
      "anidride solforosa e solfiti in concentrazioni superiori a 10 mg/kg o 10 mg/litro",
  },
  {
    id: 13,
    name: "13-Lupini e prodotti a base di lupini",
    description: "lupini e prodotti a base di lupini",
  },
  {
    id: 14,
    name: "14-Molluschi",
    description:
      "canestrello, cannolicchio, capasanta, cozza, vongola, polpo e simili",
  },
];

export const allergenById = (ids: number[]) =>
  ALLERGENS.filter((allergen) => ids.includes(allergen.id));
