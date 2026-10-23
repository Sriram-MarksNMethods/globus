/*
  Words for the company pages: Contact, Partner with us, Careers, Privacy policy.
  All copy is taken word for word from globusdevelopers.com unless marked DRAFT.
*/

export const PROJECT_NAMES = ["Neo", "Altus", "Treasor", "Floresta", "Tukkuguda", "Westlyn"];

export const office = {
  address:
    "Globus Infracon LLP, Vaishnavi’s Cymbol, Flat No.7B, Sy. No.345/A, Puppalguda Village Gandipet Mandal, Rangareddy District, Telangana - 500075",
  phones: [
    { label: "+91 95 1978 1978", href: "tel:+919519781978" },
    { label: "+91 040 6975 3333", href: "tel:+914069753333" },
  ],
  email: "info@globusdevelopers.com",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Globus+Developers+Puppalguda",
};

// ---------------------------------------------------------------- Contact
export const contact = {
  heading: ["Get in", "touch"],
  intro:
    "We're here to help and answer any question you might have. We look forward to hearing from you. Fill out the form, and we'll get back to you shortly.",
  details:
    "We’re here to help you take the next step toward your dream home. Whether you have questions about our projects, want to schedule a site visit, or simply wish to speak with a member of our team, we’re just a message or call away. Connect with us through the details below; we’d love to hear from you.",
  consent:
    "I hereby authorize Globus Developers and its authorized representatives to contact me via Call, SMS, Email, or WhatsApp with project updates, offers, and notifications. I understand that this consent shall prevail even if my contact number is registered under DND / NDNC.",
};

// ---------------------------------------------------------------- Partner with us
export const partner = {
  heading: ["Partner", "with us"],
  intro:
    "Join us as a Channel Partner and be part of shaping the future of modern living in Hyderabad. Together, let's bring smart, sustainable, and innovative spaces to life, creating new possibilities and shared success along the way.",
  formTitle: "Partner Registration",
  formNote: "Let's build a successful partnership together.",
  consent: "I authorize Globus Developers to contact me. This consent overrides my registration on DND/NDNC.",
};

// ---------------------------------------------------------------- Careers
export const career = {
  heading: ["Build the future", "with us"],
  intro: "Join a team of visionaries dedicated to creating tomorrow's landmarks and shaping the future of luxury living.",
  poolTitle: "Join Our Talent Pool",
  pool: "Don't see a role that fits? We are always keen to hear from passionate and talented individuals. Submit your details, and we will get in touch if a suitable opportunity arises.",
  formTitle: "Submit Your Profile",
  formNote: "Let us know how you can make a difference.",
  consent: "I authorize Globus Developers to contact me. This consent overrides my registration on DND/NDNC.",
};

// ---------------------------------------------------------------- Privacy policy
export const privacy = {
  lastUpdated: "23 October 2026", // DRAFT: the live site shows today's date on every visit; confirm the real date with Globus
  intro:
    "Globus Developers (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard the information you provide when you visit our website, particularly when you submit an enquiry form. Please read this privacy policy carefully. By using our site, you consent to the data practices described in this policy.",
  // Each section: a heading, paragraphs, and an optional list (items may start with a bold lead).
  sections: [
    {
      heading: "Information We Collect",
      paragraphs: ["We collect information that you voluntarily provide to us when you express an interest in obtaining information about us or our projects through our enquiry forms."],
      list: [
        { lead: "Personal Information:", text: "We collect personally identifiable information that you provide, such as your name, email address, phone number, the project you are interested in, preferred unit type, and your preferred method of contact." },
        { lead: "Usage Data:", text: "We may automatically collect information that your browser sends whenever you visit our site. This may include your computer’s IP address, browser type, the pages you visit, and the time and date of your visit. This data is used to improve our website and services." },
      ],
    },
    {
      heading: "How We Use Your Information",
      paragraphs: ["We use the personal information we collect for various business purposes, including to:"],
      list: [
        { text: "Respond to your enquiries and fulfill your requests for information." },
        { text: "Communicate with you via email, phone, or WhatsApp to provide details about our projects and follow up on your interest." },
        { text: "Send you marketing communications about our new projects, special offers, and other updates. You may opt out of these communications at any time." },
        { text: "Improve our services and for internal record-keeping and administrative purposes." },
      ],
    },
    {
      heading: "Information Sharing and Disclosure",
      paragraphs: ["We do not sell your personal information. We may share your information in the following situations:"],
      list: [
        { lead: "Internal Teams:", text: "Your information is shared with our internal sales and marketing teams to facilitate communication and service your request." },
        { lead: "Third-Party Service Providers:", text: "We may share your data with third-party vendors and service providers who perform services for us (e.g., Customer Relationship Management systems, email delivery services)." },
        { lead: "Legal Requirements:", text: "We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, or legal processes." },
      ],
    },
    {
      heading: "Data Security",
      paragraphs: ["We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse."],
    },
    {
      heading: "Cookies and Tracking Technologies",
      paragraphs: ["We may use cookies and similar tracking technologies to access or store information to improve your experience on our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site."],
    },
    {
      heading: "Your Rights",
      paragraphs: ["You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your personal information. To exercise these rights, please contact us using the contact information provided below."],
    },
    {
      heading: "Changes to This Policy",
      paragraphs: ["We may update this Privacy Policy from time to time. The updated version will be indicated by an updated “Last Updated” date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information."],
    },
    {
      heading: "Contact Us",
      paragraphs: ["If you have questions or comments about this Privacy Policy, please contact us at:"],
      contactBlock: true,
    },
  ] as {
    heading: string;
    paragraphs: string[];
    list?: { lead?: string; text: string }[];
    contactBlock?: boolean;
  }[],
};
