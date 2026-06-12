"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "La méthode HYDRIC, c'est du jeûne ?",
    a: "Non. HYDRIC n'est pas du jeûne. Un jour hydrique autorise les bouillons, tisanes, soupes légères, jus dilués — ton corps reçoit des nutriments et n'est jamais en état de privation totale.",
  },
  {
    q: "Est-ce que j'aurai faim les jours hydriques ?",
    a: "Les premières 48 heures, parfois oui. Le corps s'adapte généralement après la première semaine — et les membres de la communauté sont là pour passer ce cap ensemble.",
  },
  {
    q: "Puis-je faire du sport pendant un jour hydrique ?",
    a: "Oui, une activité modérée (marche, yoga, pilates léger) est compatible. Les séances intensives sont déconseillées les jours hydriques.",
  },
  {
    q: "Qui ne peut pas faire la méthode HYDRIC ?",
    a: "HYDRIC est déconseillé aux personnes diabétiques, enceintes ou allaitantes, ou souffrant de TCA. Consulte ton médecin en cas de doute.",
  },
  {
    q: "Comment fonctionne la garantie 14 jours ?",
    a: "Si dans les 14 premiers jours la méthode ne te convient pas, envoie un email et tu es remboursée intégralement, sans question.",
  },
  {
    q: "Comment résilier mon abonnement ?",
    a: "En un clic depuis ton espace membre ou par email. Aucun préavis, aucune pénalité.",
  },
];

export function FaqList() {
  const [open, setOpen] = useState(0);

  return (
    <div className="faq-list">
      {FAQ.map((item, i) => (
        <div key={item.q} className={`faq-item${open === i ? " open" : ""}`}>
          <button
            type="button"
            className="faq-q"
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            {item.q}
            <em className="faq-icon">+</em>
          </button>
          <div className="faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}
