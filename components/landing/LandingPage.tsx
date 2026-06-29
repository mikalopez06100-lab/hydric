"use client";

import { useEffect } from "react";
import { CheckoutButton } from "@/components/landing/CheckoutButton";
import { FaqList } from "@/components/landing/FaqList";
import { HydricLogo } from "@/components/landing/HydricLogo";
import { appUrl } from "@/lib/domains";

export function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting) el.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

    const onScroll = () => {
      const nav = document.querySelector("nav");
      if (nav) {
        nav.style.boxShadow =
          window.scrollY > 20 ? "0 1px 0 rgba(26,31,27,.05)" : "none";
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <nav>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <HydricLogo height={56} priority />
          </a>
          <div className="nav-links">
            <a href="#methode">La méthode</a>
            <a href="#resultats">Résultats</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#faq">FAQ</a>
            <a href={appUrl("/acces")}>Code privé</a>
            <a href={appUrl("/login")}>Connexion</a>
            <a href="#tarifs" className="nav-cta">
              Commencer
            </a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-content fade-in visible">
              <div className="eyebrow">Méthode hydric · protocole n°1</div>
              <h1>
                Le corps <em>juste</em>.<br />
                La vie <em>intacte</em>.
              </h1>
              <p className="lead">
                Deux journées en alternance. Une qui hydrate, une qui nourrit
                léger. Le corps se remet à zéro — sans privation, sans comptage,
                sans envahir ta vie.
              </p>
              <div className="hero-ctas">
                <a href="#tarifs" className="btn-primary">
                  Commencer demain matin
                </a>
                <a href="#methode" className="btn-ghost">
                  Découvrir la méthode
                </a>
              </div>
              <div className="hero-meta">
                <div className="hero-meta-item">
                  <span className="hero-meta-key">Premiers résultats</span>
                  <span className="hero-meta-val">J+7</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-key">Cycle complet</span>
                  <span className="hero-meta-val">2 jours</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-key">Origine</span>
                  <span className="hero-meta-val">Méthode française</span>
                </div>
              </div>
            </div>

            <div className="hero-visual fade-in visible">
              <span className="hero-product-tag">Night Reset · 30 ml</span>
              <svg
                className="hero-visual-mark"
                viewBox="0 0 128 128"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="64" cy="64" r="62" fill="#5C6E58" />
                <g fill="#F4F1EA">
                  <rect x="34" y="30" width="14" height="68" rx="1" />
                  <rect x="80" y="30" width="14" height="68" rx="1" />
                  <rect x="28" y="28" width="26" height="5" />
                  <rect x="28" y="95" width="26" height="5" />
                  <rect x="74" y="28" width="26" height="5" />
                  <rect x="74" y="95" width="26" height="5" />
                  <rect x="48" y="58" width="32" height="8" />
                </g>
                <path
                  d="M48 62 Q56 50 64 62 T80 62"
                  stroke="#F4F1EA"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="hero-product-card">
                <span className="hpc-tag">— Moyenne à J21</span>
                <span className="hpc-val">−7 kg</span>
                <span className="hpc-sub">+ digestion apaisée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="strip">
        <div className="strip-inner">
          <div className="strip-item">Sans jeûne strict</div>
          <div className="strip-item">Sans comptage de calories</div>
          <div className="strip-item">Sans culpabilité</div>
          <div className="strip-item">Communauté privée incluse</div>
          <div className="strip-item">Résultats dès J+7</div>
        </div>
      </div>

      <section className="section" id="methode">
        <div className="wrap">
          <div className="method-intro fade-in">
            <div>
              <div className="eyebrow">La méthode</div>
              <h2>
                Un principe.
                <br />
                <em>Un effet durable.</em>
              </h2>
            </div>
            <p className="lead">
              Pas de régime. Pas d&apos;app à remplir. Une alternance simple qui
              laisse le corps se réinitialiser naturellement.
            </p>
          </div>

          <div className="days-grid fade-in">
            <div className="day-card day-hydric">
              <div className="day-tag">Jour J · hydrique</div>
              <h3 className="day-title">
                On <em>hydrate</em>.
              </h3>
              <p className="day-desc">
                Le système digestif récupère. Tu reçois des liquides nutritifs —
                pas de privation totale.
              </p>
              <ul className="day-items">
                <li>Eau, tisanes, infusions</li>
                <li>Bouillons clairs maison</li>
                <li>Jus dilués (≤ 200 ml)</li>
              </ul>
            </div>
            <div className="day-card day-alim">
              <div className="day-tag">Jour J+1 · alimentaire</div>
              <h3 className="day-title">
                On <em>nourrit</em>.
              </h3>
              <p className="day-desc">
                Tu manges normalement, sans restriction calorique. Fibres et
                protéines maigres — certains aliments sont à éviter.
              </p>
              <ul className="day-items">
                <li>Légumes à volonté</li>
                <li>Protéines maigres</li>
                <li>Légumineuses, céréales complètes</li>
                <li>Interdits : sucres ajoutés, sodas, jus industriels</li>
                <li>Interdits : féculents (pain blanc, pâtes, riz blanc…)</li>
              </ul>
            </div>
          </div>

          <div className="steps-list">
            {[
              {
                n: "01",
                t: "Tu alternes — c'est tout",
                p: "Un jour tu bois. Un jour tu manges léger. Le rythme naturel laisse le système digestif récupérer.",
              },
              {
                n: "02",
                t: "Tu reçois ton planning",
                p: "Chaque semaine, un planning personnalisé, des recettes et des listes de courses adaptées.",
              },
              {
                n: "03",
                t: "La communauté te porte",
                p: "Accès au groupe WhatsApp privé des membres HYDRIC (à partir du plan Essentiel).",
              },
              {
                n: "04",
                t: "Les résultats s'installent",
                p: "Légèreté digestive dès J+7. Perte de poids visible à J+21.",
              },
            ].map((s) => (
              <div key={s.n} className="step">
                <span className="step-num">{s.n}</span>
                <div className="step-body">
                  <h3>{s.t}</h3>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section results-section" id="resultats">
        <div className="wrap">
          <div className="method-intro fade-in">
            <div>
              <div className="eyebrow">Elles témoignent</div>
              <h2>
                Pas des promesses.
                <br />
                <em>Des vies réelles.</em>
              </h2>
            </div>
            <p className="lead">
              Trois femmes. Trois parcours. Un même résultat — la légèreté
              retrouvée.
            </p>
          </div>

          <div className="results-grid fade-in">
            {[
              {
                q: "En 3 semaines on perd minimum 6 à 7 kg. Moi, j'en ai perdu 7 — et certaines ont perdu entre 9 et 10 kg le premier mois.",
                stat: "Résultat J21 · −7 kg",
                name: "Marie, 44 ans · Lyon",
              },
              {
                q: "Rien n'a tenu plus de 3 semaines. HYDRIC je l'ai pas arrêté parce que je n'ai jamais faim.",
                stat: "Résultat J21 · −3,1 kg",
                name: "Sophie, 38 ans · Paris",
              },
              {
                q: "Le groupe WhatsApp c'est ce qui fait la différence.",
                stat: "Résultat J21 · −2,2 kg",
                name: "Nadia, 31 ans · Bordeaux",
              },
            ].map((r) => (
              <div key={r.name} className="result-card">
                <span className="result-quote-mark">&ldquo;</span>
                <p className="result-quote">{r.q}</p>
                <span className="result-stat">{r.stat}</span>
                <div className="result-meta">
                  <span className="result-name">{r.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="numbers-grid fade-in">
            <div className="number-card">
              <span className="number-tag">Délai</span>
              <div className="number-val">J+7</div>
              <p className="number-label">Premier ressenti de légèreté digestive</p>
            </div>
            <div className="number-card">
              <span className="number-tag">Mesure</span>
              <div className="number-val">−7</div>
              <p className="number-label">Kilos perdus en moyenne à J21 (6 à 7 kg)</p>
            </div>
            <div className="number-card">
              <span className="number-tag">Rétention</span>
              <div className="number-val">
                94<span style={{ fontSize: "1.6rem", opacity: 0.6 }}>%</span>
              </div>
              <p className="number-label">Continuent au-delà du premier mois</p>
            </div>
            <div className="number-card">
              <span className="number-tag">Sécurité</span>
              <div className="number-val">
                14<span style={{ fontSize: "1.6rem", opacity: 0.6 }}>j</span>
              </div>
              <p className="number-label">Garantie satisfaite — sans question</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="comment">
        <div className="wrap">
          <div className="method-intro">
            <div>
              <div className="eyebrow">En pratique</div>
              <h2>
                Rejoindre HYDRIC
                <br />
                <em>en 4 étapes.</em>
              </h2>
            </div>
            <p className="lead">
              L&apos;inscription prend cinq minutes. Le premier jour hydrique
              peut commencer demain matin.
            </p>
          </div>
          <div className="how-grid fade-in">
            {[
              { n: "01 — Choix", t: "Tu choisis ton plan", p: "Starter, Essentiel ou Premium. Résiliation libre." },
              { n: "02 — Réception", t: "Tu accèdes à l'app", p: "Dashboard, tracker eau, planning et recettes sur mobile." },
              { n: "03 — Communauté", t: "Tu rejoins le groupe", p: "WhatsApp privé inclus selon ton plan." },
              { n: "04 — Action", t: "Tu commences demain", p: "Ton premier jour hydrique peut démarrer demain matin." },
            ].map((h) => (
              <div key={h.n} className="how-step">
                <span className="how-num">{h.n}</span>
                <h3>{h.t}</h3>
                <p>{h.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="tarifs">
        <div className="wrap">
          <div className="method-intro">
            <div>
              <div className="eyebrow">Rejoindre HYDRIC</div>
              <h2>
                Une méthode.
                <br />
                <em>Trois niveaux.</em>
              </h2>
            </div>
            <p className="lead">
              Commence au niveau qui te correspond. Change de plan à tout moment.
            </p>
          </div>

          <div className="pricing-grid fade-in">
            <div className="price-card">
              <div className="price-tier">— Starter</div>
              <div className="price-val">
                6,90 €<span>/mois</span>
              </div>
              <div className="price-anchor">Sans engagement</div>
              <ul className="price-features">
                <li>Dashboard &amp; tracker eau</li>
                <li>Planning hydrique hebdomadaire</li>
                <li>5 recettes incluses</li>
                <li>Emails de suivi</li>
              </ul>
              <CheckoutButton plan="starter" label="Choisir Starter" variant="outline" />
            </div>

            <div className="price-card featured">
              <div className="price-tier">— Essentiel</div>
              <div className="price-val">
                9,90 €<span>/mois</span>
              </div>
              <div className="price-anchor">Le plus choisi · 73 %</div>
              <ul className="price-features">
                <li>Tout le plan Starter</li>
                <li>Toutes les recettes</li>
                <li>Planning personnalisé</li>
                <li>Stats 30 jours &amp; favoris</li>
                <li>Accès au groupe WhatsApp</li>
                <li>Garantie 14 jours</li>
              </ul>
              <CheckoutButton plan="essential" label="Rejoindre Essentiel" variant="primary" />
            </div>

            <div className="price-card">
              <div className="price-tier">— Premium</div>
              <div className="price-val">
                15,90 €<span>/mois</span>
              </div>
              <div className="price-anchor">Accompagnement renforcé</div>
              <ul className="price-features">
                <li>Tout le plan Essentiel</li>
                <li>Session 1:1 une fois par semaine</li>
                <li>Accès au groupe WhatsApp</li>
                <li>Export PDF</li>
                <li>Stats 90 jours</li>
              </ul>
              <CheckoutButton plan="premium" label="Choisir Premium" variant="ghost" />
            </div>
          </div>

          <p className="pricing-note">
            — Paiement sécurisé Stripe ·{" "}
            <a href={appUrl("/acces")} className="underline">
              Code d&apos;accès privé
            </a>{" "}
            · Garantie 14 jours
          </p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="wrap faq-wrap">
          <div className="eyebrow">Questions fréquentes</div>
          <h2>
            Tu te demandes
            <br />
            <em>peut-être…</em>
          </h2>
          <FaqList />
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap">
          <div className="eyebrow">Prête à commencer</div>
          <h2 className="cta-h2">
            Le geste est <em>simple</em>.<br />
            La méthode <em>commence</em>.
          </h2>
          <p className="cta-sub">
            Rejoins les premières membres HYDRIC. Accède à l&apos;application
            mobile dès aujourd&apos;hui.
          </p>
          <a href="#tarifs" className="cta-btn">
            Rejoindre HYDRIC →
          </a>
          <p className="cta-note">
            — <a href={appUrl("/acces")} style={{ color: "inherit" }}>Code privé</a>{" "}
            · <a href={appUrl("/login")} style={{ color: "inherit" }}>Connexion</a>
          </p>
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <a href="#" className="footer-mark">
            <HydricLogo height={48} />
          </a>
          <div className="footer-links">
            <a href="#methode">La méthode</a>
            <a href="#tarifs">Tarifs</a>
            <a href={appUrl("/acces")}>Accès app</a>
            <a href={appUrl("/login")}>Connexion</a>
          </div>
          <div className="footer-copy">© 2026 HYDRIC™</div>
        </div>
        <div className="footer-disclaimer">
          HYDRIC est une approche bien-être à visée non médicale. Elle ne
          remplace pas un avis médical. Déconseillée aux personnes diabétiques,
          enceintes, allaitantes ou souffrant de TCA.
        </div>
      </footer>
    </>
  );
}
