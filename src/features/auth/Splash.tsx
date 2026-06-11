/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '@/lib/routes';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.ONBOARDING);
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 bg-primary flex flex-col items-center justify-between p-8 min-h-full text-on-primary">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated logo badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-24 h-24 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-6 shadow-xl"
        >
          <span className="font-fraunces text-numeral-xl text-on-tertiary-fixed tracking-tight">
            JT
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-fraunces text-display-lg-mobile font-bold tracking-tight text-surface mb-2"
        >
          JembaTani
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-jakarta text-body-md text-on-primary-container font-medium tracking-wide"
        >
          Jembatan petani dan pembeli
        </motion.p>
      </div>

      <div className="w-full flex flex-col items-center">
        {/* Simple elegant loading indicator */}
        <div className="w-12 h-1 bg-surface-container-highest/20 rounded-full overflow-hidden mb-8">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="h-full bg-tertiary-fixed-dim rounded-full relative w-1/2"
          />
        </div>

        <span className="font-jakarta text-body-sm text-on-primary-container/60 tracking-wider">
          VERSI 1.0.0
        </span>
      </div>
    </div>
  );
}
