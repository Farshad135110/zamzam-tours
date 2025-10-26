// Utility functions for ZamZam Tours

import { CONTACT_INFO } from '../constants/config';

/**
 * Open WhatsApp with a pre-filled message
 */
export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
};

/**
 * Generate WhatsApp booking message
 */
export const generateBookingMessage = (
  service: string,
  details?: Record<string, any>
) => {
  let message = `Hello ZamZam Tours! I'm interested in booking ${service}.\n\n`;
  
  if (details) {
    Object.entries(details).forEach(([key, value]) => {
      message += `${key}: ${value}\n`;
    });
  }
  
  message += '\nPlease provide more details.';
  return message;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (number: string) => {
  return number.replace(/(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
};

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
