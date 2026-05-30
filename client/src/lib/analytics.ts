/**
 * Google Analytics 4 utility library for Gadang Barubah website
 * Provides safe event tracking and SPA pageview management
 */

// Global gtag function declaration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Restaurant-specific event parameters for business tracking
interface RestaurantEventParams {
  restaurant_action?: 'call' | 'whatsapp' | 'delivery' | 'reservation' | 'membership' | 'outlet_view';
  service_type?: 'outlet' | 'delivery' | 'catering' | 'partnership' | 'reservation';
  outlet_name?: string;
  contact_method?: 'phone' | 'whatsapp' | 'form' | 'direct';
  menu_category?: string;
  currency?: 'IDR';
  value?: number;
}

interface CustomEventParams extends RestaurantEventParams {
  event_category?: string;
  event_label?: string;
  custom_parameter_1?: string;
  custom_parameter_2?: string;
  [key: string]: any;
}

/**
 * Safe wrapper for gtag function - handles cases where GA isn't loaded yet
 */
function safeGtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  } else if (typeof window !== 'undefined') {
    // Queue the call for when gtag becomes available
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
}

/**
 * Track page views for SPA navigation
 * Optimized for restaurant website with enhanced parameters
 */
export function trackPageView(options: {
  title?: string;
  location?: string;
  path?: string;
  service_type?: RestaurantEventParams['service_type'];
}) {
  const { title, location, path, service_type } = options;
  const currentPath = path || window.location.pathname;
  
  safeGtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: location || window.location.href,
    page_path: currentPath,
    service_type: service_type || getServiceTypeFromPath(currentPath),
    site_name: 'Gadang Barubah Indonesia',
    page_category: getContentGroup(currentPath),
    send_to: 'G-KJJXWLV11T'
  });
}

/**
 * Track restaurant-specific events with business context
 */
export function trackRestaurantEvent(
  eventName: string, 
  params: CustomEventParams = {}
) {
  // Add restaurant-specific context
  const enhancedParams = {
    ...params,
    event_category: params.event_category || 'restaurant_interaction',
    business_type: 'restaurant',
    cuisine_type: 'padang_minang',
    brand: 'gadang_barubah',
    send_to: 'G-KJJXWLV11T'
  };

  safeGtag('event', eventName, enhancedParams);
}

/**
 * Track business conversion events (calls, WhatsApp, reservations)
 */
export function trackConversion(action: RestaurantEventParams['restaurant_action'], params: CustomEventParams = {}) {
  trackRestaurantEvent('conversion', {
    ...params,
    restaurant_action: action,
    event_category: 'conversion',
    value: params.value || 1 // Default conversion value
  });
}

/**
 * Track outlet interactions
 */
export function trackOutletInteraction(outletName: string, action: string, params: CustomEventParams = {}) {
  trackRestaurantEvent('outlet_interaction', {
    ...params,
    restaurant_action: 'outlet_view',
    service_type: 'outlet',
    outlet_name: outletName,
    event_category: 'outlet',
    event_label: action
  });
}

/**
 * Track service page views with business context
 */
export function trackServiceView(serviceType: RestaurantEventParams['service_type'], params: CustomEventParams = {}) {
  trackRestaurantEvent('service_view', {
    ...params,
    service_type: serviceType,
    event_category: 'service_engagement',
    custom_parameter_2: serviceType
  });
}

/**
 * Track contact method usage for lead attribution
 */
export function trackContactMethod(
  method: RestaurantEventParams['contact_method'], 
  source: string = 'website',
  params: CustomEventParams = {}
) {
  // Map contact method to appropriate restaurant action
  const actionMap: Record<NonNullable<RestaurantEventParams['contact_method']>, RestaurantEventParams['restaurant_action']> = {
    'whatsapp': 'whatsapp',
    'phone': 'call',
    'form': 'reservation',
    'direct': 'call'
  };
  
  trackConversion(method && actionMap[method] ? actionMap[method] : 'call', {
    ...params,
    contact_method: method,
    event_category: 'lead_generation',
    event_label: `${method}_${source}`,
    traffic_source: source
  });
}

/**
 * Update consent for GDPR compliance
 */
export function updateConsent(granted: boolean) {
  safeGtag('consent', 'update', {
    'analytics_storage': granted ? 'granted' : 'denied',
    'ad_storage': 'denied', // Keep ads denied for privacy
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
  });
}

/**
 * Track exceptions and errors for monitoring
 */
export function trackException(description: string, fatal: boolean = false) {
  safeGtag('event', 'exception', {
    description,
    fatal,
    event_category: 'error'
  });
}

/**
 * Get content group based on URL path for segmentation
 */
function getContentGroup(path: string): string {
  if (path === '/') return 'homepage';
  if (path.startsWith('/uni')) return 'services_hub';
  if (path.startsWith('/services/outlet')) return 'outlet_locator';
  if (path.startsWith('/services/delivery')) return 'delivery_service';
  if (path.startsWith('/services/catering')) return 'catering_service';
  if (path.startsWith('/services/partnership')) return 'business_partnership';
  if (path.startsWith('/reservasi')) return 'reservation';
  return 'other';
}

/**
 * Initialize analytics for SPA - call this once in App.tsx
 */
export function initializeAnalytics() {
  // Check if user has previously granted consent
  const hasConsent = localStorage.getItem('analytics_consent') === 'granted';
  if (hasConsent) {
    updateConsent(true);
  }
  
  // Set up global error tracking (no initial page view - Router handles it)
  window.addEventListener('error', (event) => {
    trackException(`JavaScript Error: ${event.message}`, false);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    trackException(`Unhandled Promise Rejection: ${event.reason}`, false);
  });
}

/**
 * Request analytics consent from user (call from consent UI)
 */
export function requestAnalyticsConsent() {
  updateConsent(true);
  localStorage.setItem('analytics_consent', 'granted');
}

/**
 * Deny analytics consent 
 */
export function denyAnalyticsConsent() {
  updateConsent(false);
  localStorage.setItem('analytics_consent', 'denied');
}

/**
 * Helper to determine service type from URL path
 */
function getServiceTypeFromPath(path: string): RestaurantEventParams['service_type'] | undefined {
  if (path.startsWith('/services/outlet')) return 'outlet';
  if (path.startsWith('/services/delivery')) return 'delivery';
  if (path.startsWith('/services/catering')) return 'catering';
  if (path.startsWith('/services/partnership')) return 'partnership';
  if (path.startsWith('/reservasi')) return 'reservation';
  return undefined;
}