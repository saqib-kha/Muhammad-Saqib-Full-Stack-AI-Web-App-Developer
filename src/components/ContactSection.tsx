import { useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { submitContactMessage } from '../lib/insforge';
import LaptopMockup from './LaptopMockup';
import { FourPointStar } from './Navbar';

export interface ContactLinksState {
  email: string;
  linkedin: string;
  github: string;
}

interface ContactSectionProps {
  portraitSrc: string;
  contactLinks: ContactLinksState;
}

interface FormValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const PROJECT_TYPES = [
  'Full Stack Web Application',
  'AI-Powered Web App',
  'E-Commerce Website',
  'WordPress Website',
  'Professional Opportunity / Collaboration',
];

export default function ContactSection({
  portraitSrc,
  contactLinks,
}: ContactSectionProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    projectType: PROJECT_TYPES[0],
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopiedKey(null);
    }
  };

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim() || form.message.trim().length < 12) {
      nextErrors.message = 'Please share a brief message (at least 12 characters).';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContactMessage({
        name: values.name,
        email: values.email,
        projectType: values.projectType,
        message: values.message,
      });

      if (!result.ok) {
        setSubmitError(
          result.error || 'Unable to send your message right now. Please try again.'
        );
        return;
      }

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues({
      name: '',
      email: '',
      projectType: PROJECT_TYPES[0],
      message: '',
    });
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  const contactItems = [
    {
      key: 'email',
      label: 'Email',
      displayValue: contactLinks.email,
      copyValue: contactLinks.email,
      href: `mailto:${contactLinks.email}`,
      external: false,
      icon: Mail,
      copyable: true,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      displayValue: 'linkedin.com/in/muhammad-saqib-270207403',
      copyValue: contactLinks.linkedin,
      href: contactLinks.linkedin,
      external: true,
      icon: Linkedin,
      copyable: true,
    },
    {
      key: 'github',
      label: 'GitHub',
      displayValue: 'github.com/saqib-kha',
      copyValue: contactLinks.github,
      href: contactLinks.github,
      external: true,
      icon: Github,
      copyable: true,
    },
    {
      key: 'location',
      label: 'Location',
      displayValue: PROFILE.location,
      copyValue: PROFILE.location,
      href: undefined,
      external: false,
      icon: MapPin,
      copyable: false,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 w-full bg-[#060606]"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        {/* TOP ROW: Exact 3-Column Editorial Match to Reference Image */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left: Heading, Description, Red Circular Arrow CTA */}
          <div className="lg:col-span-4">
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-bold leading-[1.08] tracking-[0.04em] text-white uppercase"
            >
              <span className="block">{PROFILE.contactTitleLine1}</span>
              <span className="inline-flex items-center gap-3">
                <span>{PROFILE.contactTitleLine2}</span>
                <FourPointStar className="h-4 w-4 text-[#D91C24]" />
              </span>
            </h2>

            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-neutral-300/90">
              {PROFILE.contactDescription}
            </p>

            <button
              type="button"
              onClick={() => {
                nameInputRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
                window.setTimeout(() => nameInputRef.current?.focus(), 350);
              }}
              className="group mt-8 inline-flex min-h-[44px] items-center gap-3.5 text-left cursor-pointer"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D91C24]/60 bg-[#D91C24]/10 text-[#D91C24] transition-colors duration-200 group-hover:bg-[#D91C24] group-hover:text-white">
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.16em] text-[#D91C24] uppercase transition-colors group-hover:text-white">
                {PROFILE.availability}
              </span>
            </button>
          </div>

          {/* Middle: Stacked Circular Red-Outlined Contact Links & Location */}
          <div className="lg:col-span-4">
            <ul className="divide-y divide-white/[0.08]">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const isCopied = copiedKey === item.key;
                return (
                  <li
                    key={item.key}
                    className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D91C24]/45 bg-[#120607] text-neutral-200">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-medium tracking-[0.14em] text-neutral-500 uppercase">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="block truncate text-xs sm:text-[13px] font-normal text-neutral-200 transition-colors hover:text-[#D91C24]"
                          >
                            {item.displayValue}
                          </a>
                        ) : (
                          <span className="block truncate text-xs sm:text-[13px] font-normal text-neutral-200">
                            {item.displayValue}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.key, item.copyValue)}
                        aria-label={`Copy ${item.label}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/[0.02] text-neutral-400 transition-colors hover:border-[#D91C24]/60 hover:text-white cursor-pointer"
                        title="Copy value"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: Premium Laptop Mockup Displaying the Portfolio */}
          <div className="lg:col-span-4">
            <LaptopMockup portraitSrc={portraitSrc} />
          </div>
        </div>

        {/* DIRECT MESSAGE CONTACT FORM WITH VALIDATION */}
        <div className="mt-14 border-t border-white/10 pt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#D91C24] uppercase">
                DIRECT INQUIRY
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-[0.04em] text-white uppercase">
                SEND A MESSAGE
              </h3>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-neutral-400">
                Have a web development project, AI web app concept, or role in mind? Fill
                out the form and I will respond promptly.
              </p>
            </div>

            <div className="lg:col-span-8">
              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-start justify-between gap-6 border border-[#D91C24]/40 bg-[#120607] p-6 sm:flex-row sm:items-center sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2
                      className="mt-0.5 h-6 w-6 shrink-0 text-[#D91C24]"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="text-base font-semibold tracking-[0.06em] text-white uppercase">
                        Message Sent Successfully
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
                        Thank you, <span className="text-white font-medium">{values.name}</span>.
                        Your inquiry regarding{' '}
                        <span className="text-white font-medium">{values.projectType}</span>{' '}
                        has been received. I&apos;ll review your message and respond promptly.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[42px] shrink-0 border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:border-[#D91C24] hover:bg-[#D91C24] whitespace-nowrap cursor-pointer"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                      >
                        Full Name <span className="text-[#D91C24]">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => {
                          setValues((prev) => ({ ...prev, name: e.target.value }));
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder="Your full name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        className={`mt-2 w-full min-h-[44px] border bg-[#0C0C0E] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 transition-colors focus:border-[#D91C24] focus:outline-none ${
                          errors.name ? 'border-[#D91C24]' : 'border-white/15'
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="contact-name-error"
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-[#F0444C]"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                      >
                        Email Address <span className="text-[#D91C24]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => {
                          setValues((prev) => ({ ...prev, email: e.target.value }));
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="you@company.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        className={`mt-2 w-full min-h-[44px] border bg-[#0C0C0E] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 transition-colors focus:border-[#D91C24] focus:outline-none ${
                          errors.email ? 'border-[#D91C24]' : 'border-white/15'
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="contact-email-error"
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-[#F0444C]"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-project-type"
                      className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                    >
                      Project or Opportunity Type
                    </label>
                    <select
                      id="contact-project-type"
                      name="projectType"
                      value={values.projectType}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, projectType: e.target.value }))
                      }
                      className="mt-2 w-full min-h-[44px] border border-white/15 bg-[#0C0C0E] px-4 py-2.5 text-sm text-white transition-colors focus:border-[#D91C24] focus:outline-none"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#0D0D0F] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="contact-message"
                        className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                      >
                        Message <span className="text-[#D91C24]">*</span>
                      </label>
                      <span className="text-[11px] text-neutral-500 tabular-nums">
                        {values.message.trim().length} chars
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, message: e.target.value }));
                        if (errors.message) {
                          setErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder="Tell me about your project scope, goals, or collaboration opportunity..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={`mt-2 w-full border bg-[#0C0C0E] px-4 py-3 text-sm text-white placeholder:text-neutral-600 transition-colors focus:border-[#D91C24] focus:outline-none ${
                        errors.message ? 'border-[#D91C24]' : 'border-white/15'
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="contact-message-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-[#F0444C]"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2.5 border border-[#D91C24]/50 bg-[#180708] px-4 py-3 text-xs text-[#F47278]"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-neutral-500">
                      Fields marked with <span className="text-[#D91C24]">*</span> are required.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[44px] items-center gap-2.5 border border-[#D91C24] bg-[#D91C24] px-6 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors duration-200 hover:bg-[#B8141B] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                    >
                      <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                      {submitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
