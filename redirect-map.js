// ============================================================
//  Redirect map — old Wix paths → new internal pages
//  Used by 404 page as a client-side fallback for static hosts
//  that don't process the _redirects file.
// ============================================================
window.REDIRECT_MAP = {
  // Home / thank-you
  "/thankyou": "/thank-you",

  // Services & individual treatment pages → services section
  "/services": "/conditions-services#services",
  "/physical-therapy": "/conditions-services#services",
  "/chiropractic-care": "/conditions-services#services",
  "/extracorporeal-shockwave-therapy": "/conditions-services#services",
  "/active-release-technique-art": "/conditions-services#services",
  "/copy-of-pre-post-operation": "/conditions-services#services",   // Dry Needling
  "/pre-post-operation": "/conditions-services#services",
  "/pre-post-natal-care": "/conditions-services#services",
  "/deep-tissue-laser-therapy": "/conditions-services#services",
  "/graston-technique": "/conditions-services#services",
  "/massage-therapy": "/conditions-services#services",
  "/therapeutic-taping": "/conditions-services#services",
  "/occupational-therapy": "/conditions-services#services",

  // About / team
  "/about-us": "/#about",
  "/our-team": "/team",
  "/our-session": "/#resources",

  // Location / contact
  "/our-location": "/#contact",
  "/contact-us-1": "/#contact",
  "/free-consultation": "/#request",

  // Insurance & blog
  "/insurance": "/insurance",
  "/blog": "/blog"
};
