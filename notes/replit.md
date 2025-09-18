# Overview

Velox is a sustainable recycling company website that transforms plastic bottles into high-quality polyester thread and fiberfill products. The site showcases the company's six-step recycling process, product catalog, environmental impact metrics, and business information through a multi-page static website with modern, eco-friendly design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a traditional multi-page website architecture built with vanilla HTML5, CSS3, and JavaScript. The design follows a component-based approach with reusable header and footer elements across all pages. The site implements a mobile-first responsive design using CSS Grid and Flexbox for layout management.

**Key Design Decisions:**
- Static HTML pages for fast loading and SEO optimization
- CSS custom properties (variables) for consistent theming and easy maintenance
- Modular CSS architecture with separate files for reset, utilities, and main styles
- Progressive enhancement with JavaScript for interactive features

## Styling System
The CSS architecture uses a three-layer approach:
1. **Reset Layer** (`reset.css`) - Normalizes browser defaults and improves accessibility
2. **Utilities Layer** (`utilities.css`) - Atomic utility classes for common styling patterns
3. **Component Layer** (`styles.css`) - Main component styles with CSS custom properties

The design system includes:
- Comprehensive color palette with primary (#0B6B53), accent (#1FA37A), and semantic colors
- Spacing scale using CSS custom properties for consistent layout
- Typography system with system font stack for performance
- Dark mode support through CSS custom properties

## JavaScript Architecture
The frontend JavaScript follows a modular approach with two main files:
- **Main.js** - Core functionality including theme management, navigation, scroll effects, and modal handling
- **Forms.js** - Form validation, submission handling, and user feedback

**Key Features:**
- Theme switching with system preference detection and local storage persistence
- Responsive navigation with mobile menu support
- Form validation and submission handling
- Modal management for interactive content
- Scroll-based animations and effects
- Toast notification system for user feedback

## Page Structure
The site consists of 9 main pages plus utility pages:
- **Home** (`index.html`) - Landing page with company overview
- **Process** (`process.html`) - Detailed recycling workflow
- **Products** (`products.html`) - Product catalog and specifications
- **Impact** (`impact.html`) - Environmental metrics and sustainability data
- **About** (`about.html`) - Company information and team
- **Careers** (`careers.html`) - Job opportunities and company culture
- **FAQ** (`faq.html`) - Frequently asked questions
- **Blog** (`blog.html`) - News and insights listing
- **Contact** (`contact.html`) - Contact information and forms

Each page includes comprehensive SEO optimization with meta tags, Open Graph properties, Twitter Cards, and structured data markup.

## SEO and Accessibility
The site implements comprehensive SEO and accessibility features:
- Semantic HTML5 structure with proper heading hierarchy
- Meta descriptions and Open Graph tags for social sharing
- Structured data markup using JSON-LD for rich snippets
- Alt text for images and ARIA labels for interactive elements
- Focus management and keyboard navigation support
- Color contrast compliance and responsive design

# External Dependencies

## Third-Party Services
The website is designed to integrate with various external services for full functionality:

**Analytics and Tracking:**
- Google Analytics for traffic and user behavior tracking
- Social media tracking pixels for marketing campaigns

**Communication Services:**
- Email service provider for form submissions and contact inquiries
- CRM integration for lead management and customer relationship tracking

**Content Management:**
- Blog content management system for news and article publishing
- Image optimization and CDN services for media delivery

**Business Operations:**
- Customer support chat integration for real-time assistance
- Quote request processing system for B2B inquiries

The current implementation includes placeholder functionality for these integrations, with form handling and data collection ready for backend service connection. The modular JavaScript architecture allows for easy integration of third-party services without disrupting the core functionality.