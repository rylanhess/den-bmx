'use client';

import { useState, useEffect } from 'react';
import NewsletterModal from './NewsletterModal';

const VISITOR_KEY = 'den_bmx_newsletter_visited';
const VISITOR_TIMESTAMP_KEY = 'den_bmx_visitor_timestamp';
const MODAL_DISMISSED_KEY = 'den_bmx_newsletter_dismissed';

// Show modal after 2 seconds delay for better UX
const MODAL_DELAY_MS = 2000;
// Don't show modal again for 30 days if dismissed
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export default function NewsletterModalTrigger() {
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAndShowModal = async () => {
      // Check if modal was dismissed recently
      const dismissedTimestamp = localStorage.getItem(MODAL_DISMISSED_KEY);
      if (dismissedTimestamp) {
        const dismissedTime = parseInt(dismissedTimestamp, 10);
        const now = Date.now();
        if (now - dismissedTime < DISMISS_DURATION_MS) {
          setIsChecking(false);
          return;
        }
        // Dismissal expired, clear it
        localStorage.removeItem(MODAL_DISMISSED_KEY);
      }

      // Check if user has visited before (using localStorage)
      const hasVisited = localStorage.getItem(VISITOR_KEY);
      
      if (!hasVisited) {
        // First visit - mark as visited and show modal after delay
        localStorage.setItem(VISITOR_KEY, 'true');
        localStorage.setItem(VISITOR_TIMESTAMP_KEY, Date.now().toString());
        
        // Show modal after delay
        setTimeout(() => {
          setShowModal(true);
          setIsChecking(false);
        }, MODAL_DELAY_MS);
      } else {
        setIsChecking(false);
      }
    };

    checkAndShowModal();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Mark as dismissed with timestamp
    localStorage.setItem(MODAL_DISMISSED_KEY, Date.now().toString());
  };

  // Don't render anything while checking or if modal shouldn't show
  if (isChecking || !showModal) {
    return null;
  }

  return <NewsletterModal isOpen={showModal} onClose={handleClose} />;
}

