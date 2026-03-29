"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PageKey = "home" | "services" | "about" | "contact";

export default function Home() {
  const LOGO_SRC = useMemo(() => "/D%20logo%20transparent.png", []);

  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProg, setScrollProg] = useState(0);

  const [email, setEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);
  const [notifyError, setNotifyError] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyServerError, setNotifyServerError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactService, setContactService] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const [expandedTeamCard, setExpandedTeamCard] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const makeIntro = useCallback((text: string, maxLen: number) => {
    const t = (text ?? "").replace(/\s+/g, " ").trim();
    if (t.length <= maxLen) return t;
    const cut = t.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > Math.floor(maxLen * 0.6) ? cut.slice(0, lastSpace) : cut).trimEnd();
  }, []);

  const executiveCouncil = useMemo(
    () => [
      {
        initial: "R",
        photoSrc: "/ceo_pf.jpeg",
        name: "Raiyan Ferdous Tridib",
        role: "Chief Executive Officer",
        email: "ra1yan@dizverse.online",
        bio:
          "Architects the vision and strategic roadmap of Dizverse with a precision-driven mindset. From overseeing complex workflows to high-level decision-making, ensures every operation reflects the technical accuracy and innovative spirit our brand stands for delivering a world-class experience for every client.",
      },
      {
        initial: "T",
        photoSrc: "/coo_pf.jpeg",
        name: "Tahrima Hossain Nova",
        role: "Chief Operating Officer",
        email: "tahrimanova@dizverse.online",
        bio:
          "Orchestrates the operational backbone of Dizverse, ensuring our internal systems, HR, and financial frameworks are optimized for scale. By streamlining administrative workflows, guarantees that our team stays focused on delivering excellence for every client project.",
      },
      {
        initial: "S",
        photoSrc: "/cco_pf.jpeg",
        name: "Shihab Sharar Ariq",
        role: "Chief Creative Officer",
        email: "ariq@dizverse.online",
        bio:
          "Defines the visual soul and creative identity of every project at Dizverse. Leading our design and creative teams, ensures that every graphic, interface, and visual asset is not just aesthetically stunning, but strategically impactful.",
      },
      {
        initial: "M",
        photoSrc: "/cso_pf.jpeg",
        name: "Mubtasim Al Mueed",
        role: "Chief Sales Officer",
        email: "mueed@dizverse.online",
        bio:
          "Drives the commercial success of Dizverse by mastering the client journey from first contact to successful onboarding. Focused on building lasting partnerships, ensures every client finds the perfect service mix to meet their unique business goals.",
      },
      {
        initial: "CTO",
        photoSrc: "",
        name: "CTO",
        role: "Chief Technology Officer",
        email: "cto@dizverse.online",
        bio:
          "Architects the technology roadmap at Dizverse, leading our development team with a focus on high-performance tech stacks and code quality. From complex web apps to innovative digital solutions, ensures our tech delivery is always ahead of the curve.",
      },
      {
        initial: "CMO",
        photoSrc: "",
        name: "CMO",
        role: "Chief Marketing Officer",
        email: "cmo@dizverse.online",
        bio:
          "Commands the brand narrative and growth engine for both Dizverse and our clients. By crafting data-driven campaigns and high-converting marketing funnels, turns digital traffic into tangible business growth and brand authority.",
      },
    ],
    []
  );

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const triggerReveals = useCallback(
    (page: PageKey) => {
      if (typeof window === "undefined") return;

      const root = document.getElementById(`page-${page}`);
      if (!root) return;

      const pending = Array.from(root.querySelectorAll<HTMLElement>(".reveal:not(.visible)"));
      if (pending.length === 0) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e, i) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            window.setTimeout(() => el.classList.add("visible"), i * 100);
            obs.unobserve(el);
          });
        },
        { threshold: 0.07 },
      );

      pending.forEach((el) => obs.observe(el));

      return () => obs.disconnect();
    },
    [],
  );

  const goTo = useCallback(
    (page: PageKey) => {
      if (page === currentPage || isTransitioning) return;

      setIsTransitioning(true);
      window.setTimeout(() => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
        window.setTimeout(() => {
          triggerReveals(page);
          setIsTransitioning(false);
        }, 50);
      }, 220);
    },
    [currentPage, isTransitioning, triggerReveals],
  );

  // scroll progress + nav scrolled state
  useEffect(() => {
    const onScroll = () => {
      const denom = document.body.scrollHeight - window.innerHeight;
      const p = denom > 0 ? (window.scrollY / denom) * 100 : 0;
      setScrollProg(Number.isFinite(p) ? p : 0);
      setScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDashboardNavigation = () => {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    const userDepartment = localStorage.getItem('userDepartment');
    
    console.log('Dashboard Navigation Check:', { currentUser, userRole, userDepartment });
    
    if (currentUser && userRole) {
      // User is logged in, redirect to appropriate dashboard
      if (userRole === 'admin' && currentUser === 'ra1yan@dizverse.online') {
        window.location.href = '/admin';
      } else if (userRole === 'staff') {
        // Check department for staff users
        if (userDepartment === 'operations') {
          console.log('Redirecting to Operations Dashboard');
          window.location.href = '/dashboard/operations';
        } else {
          console.log('Redirecting to Staff Dashboard');
          window.location.href = '/dashboard/staff';
        }
      } else if (userRole === 'user') {
        window.location.href = '/dashboard/user';
      } else {
        // Invalid role, redirect to auth
        window.location.href = '/auth';
      }
    } else {
      // No active session, redirect to auth
      window.location.href = '/auth';
    }
  };

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    };

    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = window.requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    raf = window.requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("a,button,input,select,textarea"),
    );

    const onEnter = () => {
      ring.style.width = "54px";
      ring.style.height = "54px";
    };
    const onLeave = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [currentPage]);

  // reveal on initial load + page changes
  useEffect(() => {
    triggerReveals(currentPage);
  }, [currentPage, triggerReveals]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleNotify = useCallback(async () => {
    if (notifyDone || notifyLoading) return;
    setNotifyServerError(null);

    const ok = email.trim().length > 3 && email.includes("@");
    if (!ok) {
      setNotifyError(true);
      window.setTimeout(() => setNotifyError(false), 1500);
      return;
    }

    try {
      setNotifyLoading(true);
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setNotifyServerError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setNotifyDone(true);
    } catch (err) {
      setNotifyServerError("Network error. Please try again.");
    } finally {
      setNotifyLoading(false);
    }
  }, [email, notifyDone, notifyLoading]);

  const handleSubmit = useCallback(async () => {
    if (messageSent || contactLoading) return;
    setContactError(null);

    if (!firstName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError("First name, email, and message are required.");
      return;
    }

    try {
      setContactLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: contactEmail,
          service: contactService,
          message: contactMessage,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setContactError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setMessageSent(true);
    } catch (err) {
      setContactError("Network error. Please try again.");
    } finally {
      setContactLoading(false);
    }
  }, [messageSent, contactLoading, firstName, lastName, contactEmail, contactService, contactMessage]);

  const toggleFaq = useCallback((index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  }, [expandedFaq]);

  const pageClass = useCallback(
    (key: PageKey) => `page${currentPage === key ? " active" : ""}`,
    [currentPage],
  );

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef} />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} />
      <div className="scroll-prog" id="scrollProg" style={{ width: `${scrollProg}%` }} />
      <div className={`page-transition${isTransitioning ? " show" : ""}`} id="pageTransition" />
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* MOBILE MENU */}
      <div className={`mobile-menu${isMobileMenuOpen ? " open" : ""}`} id="mobileMenu">
        <button className="mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
          ✕
        </button>
        <button
          className="nav-link"
          onClick={() => {
            goTo("home");
            closeMobileMenu();
          }}
        >
          Home
        </button>
        <button
          className="nav-link"
          onClick={() => {
            goTo("services");
            closeMobileMenu();
          }}
        >
          Services
        </button>
        <button
          className="nav-link"
          onClick={() => {
            goTo("about");
            closeMobileMenu();
          }}
        >
          About
        </button>
        <button
          className="nav-link"
          onClick={() => {
            goTo("contact");
            closeMobileMenu();
          }}
        >
          Contact
        </button>
        <button
          className="nav-cta"
          onClick={() => {
            goTo("contact");
            closeMobileMenu();
          }}
        >
          Get in Touch
        </button>
        <button
          className="nav-cta"
          onClick={() => {
            handleDashboardNavigation();
            closeMobileMenu();
          }}
          style={{ background: "var(--neon2)" }}
        >
          Dashboard
        </button>
      </div>

      {/* NAV */}
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo" onClick={() => goTo("home")}>
<Image
            src={LOGO_SRC}
            alt="DizVerse"
            width={180}
            height={180}
            priority
            style={{ height: 100, width: "auto" }}
          />
          <span className="nav-logo-text" />
        </div>
        <div className="nav-right">
          <button
            className={`nav-link${currentPage === "home" ? " active" : ""}`}
            data-page="home"
            onClick={() => goTo("home")}
          >
            Home
          </button>
          <button
            className={`nav-link${currentPage === "services" ? " active" : ""}`}
            data-page="services"
            onClick={() => goTo("services")}
          >
            Services
          </button>
          <button
            className={`nav-link${currentPage === "about" ? " active" : ""}`}
            data-page="about"
            onClick={() => goTo("about")}
          >
            About
          </button>
          <button
            className={`nav-link${currentPage === "contact" ? " active" : ""}`}
            data-page="contact"
            onClick={() => goTo("contact")}
          >
            Contact
          </button>
          <button className="nav-cta" onClick={() => goTo("contact")}>
            Get in Touch
          </button>
          <button 
            className="nav-cta" 
            onClick={handleDashboardNavigation}
            style={{ marginLeft: "10px", background: "var(--neon2)" }}
          >
            Dashboard
          </button>
        </div>
        <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ══════════════ PAGE: HOME ══════════════ */}
      <div className={pageClass("home")} id="page-home">
        <div className="hero">
          <div className="hero-status">
            <div className="pulse-dot" />
            Full-Service Digital Solutions Agency
          </div>
          <h1 className="hero-brand">
            <span className="w1">DIZ</span>
            <span className="sp" />
            <span className="w2">VERSE</span>
          </h1>
          <div className="coming-block">
            <div className="coming-text">
              <span className="shimmer" />
              ⚡ &nbsp;We&apos;re Coming With Something Big — Stay Tuned&nbsp; ⚡
            </div>
          </div>
          <p className="hero-sub">
            A full-service digital solutions company built to help businesses grow, scale, and succeed. Structured teams. Clear
            processes. Results-driven mindset.
          </p>
          <div className="notify-wrap">
            <div className="notify-form">
              <input
                type="email"
                id="emailInput"
                placeholder="your@email.com — be first to know"
                value={email}
                disabled={notifyDone || notifyLoading}
                onChange={(e) => setEmail(e.target.value)}
                style={notifyError ? { borderColor: "#ff4466" } : undefined}
              />
              <button
                onClick={handleNotify}
                disabled={notifyDone || notifyLoading}
                style={notifyDone ? { background: "var(--neon2)" } : undefined}
              >
                {notifyDone ? "✓ You're on the list!" : notifyLoading ? "Sending..." : "Notify Me"}
              </button>
            </div>
            <p className="notify-note">Zero spam. Launch updates only.</p>
            {notifyServerError && (
              <p className="notify-note" style={{ color: "#ff6677" }}>
                {notifyServerError}
              </p>
            )}
          </div>
          <div className="hero-pages">
            <button className="hero-page-btn" onClick={() => goTo("services")}>
              <span>⚙ Our Services</span>
            </button>
            <button className="hero-page-btn" onClick={() => goTo("about")}>
              <span>◈ About Us</span>
            </button>
            <button className="hero-page-btn" onClick={() => goTo("contact")}>
              <span>✦ Get in Touch</span>
            </button>
          </div>
        </div>
        <footer>
          <div className="footer-brand" onClick={() => goTo("home")}>
            <Image
              src={LOGO_SRC}
              alt="DizVerse"
              width={90}
              height={90}
              style={{ height: 50, width: "auto" }}
            />
            <span>DIZVERSE</span>
          </div>
          <div className="footer-copy">© 2025 DizVerse. All rights reserved.</div>
          <div className="footer-links">
            <button onClick={() => goTo("services")}>Services</button>
            <button onClick={() => goTo("about")}>About</button>
            <button onClick={() => goTo("contact")}>Contact</button>
          </div>
        </footer>
      </div>

      {/* ══════════════ PAGE: SERVICES ══════════════ */}
      <div className={pageClass("services")} id="page-services">
        <div className="page-hero">
          <div className="page-eyebrow">What We Do</div>
          <h1 className="page-title">
            Our <span className="accent">Services</span>
          </h1>
          <p className="page-sub">
            End-to-end digital capabilities across development, design, marketing, and growth — everything your business needs to
            thrive.
          </p>
        </div>
        <div className="content-wrap">
          <div className="dept-block reveal">
            <div className="dept-header">
              <div className="dept-icon">⚙️</div>
              <div>
                <div className="dept-name">Development</div>
                <div className="dept-tag">Websites · Apps · APIs · Backend Systems</div>
              </div>
            </div>
            <div className="cards-grid">
              <div className="svc-card">
                <div className="svc-num">01 //</div>
                <div className="svc-icon">🌐</div>
                <div className="svc-name">Web Development</div>
                <div className="svc-desc">
                  Custom websites and web apps built for performance, SEO, and scale. Fast, secure, and mobile-first.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">React</span>
                  <span className="svc-tag">Next.js</span>
                  <span className="svc-tag">WordPress</span>
                  <span className="svc-tag">Node</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">02 //</div>
                <div className="svc-icon">📱</div>
                <div className="svc-name">App Development</div>
                <div className="svc-desc">
                  Native and cross-platform mobile apps with polished UX on iOS and Android with robust backend infrastructure.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Flutter</span>
                  <span className="svc-tag">React Native</span>
                  <span className="svc-tag">iOS</span>
                  <span className="svc-tag">Android</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">03 //</div>
                <div className="svc-icon">🔌</div>
                <div className="svc-name">API &amp; Backend Systems</div>
                <div className="svc-desc">
                  Scalable backend architecture, REST &amp; GraphQL APIs, database design, and third-party integrations.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">REST</span>
                  <span className="svc-tag">GraphQL</span>
                  <span className="svc-tag">Firebase</span>
                  <span className="svc-tag">AWS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dept-block reveal">
            <div className="dept-header">
              <div className="dept-icon">🎨</div>
              <div>
                <div className="dept-name">Creative</div>
                <div className="dept-tag">Design · Branding · Video · Motion · 3D</div>
              </div>
            </div>
            <div className="cards-grid">
              <div className="svc-card">
                <div className="svc-num">04 //</div>
                <div className="svc-icon">🖋️</div>
                <div className="svc-name">Branding &amp; Identity</div>
                <div className="svc-desc">
                  Logo design, brand guidelines, color systems, typography, and complete visual identity packages.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Logo</span>
                  <span className="svc-tag">Brand Guide</span>
                  <span className="svc-tag">Packaging</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">05 //</div>
                <div className="svc-icon">🖥️</div>
                <div className="svc-name">UI/UX Design</div>
                <div className="svc-desc">
                  User-centered interface design and flows for websites and apps — wireframes to pixel-perfect screens.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Figma</span>
                  <span className="svc-tag">Wireframes</span>
                  <span className="svc-tag">Prototypes</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">06 //</div>
                <div className="svc-icon">🎬</div>
                <div className="svc-name">Video &amp; Animation</div>
                <div className="svc-desc">
                  Video editing, motion graphics, explainer videos, reels, and 3D animations that drive engagement.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Motion</span>
                  <span className="svc-tag">3D</span>
                  <span className="svc-tag">Reels</span>
                  <span className="svc-tag">After Effects</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">07 //</div>
                <div className="svc-icon">🖼️</div>
                <div className="svc-name">Graphic Design</div>
                <div className="svc-desc">
                  Social media graphics, banners, presentations, marketing materials, and print-ready design assets.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Social Graphics</span>
                  <span className="svc-tag">Banners</span>
                  <span className="svc-tag">Print</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dept-block reveal">
            <div className="dept-header">
              <div className="dept-icon">📡</div>
              <div>
                <div className="dept-name">Marketing</div>
                <div className="dept-tag">Traffic · Campaigns · SEO · Social · Email</div>
              </div>
            </div>
            <div className="cards-grid">
              <div className="svc-card">
                <div className="svc-num">08 //</div>
                <div className="svc-icon">🔍</div>
                <div className="svc-name">SEO Optimization</div>
                <div className="svc-desc">
                  On-page, off-page, and technical SEO strategies to improve rankings and build lasting organic authority.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">On-Page</span>
                  <span className="svc-tag">Technical</span>
                  <span className="svc-tag">Link Building</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">09 //</div>
                <div className="svc-icon">💰</div>
                <div className="svc-name">Paid Advertising</div>
                <div className="svc-desc">
                  ROI-focused ad campaigns on Google, Meta, LinkedIn, TikTok — from strategy to creative to optimization.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Google Ads</span>
                  <span className="svc-tag">Meta Ads</span>
                  <span className="svc-tag">TikTok</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">10 //</div>
                <div className="svc-icon">📲</div>
                <div className="svc-name">Social Media Management</div>
                <div className="svc-desc">
                  Full management of your channels — content calendars, posting, community engagement, and growth.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Instagram</span>
                  <span className="svc-tag">LinkedIn</span>
                  <span className="svc-tag">TikTok</span>
                  <span className="svc-tag">X</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">11 //</div>
                <div className="svc-icon">✉️</div>
                <div className="svc-name">Email Marketing</div>
                <div className="svc-desc">
                  Automated sequences, newsletters, and drip campaigns designed to nurture leads and retain customers.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Automation</span>
                  <span className="svc-tag">Klaviyo</span>
                  <span className="svc-tag">Mailchimp</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">12 //</div>
                <div className="svc-icon">✍️</div>
                <div className="svc-name">Content Writing</div>
                <div className="svc-desc">
                  SEO blogs, ad copies, website copy, product descriptions, and long-form content built for results.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Blogs</span>
                  <span className="svc-tag">Copywriting</span>
                  <span className="svc-tag">Scripts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dept-block reveal">
            <div className="dept-header">
              <div className="dept-icon">🚀</div>
              <div>
                <div className="dept-name">Sales &amp; Growth</div>
                <div className="dept-tag">Funnels · CRM · Strategy · Onboarding</div>
              </div>
            </div>
            <div className="cards-grid">
              <div className="svc-card">
                <div className="svc-num">13 //</div>
                <div className="svc-icon">🎯</div>
                <div className="svc-name">Sales Funnel Design</div>
                <div className="svc-desc">
                  End-to-end funnel strategy and execution — from lead capture to conversion, built to maximise revenue.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">Landing Pages</span>
                  <span className="svc-tag">Lead Gen</span>
                  <span className="svc-tag">Conversion</span>
                </div>
              </div>
              <div className="svc-card">
                <div className="svc-num">14 //</div>
                <div className="svc-icon">📊</div>
                <div className="svc-name">CRM &amp; Automation</div>
                <div className="svc-desc">
                  CRM setup, pipeline management, and sales automation to streamline your process and close more deals.
                </div>
                <div className="svc-tags">
                  <span className="svc-tag">HubSpot</span>
                  <span className="svc-tag">Zoho</span>
                  <span className="svc-tag">Automation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <div className="footer-brand" onClick={() => goTo("home")}>
            <Image
              src={LOGO_SRC}
              alt="DizVerse"
              width={90}
              height={90}
              style={{ height: 50, width: "auto" }}
            />
            <span>DIZVERSE</span>
          </div>
          <div className="footer-copy">© 2025 DizVerse. All rights reserved.</div>
          <div className="footer-links">
            <button onClick={() => goTo("services")}>Services</button>
            <button onClick={() => goTo("about")}>About</button>
            <button onClick={() => goTo("contact")}>Contact</button>
          </div>
        </footer>
      </div>

      {/* ══════════════ PAGE: ABOUT ══════════════ */}
      <div className={pageClass("about")} id="page-about">
        <div className="page-hero">
          <div className="page-eyebrow">Who We Are</div>
          <h1 className="page-title">
            About <span className="accent">DizVerse</span>
          </h1>
        </div>
        <div className="content-wrap">
          <div className="two-col reveal">
            <div className="panel">
              <div className="panel-label">Our Mission</div>
              <div className="panel-heading">
                Building <em>long-term partnerships</em> and future-ready digital ecosystems
              </div>
              <div className="panel-body">
                <p>
                  DizVerse is a full-service digital solutions company built to help businesses grow, scale, and succeed in the digital
                  world. We work with a structured team, clear processes, and a results-driven mindset to deliver impactful digital
                  experiences.
                </p>
                <p>
                  We believe that great results come from strong collaboration. Our dedicated departments work together to ensure quality,
                  consistency, and measurable outcomes for every project.
                </p>
                <p>
                  DizVerse is not just about delivering services — it&apos;s about building long-term partnerships, scalable solutions, and
                  future-ready teams. Let&apos;s build, grow, and create impact together. ✨
                </p>
              </div>
            </div>
            <div className="panel">
              <div className="panel-label">Our Vision</div>
              <div className="panel-heading">
                To become the most <em>trusted digital partner</em> for businesses worldwide
              </div>
              <div className="panel-body">
                <p>
                  We envision a world where every business has access to world-class digital expertise under one roof — a partner that
                  thinks strategically alongside you, not just one that executes tasks.
                </p>
                <p>
                  Our structured team of experts across development, creative, marketing, and operations ensures every project is handled
                  with precision, creativity, and accountability.
                </p>
                <p>
                  Every service we deliver is built on three pillars:{" "}
                  <strong style={{ color: "var(--neon)" }}>Quality</strong>,{" "}
                  <strong style={{ color: "var(--neon)" }}>Consistency</strong>, and{" "}
                  <strong style={{ color: "var(--neon)" }}>Measurable Impact</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="values-grid reveal" style={{ marginTop: 3 }}>
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <div className="value-title">Results-Driven</div>
              <div className="value-desc">
                Every decision and deliverable is tied to measurable outcomes. We care about your growth, not just your approval.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <div className="value-title">True Partnership</div>
              <div className="value-desc">
                We build long-term relationships rooted in trust, transparency, and shared success — not one-off transactions.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <div className="value-title">Structured Excellence</div>
              <div className="value-desc">
                Clear processes, defined roles, and structured workflows ensure quality and deadlines are never compromised.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <div className="value-title">Global Mindset</div>
              <div className="value-desc">
                Remote-first and worldwide-ready. We work with businesses across industries and geographies without limits.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">🔮</div>
              <div className="value-title">Future-Ready</div>
              <div className="value-desc">
                Every product, campaign, and strategy is designed to scale and grow alongside your business long-term.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <div className="value-title">Creative Innovation</div>
              <div className="value-desc">
                We merge creative thinking with technical precision to produce work that&apos;s not just good — but genuinely outstanding.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 38 }} className="reveal">
            <div className="sub-label">Our Departments</div>
            <div className="dept-row">
              <div className="dept-card">
                <div className="dept-card-icon">⚙️</div>
                <div className="dept-card-name">Development</div>
                <div className="dept-card-desc">Web · App · API · QA · UI/UX</div>
              </div>
              <div className="dept-card">
                <div className="dept-card-icon">🎨</div>
                <div className="dept-card-name">Creative</div>
                <div className="dept-card-desc">Design · Video · Animation · 3D</div>
              </div>
              <div className="dept-card">
                <div className="dept-card-icon">📡</div>
                <div className="dept-card-name">Marketing</div>
                <div className="dept-card-desc">SEO · Ads · Social · Email · Content</div>
              </div>
              <div className="dept-card">
                <div className="dept-card-icon">🚀</div>
                <div className="dept-card-name">Sales</div>
                <div className="dept-card-desc">Leads · Proposals · CRM · Onboarding</div>
              </div>
              <div className="dept-card">
                <div className="dept-card-icon">🏗️</div>
                <div className="dept-card-name">Operations</div>
                <div className="dept-card-desc">HR · Finance · Admin · Delivery</div>
              </div>
            </div>
          </div>

          <div className="team-section reveal" style={{ marginTop: 38 }}>
            <div className="team-label">Our Team</div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 24, maxWidth: "540px" }}>
              Meet the Executive Council driving DizVerse&apos;s vision and growth.
            </p>
            <div className="team-grid">
              {executiveCouncil.map((member, index) => {
                const fullBio = (member.bio ?? "").replace(/\s+/g, " ").trim();
                const introText = makeIntro(fullBio, 90);
                const hasMore = fullBio.length > introText.length + 5;
                const isExpanded = expandedTeamCard === index;
                const toggleLabel = isExpanded ? "read less" : "read more";
                return (
                  <div key={index} className="team-card">
                    {member.photoSrc ? (
                      <div className="team-card-photo-wrap">
                        <Image
                          src={member.photoSrc}
                          alt={member.name}
                          width={120}
                          height={120}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="team-card-initial">{member.initial}</div>
                    )}
                    <div className="team-card-body">
                      <div className="team-card-name">{member.name}</div>
                      <div className="team-card-role">{member.role}</div>
                      <div className="team-card-email">
                        <Image
                          src="/envelope.svg"
                          alt=""
                          width={18}
                          height={18}
                          className="team-card-email-icon"
                        />
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </div>
                      <div className="team-card-intro">
                        {isExpanded ? (
                          <div className="team-card-intro-full">
                            <span className="team-card-intro-text">
                              {fullBio}
                              {hasMore && (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  className="team-card-read-more"
                                  onClick={() => setExpandedTeamCard(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setExpandedTeamCard(null);
                                    }
                                  }}
                                  aria-expanded={true}
                                >
                                  {" "}{toggleLabel}
                                </span>
                              )}
                            </span>
                          </div>
                        ) : (
                          <div className="team-card-intro-twoline">
                            <span className="team-card-intro-text">
                              {introText}{hasMore ? " " : ""}
                              {hasMore && (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  className="team-card-read-more"
                                  onClick={() => setExpandedTeamCard(index)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setExpandedTeamCard(index);
                                    }
                                  }}
                                  aria-expanded={false}
                                >
                                  {toggleLabel}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <footer>
          <div className="footer-brand" onClick={() => goTo("home")}>
            <Image
              src={LOGO_SRC}
              alt="DizVerse"
              width={90}
              height={90}
              style={{ height: 50, width: "auto" }}
            />
            <span>DIZVERSE</span>
          </div>
          <div className="footer-copy">© 2025 DizVerse. All rights reserved.</div>
          <div className="footer-links">
            <button onClick={() => goTo("services")}>Services</button>
            <button onClick={() => goTo("about")}>About</button>
            <button onClick={() => goTo("contact")}>Contact</button>
          </div>
        </footer>
      </div>

      {/* ══════════════ PAGE: CONTACT ══════════════ */}
      <div className={pageClass("contact")} id="page-contact">
        <div className="page-hero">
          <div className="page-eyebrow">Reach Out</div>
          <h1 className="page-title">
            Get In <span className="accent">Touch</span>
          </h1>
          <p className="page-sub">
            We&apos;re gearing up for launch and already taking on select projects. Drop us a message — we respond within 6 hours.
          </p>
        </div>
        <div className="content-wrap">
          <div className="contact-main reveal">
            <div className="contact-info">
              <div className="info-label">Contact Info</div>
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div>
                  <div className="info-key">Email</div>
                  <div className="info-val">
                    <a href="mailto:official@dizverse.online">official@dizverse.online</a>
                  </div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🌐</div>
                <div>
                  <div className="info-key">Website</div>
                  <div className="info-val">
                    <a href="https://dizverse.online/" target="_blank" rel="noopener noreferrer">
                      www.dizverse.online
                    </a>
                  </div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <div className="info-key">Location</div>
                  <div className="info-val">Remote · Worldwide</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">⏱️</div>
                <div>
                  <div className="info-key">Response Time</div>
                  <div className="info-val">Within 6 Hours</div>
                </div>
              </div>
              <div style={{ marginTop: 28, padding: 18, border: "1px solid var(--border)", background: "rgba(0,240,255,.03)" }}>
                <p style={{ fontSize: ".8rem", color: "var(--muted)", lineHeight: 1.75 }}>
                  🚀 <strong style={{ color: "var(--neon)" }}>Launching Soon with more details.</strong> We&apos;re currently taking on select
                  early projects. Reach out now to get priority access and early-bird rates.
                </p>
              </div>
            </div>

            <div className="contact-form-panel">
              <div className="form-label">Send a Message</div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    disabled={messageSent || contactLoading}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    disabled={messageSent || contactLoading}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  disabled={messageSent || contactLoading}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Service Interested In</label>
                <select
                  disabled={messageSent || contactLoading}
                  value={contactService}
                  onChange={(e) => setContactService(e.target.value)}
                >
                  <option value="">Select a service...</option>
                  <option>Web Development</option>
                  <option>App Development</option>
                  <option>API &amp; Backend</option>
                  <option>Branding &amp; Identity</option>
                  <option>UI/UX Design</option>
                  <option>Video &amp; Animation</option>
                  <option>Graphic Design</option>
                  <option>SEO Optimization</option>
                  <option>Paid Advertising</option>
                  <option>Social Media Management</option>
                  <option>Email Marketing</option>
                  <option>Content Writing</option>
                  <option>Sales Funnel Design</option>
                  <option>CRM &amp; Automation</option>
                  <option>Full Package</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your project, goals, or questions..."
                  disabled={messageSent || contactLoading}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={messageSent || contactLoading}
                style={messageSent ? { background: "var(--neon2)" } : undefined}
              >
                {messageSent ? "✓ Message Sent!" : contactLoading ? "Sending..." : "Send Message →"}
              </button>
              {contactError && (
                <p style={{ marginTop: 10, fontSize: ".8rem", color: "#ff6677" }}>{contactError}</p>
              )}
            </div>
          </div>

          <div className="socials-row reveal">
            <a
              href="https://www.linkedin.com/company/diz-verse"
              className="social-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">
                <Image src="/linkedin.png" alt="LinkedIn" width={28} height={28} />
              </span>
              <span className="social-name">LinkedIn</span>
          </a>
          <a
              href="https://www.instagram.com/diz_verse?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              className="social-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
              <span className="social-icon">
                <Image src="/instagram.png" alt="Instagram" width={28} height={28} />
              </span>
              <span className="social-name">Instagram</span>
            </a>
            <a
              href="#"
              className="social-btn"
              onClick={(e) => e.preventDefault()}
              aria-label="Twitter (coming soon)"
            >
              <span className="social-icon" aria-hidden="true">
                𝕏
              </span>
              <span className="social-name">Twitter</span>
            </a>
            <a
              href="#"
              className="social-btn"
              onClick={(e) => e.preventDefault()}
              aria-label="YouTube (coming soon)"
            >
              <span className="social-icon">
                <Image src="/youtube.png" alt="YouTube" width={28} height={28} />
              </span>
              <span className="social-name">YouTube</span>
            </a>
            <a
              href="#"
              className="social-btn"
              onClick={(e) => e.preventDefault()}
              aria-label="TikTok (coming soon)"
            >
              <span className="social-icon">
                <Image src="/tiktok.png" alt="TikTok" width={28} height={28} />
              </span>
              <span className="social-name">TikTok</span>
            </a>
            <a
              href="#"
              className="social-btn"
              onClick={(e) => e.preventDefault()}
              aria-label="Facebook (coming soon)"
            >
              <span className="social-icon">
                <Image src="/facebook.png" alt="Facebook" width={28} height={28} />
              </span>
              <span className="social-name">Facebook</span>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="faq-section reveal" style={{ marginTop: 48 }}>
            <div className="faq-label">Frequently Asked Questions</div>
            <div className="faq-grid">
              <div className={`faq-item${expandedFaq === 0 ? " active" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(0)}>
                  <span>What is your typical project timeline?</span>
                  <span className="faq-arrow">▼</span>
                </div>
                <div className="faq-answer">
                  Project timelines vary based on complexity. A simple website typically takes 2-4 weeks, while complex web applications can take 2-3 months. We provide detailed timelines during the initial consultation phase.
                </div>
              </div>
              <div className={`faq-item${expandedFaq === 1 ? " active" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(1)}>
                  <span>Do you offer ongoing maintenance and support?</span>
                  <span className="faq-arrow">▼</span>
                </div>
                <div className="faq-answer">
                  Yes, we offer comprehensive maintenance and support packages. This includes regular updates, security monitoring, performance optimization, and technical support to ensure your digital assets continue to perform optimally.
                </div>
              </div>
              <div className={`faq-item${expandedFaq === 2 ? " active" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(2)}>
                  <span>How much does a typical website cost?</span>
                  <span className="faq-arrow">▼</span>
                </div>
                <div className="faq-answer">
                  Website costs vary based on features and complexity. Basic websites start from $1,000, while advanced web applications can range from $5,000 to $25,000+. We provide detailed quotes after understanding your specific requirements.
                </div>
              </div>
              <div className={`faq-item${expandedFaq === 3 ? " active" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(3)}>
                  <span>What information do you need to start a project?</span>
                  <span className="faq-arrow">▼</span>
                </div>
                <div className="faq-answer">
                  We typically need your business goals, target audience, desired features, timeline, budget range, and any existing branding materials. The more details you provide, the better we can tailor our solution to your needs.
                </div>
              </div>
              <div className={`faq-item${expandedFaq === 4 ? " active" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(4)}>
                  <span>Do you help with content creation?</span>
                  <span className="faq-arrow">▼</span>
                </div>
                <div className="faq-answer">
                  Yes, we offer comprehensive content creation services including copywriting, graphic design, video production, and social media content. Our creative team can help develop engaging content that aligns with your brand voice and objectives.
                </div>
              </div>
              <div className={`faq-item${expandedFaq === 5 ? " active" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(5)}>
                  <span>What technologies do you work with?</span>
                  <span className="faq-arrow">▼</span>
                </div>
                <div className="faq-answer">
                  We work with modern technologies including React, Next.js, Node.js, Python, Flutter, and various cloud platforms. Our tech stack is chosen based on your specific project requirements to ensure optimal performance and scalability.
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <div className="footer-brand" onClick={() => goTo("home")}>
            <Image
              src={LOGO_SRC}
              alt="DizVerse"
              width={90}
              height={90}
              style={{ height: 50, width: "auto" }}
            />
            <span>DIZVERSE</span>
          </div>
          <div className="footer-copy">© 2025 DizVerse. All rights reserved.</div>
          <div className="footer-links">
            <button onClick={() => goTo("services")}>Services</button>
            <button onClick={() => goTo("about")}>About</button>
            <button onClick={() => goTo("contact")}>Contact</button>
          </div>
        </footer>
    </div>
    </>
  );
}
