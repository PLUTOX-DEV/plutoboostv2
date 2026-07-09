
import React, { Profiler } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import App from './App';
import queryClient from './utils/queryClient';
import './index.css';

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileOrTouch = window.matchMedia('(pointer: coarse), (max-width: 1024px)').matches;
if (isReducedMotion || isMobileOrTouch) {
  document.body.classList.add('reduced-motion');
}

// Performance monitoring callback
const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  if (actualDuration > 1000) {
    console.warn(
      `[Performance] ${id} (${phase}) took ${actualDuration.toFixed(2)}ms - Base: ${baseDuration.toFixed(2)}ms`
    );
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion={isReducedMotion || isMobileOrTouch ? 'always' : 'never'}>
        <Profiler id="App" onRender={onRenderCallback}>
          <UserProvider><App/></UserProvider>
        </Profiler>
      </MotionConfig>
    </QueryClientProvider>
  </BrowserRouter>
);