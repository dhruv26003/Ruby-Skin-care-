import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-skincare-guide',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="guide-page">
      <!-- Hero -->
      <section class="guide-hero">
        <div class="container">
          <span class="hero-sub">DERMATOLOGICAL HARMONY</span>
          <h1>The RubyCare Skin Science Guide</h1>
          <p>
            Master the art and chemistry of clinical botanical rituals. Learn the ideal order of application, understand active concentrations, and align your routine with your biological skin needs.
          </p>
        </div>
      </section>

      <div class="container section-padding">
        <!-- Medical Advice Disclaimer Alert -->
        <div class="medical-disclaimer-box">
          <span class="disc-icon">⚕️</span>
          <div class="disc-text">
            <strong>Dermatological & Medical Disclaimer:</strong>
            The educational insights provided in this guide are for skincare wellness and cosmetic knowledge only. Our products do not claim to treat, cure, or prevent clinical skin diseases. Always consult a board-certified dermatologist for chronic eczema, severe cystic acne, or underlying skin disorders.
          </div>
        </div>

        <!-- 1. Morning vs Evening Routines -->
        <section class="guide-section">
          <div class="section-header">
            <span class="section-tagline">DAILY CHRONOBIOLOGY</span>
            <h2>Circadian Skincare Rituals</h2>
            <p>Your skin requires defensive protection by day, and cellular restoration by night.</p>
          </div>

          <div class="routines-compare-grid">
            <!-- Morning Routine Card -->
            <div class="routine-card morning">
              <div class="routine-badge">
                <span>☀️ Morning Ritual: Defense & Shield</span>
              </div>
              <p class="routine-intro">Focus on antioxidant shielding, barrier hydration, and broad-spectrum UV protection.</p>

              <div class="timeline-steps">
                <div class="timeline-item">
                  <span class="step-num">1</span>
                  <div class="step-desc">
                    <strong>Gentle pH-Balanced Cleanse</strong>
                    <p>Use a sulfate-free matcha or cream cleanser to wash off overnight sweat without disturbing moisture.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">2</span>
                  <div class="step-desc">
                    <strong>Milky Rice Essence Toner</strong>
                    <p>Prime cell membranes with hydrating amino acids to improve penetration of subsequent actives.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">3</span>
                  <div class="step-desc">
                    <strong>Vitamin C Antioxidant Elixir</strong>
                    <p>Apply 15% L-Ascorbic Acid to scavenge free radicals and prevent UV-induced hyperpigmentation.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">4</span>
                  <div class="step-desc">
                    <strong>Lightweight Moisture Seal</strong>
                    <p>Smooth a non-comedogenic cica or cloud cream to keep moisture locked in place.</p>
                  </div>
                </div>

                <div class="timeline-item key-step">
                  <span class="step-num">5</span>
                  <div class="step-desc">
                    <strong>Non-Negotiable Broad-Spectrum SPF 50+</strong>
                    <p>Apply 2-3 finger lengths of mineral non-nano zinc oxide sunscreen 15 minutes before exposure.</p>
                  </div>
                </div>
              </div>

              <a routerLink="/products" [queryParams]="{category: 'sunscreens'}" class="btn btn-outline btn-sm routine-cta">
                Shop Morning Shields
              </a>
            </div>

            <!-- Evening Routine Card -->
            <div class="routine-card evening">
              <div class="routine-badge">
                <span>🌙 Evening Ritual: Repair & Renewal</span>
              </div>
              <p class="routine-intro">Focus on melting away particulate pollutants, replenishing skin ceramides, and cellular regeneration.</p>

              <div class="timeline-steps">
                <div class="timeline-item">
                  <span class="step-num">1</span>
                  <div class="step-desc">
                    <strong>First Cleanse: Melting Cleansing Balm</strong>
                    <p>Massage a lipid-dissolving balm over dry skin to dissolve long-wear SPF and stubborn makeup.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">2</span>
                  <div class="step-desc">
                    <strong>Second Cleanse: Gentle Foaming Gel</strong>
                    <p>Rinse with lukewarm water and a green tea foaming wash to purify pores down to the follicular base.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">3</span>
                  <div class="step-desc">
                    <strong>Cellular Active: Bakuchiol & Peptides</strong>
                    <p>Apply 2% natural Bakuchiol and Copper Tripeptides to stimulate collagen without redness or peeling.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">4</span>
                  <div class="step-desc">
                    <strong>5-Ceramide Cloud Restoration Cream</strong>
                    <p>Generously apply restorative ceramides to rebuild your stratum corneum lipid matrix overnight.</p>
                  </div>
                </div>

                <div class="timeline-item">
                  <span class="step-num">5</span>
                  <div class="step-desc">
                    <strong>Rosewater Overnight Jelly Mask (2x/week)</strong>
                    <p>Lock in all hydration layers with an occlusive moisture-seal memory gel before sleep.</p>
                  </div>
                </div>
              </div>

              <a routerLink="/products" [queryParams]="{category: 'serums'}" class="btn btn-outline btn-sm routine-cta">
                Shop Night Regenerators
              </a>
            </div>
          </div>
        </section>

        <!-- 2. Active Ingredients Encyclopedia -->
        <section id="ingredients" class="guide-section mt-5">
          <div class="section-header">
            <span class="section-tagline">INGREDIENT GLOSSARY</span>
            <h2>Active Ingredients Demystified</h2>
            <p>Understand the science, purpose, and optimal combinations of our signature clinical actives.</p>
          </div>

          <div class="ingredients-grid">
            <div class="ingredient-card">
              <div class="ing-header">
                <span class="ing-symbol">Vit C</span>
                <div>
                  <h4>15% L-Ascorbic Acid</h4>
                  <span class="ing-role">Antioxidant & Collagen Booster</span>
                </div>
              </div>
              <p>The gold standard topical antioxidant. Neutralizes environmental oxidants, speeds cellular renewal, and blocks tyrosinase to diminish dark spots.</p>
              <div class="pair-tips">
                <span>Best paired with: Vitamin E, Ferulic Acid, Hyaluronic Acid</span>
              </div>
            </div>

            <div class="ingredient-card">
              <div class="ing-header">
                <span class="ing-symbol">B3</span>
                <div>
                  <h4>Niacinamide (Vitamin B3)</h4>
                  <span class="ing-role">Pore Refiner & Barrier Reinforcer</span>
                </div>
              </div>
              <p>A multi-tasking vitamin that strengthens epidermal synthesis, visibly tightens enlarged pore walls, and reduces excess sebum flow.</p>
              <div class="pair-tips">
                <span>Best paired with: Zinc PCA, Ceramides, Salicylic Acid</span>
              </div>
            </div>

            <div class="ingredient-card">
              <div class="ing-header">
                <span class="ing-symbol">HA</span>
                <div>
                  <h4>Multi-Molecular Hyaluronic Acid</h4>
                  <span class="ing-role">Deep Inter-Cellular Hydrator</span>
                </div>
              </div>
              <p>Combines 5 molecular sizes. Micro molecules penetrate deep into the dermal matrix while macro polymers bind surface humidity.</p>
              <div class="pair-tips">
                <span>Best paired with: Squalane, Polyglutamic Acid, Panthenol</span>
              </div>
            </div>

            <div class="ingredient-card">
              <div class="ing-header">
                <span class="ing-symbol">CER</span>
                <div>
                  <h4>Biomimetic 5-Ceramide Complex</h4>
                  <span class="ing-role">Barrier Repair & Moisture Retention</span>
                </div>
              </div>
              <p>Replicates natural skin lipids (Ceramides NP, AP, EOP, phytosphingosine). Seals microscopic fissures to eliminate flakiness and sensitivity.</p>
              <div class="pair-tips">
                <span>Best paired with: Colloidal Oat, Centella Asiatica, Fatty Acids</span>
              </div>
            </div>

            <div class="ingredient-card">
              <div class="ing-header">
                <span class="ing-symbol">BAK</span>
                <div>
                  <h4>Ayurvedic Bakuchiol</h4>
                  <span class="ing-role">Gentle Botanical Retinol Alternative</span>
                </div>
              </div>
              <p>Extracted from the Psoralea corylifolia plant. Triggers cellular renewal pathways identically to retinol without causing peeling or dryness.</p>
              <div class="pair-tips">
                <span>Best paired with: Rosehip Seed Oil, Peptides, Blue Tansy</span>
              </div>
            </div>

            <div class="ingredient-card">
              <div class="ing-header">
                <span class="ing-symbol">ZN</span>
                <div>
                  <h4>Non-Nano Zinc Oxide</h4>
                  <span class="ing-role">Clean Mineral Sunscreen Shield</span>
                </div>
              </div>
              <p>Natural mineral particles that physically bounce UVA and UVB rays off the skin surface. Inert, hypoallergenic, and soothing for rosacea.</p>
              <div class="pair-tips">
                <span>Best paired with: Ectoin, Bisabolol, Antioxidants</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Skin Types Diagnostic -->
        <section id="skintypes" class="guide-section mt-5">
          <div class="section-header">
            <span class="section-tagline">SELF-DIAGNOSTIC GUIDE</span>
            <h2>Identify Your Unique Skin Type</h2>
            <p>Cleanse your face, wait 30 minutes without applying any product, and observe how your skin feels.</p>
          </div>

          <div class="skin-types-grid">
            <div class="type-card">
              <h4>Dry & Dehydrated</h4>
              <span class="type-feel">Feels tight, shows fine flaking, lacks visible sebum</span>
              <p>Needs rich lipid replenishment with ceramides, squalane, and comforting milky essence toners.</p>
              <a routerLink="/products" [queryParams]="{skinType: 'Dry'}" class="btn btn-secondary btn-sm">View Dry Skin Ritual</a>
            </div>

            <div class="type-card">
              <h4>Oily & Acne-Prone</h4>
              <span class="type-feel">Visible shine across entire face within 1 hour, enlarged pores</span>
              <p>Needs gentle balancing with green tea, willow bark BHA, and lightweight oil-free cica gels.</p>
              <a routerLink="/products" [queryParams]="{skinType: 'Oily'}" class="btn btn-secondary btn-sm">View Oily Skin Ritual</a>
            </div>

            <div class="type-card">
              <h4>Combination</h4>
              <span class="type-feel">Oily T-zone (forehead, nose, chin) with normal or dry cheeks</span>
              <p>Benefits from targeted dual treatment: pore-clearing niacinamide in T-zone and barrier cream on cheeks.</p>
              <a routerLink="/products" [queryParams]="{skinType: 'Combination'}" class="btn btn-secondary btn-sm">View Combination Ritual</a>
            </div>

            <div class="type-card">
              <h4>Sensitive & Reactive</h4>
              <span class="type-feel">Flushes easily, stings with fragrances, prone to redness</span>
              <p>Needs 100% fragrance-free, minimalist formulations rich in colloidal oatmeal, cica, and non-nano zinc.</p>
              <a routerLink="/products" [queryParams]="{skinType: 'Sensitive'}" class="btn btn-secondary btn-sm">View Sensitive Ritual</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .guide-hero {
      background: linear-gradient(180deg, var(--color-ivory, #faf7f2) 0%, var(--color-beige, #f4efe6) 100%);
      padding: 3.5rem 0;
      text-align: center;
      border-bottom: 1px solid var(--color-border, #e8e2d8);

      .hero-sub {
        font-size: 0.775rem;
        letter-spacing: 0.15em;
        font-weight: 700;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        margin-bottom: 0.5rem;
      }

      h1 { margin-bottom: 0.75rem; }
      p { max-width: 650px; margin: 0 auto; font-size: 1.05rem; }
    }

    .medical-disclaimer-box {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: #fbf7ec;
      border: 1px solid #ebd8a5;
      border-radius: var(--radius-md, 14px);
      padding: 1.5rem 2rem;
      margin-bottom: 3.5rem;
      font-size: 0.875rem;
      color: #7a5d1b;

      .disc-icon { font-size: 2rem; }
      strong { display: block; margin-bottom: 0.25rem; color: #5a420e; }
    }

    .guide-section {
      margin-bottom: 4rem;
    }

    .routines-compare-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    .routine-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-xl, 30px);
      padding: 2.5rem;
      display: flex;
      flex-direction: column;

      .routine-badge {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 0.4rem 1rem;
        border-radius: var(--radius-full, 9999px);
        margin-bottom: 1rem;
        display: inline-block;
        align-self: flex-start;
      }

      &.morning .routine-badge {
        background: #fef5e7;
        color: #b57a1e;
      }

      &.evening .routine-badge {
        background: #eaf1f8;
        color: #2b5580;
      }

      .routine-intro {
        font-size: 0.95rem;
        margin-bottom: 2rem;
        color: var(--color-charcoal, #1c211e);
      }

      .routine-cta {
        margin-top: auto;
        align-self: flex-start;
      }
    }

    .timeline-steps {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .timeline-item {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;

      .step-num {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--color-beige, #f4efe6);
        border: 1px solid var(--color-border, #e8e2d8);
        color: var(--color-charcoal, #1c211e);
        font-size: 0.875rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      &.key-step .step-num {
        background: var(--color-primary, #4e6b5d);
        color: var(--color-white, #fff);
      }

      .step-desc {
        strong { font-size: 0.95rem; color: var(--color-charcoal, #1c211e); display: block; margin-bottom: 0.2rem; }
        p { font-size: 0.85rem; color: var(--color-muted, #646d68); margin: 0; }
      }
    }

    /* Ingredients Grid */
    .ingredients-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .ingredient-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;

      .ing-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        .ing-symbol {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm, 8px);
          background: var(--color-beige, #f4efe6);
          color: var(--color-primary, #4e6b5d);
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h4 { font-family: var(--font-sans); font-size: 1rem; font-weight: 700; margin-bottom: 0.15rem; }
        .ing-role { font-size: 0.75rem; color: var(--color-accent-gold, #c6a779); font-weight: 600; text-transform: uppercase; }
      }

      p { font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.25rem; flex: 1; }

      .pair-tips {
        border-top: 1px solid var(--color-border-subtle, #f0ebe2);
        padding-top: 0.75rem;
        font-size: 0.75rem;
        color: var(--color-muted, #646d68);
      }
    }

    /* Skin Types */
    .skin-types-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .type-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;

      h4 { font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 0.35rem; }
      .type-feel { font-size: 0.775rem; color: var(--color-accent-gold, #c6a779); font-weight: 600; margin-bottom: 0.75rem; }
      p { font-size: 0.85rem; margin-bottom: 1.5rem; flex: 1; }
    }

    @media (max-width: 992px) {
      .routines-compare-grid { grid-template-columns: 1fr; }
      .ingredients-grid { grid-template-columns: repeat(2, 1fr); }
      .skin-types-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .ingredients-grid { grid-template-columns: 1fr; }
      .skin-types-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SkincareGuideComponent {}
