'use client';

import React from 'react';
import { footerLinks } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="py-5 sm:px-10 px-5">
      <div className="screen-max-width">
        <div className="mb-5">
          <p className="font-semibold text-xs text-gray">
            More ways to shop: {' '}
            <a href="#" className="underline text-blue">
              Find an Apple Store {' '}
            </a>
            or {' '}
            <a href="#" className="underline text-blue">
              other retailer
            </a>{' '}
            near you.
          </p>
          <p className="font-semibold text-xs text-gray">
            Or call 000800-040-1966
          </p>
        </div>

        <hr className="my-5 bg-neutral-700 h-[1px] w-full" />

        <div className="flex md:flex-row flex-col md:items-center justify-between">
          <p className="font-semibold text-xs text-gray">
            Copyright @ 2024 Apple Inc. All rights reserved.
          </p>
          <div className="flex gap-x-2">
            {footerLinks.map((link, index) => (
              <p key={link} className="font-semibold text-xs text-gray">
                {link}
                {index !== footerLinks.length - 1 && (
                  <span className="mx-2"> | </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;