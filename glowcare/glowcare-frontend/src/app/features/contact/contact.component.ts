import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/review-contact.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-page">
      <section class="contact-hero">
        <div class="container">
          <span class="hero-sub">CLIENT CARE & CONCIERGE</span>
          <h1>We Are Here For Your Skin</h1>
          <p>Have questions about formula pairing, order updates, or botanical ingredients? Our skincare specialists are ready to guide you.</p>
        </div>
      </section>

      <div class="container section-padding">
        <div class="contact-grid">
          <!-- Left: Contact Form -->
          <div class="contact-form-card">
            <h3>Send An Inquiry</h3>
            <p class="form-desc">Fill out the form below and an esthetician will get in touch within 24 business hours.</p>

            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label" for="cName">Your Name *</label>
                <input
                  id="cName"
                  type="text"
                  formControlName="name"
                  class="form-control"
                  placeholder="e.g. Maya Lin"
                />
                @if (f['name'].touched && f['name'].invalid) {
                  <span class="form-error">Please provide your name.</span>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="cEmail">Email Address *</label>
                <input
                  id="cEmail"
                  type="email"
                  formControlName="email"
                  class="form-control"
                  placeholder="maya@example.com"
                />
                @if (f['email'].touched && f['email'].invalid) {
                  <span class="form-error">Please provide a valid email.</span>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="cSubject">Topic / Subject *</label>
                <input
                  id="cSubject"
                  type="text"
                  formControlName="subject"
                  class="form-control"
                  placeholder="e.g. Routine consultation or order question"
                />
                @if (f['subject'].touched && f['subject'].invalid) {
                  <span class="form-error">Subject is required.</span>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="cMessage">Message *</label>
                <textarea
                  id="cMessage"
                  formControlName="message"
                  class="form-control"
                  rows="5"
                  placeholder="Tell us about your skin goals, questions, or concerns..."
                ></textarea>
                @if (f['message'].touched && f['message'].invalid) {
                  <span class="form-error">Please write your message.</span>
                }
              </div>

              <button type="submit" class="btn btn-primary btn-lg" [disabled]="isSubmitting || contactForm.invalid">
                {{ isSubmitting ? 'Sending Message...' : 'Send Message' }}
              </button>
            </form>
          </div>

          <!-- Right: Information & FAQ -->
          <div class="contact-info-panel">
            <div class="info-card">
              <h3>Concierge Details</h3>
              <div class="info-items">
                <div class="info-item">
                  <span class="info-icon">📍</span>
                  <div>
                    <strong>Headquarters Apothecary</strong>
                    <p>742 Evergreen Botanical Way, Suite 400<br/>Beverly Hills, CA 90210</p>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">✉️</span>
                  <div>
                    <strong>Client Support Email</strong>
                    <p>concierge&#64;rubycare.com</p>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">📞</span>
                  <div>
                    <strong>Direct Advisory Line</strong>
                    <p>+1 (800) 456-RUBY (7829)</p>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">⏰</span>
                  <div>
                    <strong>Esthetician Hours</strong>
                    <p>Monday – Friday: 8:00 AM – 6:00 PM PST<br/>Saturday: 10:00 AM – 3:00 PM PST</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick FAQ Box -->
            <div class="faq-box mt-4">
              <h4>Frequently Asked Questions</h4>
              <details class="faq-item">
                <summary>Are RubyCare formulations safe during pregnancy?</summary>
                <p>Most of our botanical hydrators and mineral sunscreens are pregnancy safe. Our Bakuchiol peptide treatment is a gentle plant alternative to retinoids, but we always advise consulting your physician.</p>
              </details>
              <details class="faq-item">
                <summary>How long until I see visible results?</summary>
                <p>Surface hydration and calm improve within 48 to 72 hours. Visible lightening of pigmentation and collagen firming typically show significant results between 4 to 8 weeks of consistent daily application.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-hero {
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
      p { max-width: 600px; margin: 0 auto; font-size: 1.05rem; }
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3.5rem;
      align-items: start;
    }

    .contact-form-card, .info-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2.5rem;

      h3 { margin-bottom: 0.5rem; font-size: 1.35rem; }
      .form-desc { font-size: 0.9rem; margin-bottom: 2rem; }
    }

    .info-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1.5rem;

      .info-item {
        display: flex;
        gap: 1rem;
        align-items: flex-start;

        .info-icon { font-size: 1.4rem; }
        strong { font-size: 0.9rem; color: var(--color-charcoal, #1c211e); display: block; margin-bottom: 0.2rem; }
        p { font-size: 0.85rem; color: var(--color-muted, #646d68); margin: 0; line-height: 1.5; }
      }
    }

    .faq-box {
      background: var(--color-beige, #f4efe6);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1.75rem;

      h4 { font-family: var(--font-sans); font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }

      .faq-item {
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--color-border, #e8e2d8);
        padding-bottom: 0.75rem;

        &:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

        summary {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-charcoal, #1c211e);
          cursor: pointer;
        }

        p {
          font-size: 0.825rem;
          line-height: 1.6;
          margin-top: 0.5rem;
        }
      }
    }

    @media (max-width: 992px) {
      .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    }

    @media (max-width: 600px) {
      .contact-hero { padding: 2rem 0; }
      .contact-form-card { padding: 1.5rem 1.15rem; }
      .contact-info-panel .info-card { padding: 1.5rem 1.15rem; }
      .btn { width: 100%; }
    }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly toast = inject(ToastService);

  public isSubmitting: boolean = false;

  public contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  get f() {
    return this.contactForm.controls;
  }

  public onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.contactService.submitContact(this.contactForm.value).subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error submitting message. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
