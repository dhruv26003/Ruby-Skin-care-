import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-page">
      <section class="about-hero">
        <div class="container">
          <span class="hero-sub">OUR PHILOSOPHY</span>
          <h1>Grounded in Botanical Purity</h1>
          <p>
            At RubyCare, we believe skin health should be gentle, clinical, and transparent. We pair therapeutic botanical extracts with bio-compatible cellular actives.
          </p>
        </div>
      </section>

      <div class="container section-padding">
        <!-- Story Split Section -->
        <div class="story-grid">
          <div class="story-media">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80"
              alt="RubyCare Botanical Formulation Lab"
              class="story-img"
            />
          </div>
          <div class="story-content">
            <span class="story-tag">THE GENESIS</span>
            <h2>Bridging Nature & Dermatology</h2>
            <p>
              RubyCare was born out of frustration with over-complicated, 12-step skincare routines saturated with unnecessary synthetic fragrances, microplastics, and harsh sulfates.
            </p>
            <p>
              Our founding team of formulation chemists and cosmetic dermatologists set out to create a conscious apothecary: clinical efficacy without irritation. We formulate with the natural pH of human skin (5.5) and prioritize strengthening the moisture barrier above all else.
            </p>
            <div class="stat-highlight">
              <strong>100%</strong>
              <span>Transparency on every active concentration and botanical origin.</span>
            </div>
          </div>
        </div>

        <!-- 3 Pillars of Craftsmanship -->
        <div class="pillars-section mt-5">
          <div class="section-header">
            <span class="section-tagline">OUR PROMISE</span>
            <h2>Conscious Skincare Standards</h2>
            <p>Every bottle reflects our three non-negotiable formulation principles.</p>
          </div>

          <div class="pillars-grid">
            <div class="pillar-card">
              <span class="pillar-number">01</span>
              <h3>Barrier-First Formulations</h3>
              <p>We will never compromise your acid mantle. Every active is buffered with soothing botanicals like Centella Asiatica, ceramides, and colloidal oats to prevent redness.</p>
            </div>

            <div class="pillar-card">
              <span class="pillar-number">02</span>
              <h3>Proven Bio-Actives</h3>
              <p>We do not formulate with trendy fairy-dust concentrations. We use clinically demonstrated percentages of L-Ascorbic Acid, Niacinamide, and Peptides for real visible changes.</p>
            </div>

            <div class="pillar-card">
              <span class="pillar-number">03</span>
              <h3>Sustainable Luxury</h3>
              <p>Housed in recyclable frosted amber glass vessels that protect light-sensitive actives while reducing virgin plastic landfill waste by 92% across all product lines.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-hero {
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
      p { max-width: 620px; margin: 0 auto; font-size: 1.05rem; }
    }

    .story-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      margin-bottom: 4rem;
    }

    .story-media {
      border-radius: var(--radius-xl, 30px);
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(78, 107, 93, 0.12);

      .story-img {
        width: 100%;
        height: 480px;
        object-fit: cover;
      }
    }

    .story-content {
      .story-tag {
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        margin-bottom: 0.5rem;
      }

      h2 { margin-bottom: 1.25rem; }
      p { font-size: 1.05rem; line-height: 1.8; margin-bottom: 1.25rem; }

      .stat-highlight {
        margin-top: 2rem;
        padding: 1.25rem 1.75rem;
        background: var(--color-beige, #f4efe6);
        border-radius: var(--radius-md, 14px);
        display: flex;
        align-items: center;
        gap: 1.25rem;

        strong {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2.2rem;
          color: var(--color-primary, #4e6b5d);
        }

        span {
          font-size: 0.875rem;
          color: var(--color-charcoal, #1c211e);
          font-weight: 500;
        }
      }
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .pillar-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2.25rem;
      position: relative;

      .pillar-number {
        font-family: var(--font-serif, Georgia, serif);
        font-size: 2.5rem;
        color: var(--color-accent-gold, #c6a779);
        opacity: 0.6;
        display: block;
        margin-bottom: 0.75rem;
        line-height: 1;
      }

      h3 { margin-bottom: 0.75rem; font-size: 1.25rem; }
      p { font-size: 0.925rem; line-height: 1.7; }
    }

    @media (max-width: 992px) {
      .story-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .pillars-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .about-hero { padding: 2rem 0; }
      .story-media .story-img { height: 260px; object-fit: cover; width: 100%; border-radius: var(--radius-md, 14px); }
      .pillar-card { padding: 1.5rem 1.15rem; }
    }
  `]
})
export class AboutComponent {}
