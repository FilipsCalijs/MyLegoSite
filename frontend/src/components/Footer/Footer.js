import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaCcAmex, FaCcDiscover, FaCcPaypal, FaCcVisa, FaRegCreditCard } from "react-icons/fa";

import { BsCreditCard2FrontFill } from "react-icons/bs";
import "./Footer.css";



const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div className="footer-col">
        <h4>BrickLink</h4>
        <a href="#">About Us</a>
        <a href="#">History</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Dan Jezek <FaRegCreditCard style={{fontSize: 13, marginLeft: 2}} /></a>
        <a href="#" target="_blank" rel="noopener noreferrer">Careers <FaRegCreditCard style={{fontSize: 13, marginLeft: 2}} /></a>
        <a href="#">Sitemap</a>
      </div>
      <div className="footer-col">
        <h4>Resources</h4>
        <a href="#">Help Center & FAQ</a>
        <a href="#">Problem Center</a>
        <a href="#">Become a Seller</a>
        <a href="#">Studio Tutorials</a>
        <a href="#">Contact Us</a>
      </div>
      <div className="footer-col">
        <h4>Join In</h4>
        <a href="#">Sign Up for Newsletter</a>
        <a href="#">Contribute to Catalog</a>
        <a href="#">Submit Bugs</a>
        <a href="#">Help with Research</a>
      </div>
      <div className="footer-col">
        <h4>Follow Us</h4>
        <div className="footer-social">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaYoutube /></a>
          <a href="#"><FaTwitter /></a>
        </div>
      </div>
      <div className="footer-col payment">
        <h4>Popular Payment Options</h4>
        <div className="footer-payments">
          <FaCcAmex />
          <FaCcDiscover />
     
          <BsCreditCard2FrontFill />
          <FaCcPaypal />
          <FaCcVisa />
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="footer-links">
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Accessibility</a>
        <a href="#">Cookie Policy & Settings</a>
        <a href="#">Do not sell/share my personal information</a>
        <a href="#">DSA Notice</a>
        <a href="#">House Rules</a>
      </div>
      <div className="footer-legal">
        LEGO, the LEGO logo, BrickLink, the Minifigure, DUPLO, the FRIENDS logo, the MINIFIGURES logo, DREAMZzz, NINJAGO, VIDYO and MINDSTORMS are trademarks of the LEGO Group. © 2025 The LEGO Group. All rights reserved. Some LEGO® sets contain small parts and/or small balls that pose a choking hazard and are not suitable for children under 3 years of age. LEGO® DUPLO® elements are not small parts and are specifically designed for safe use by children under 3 years of age. Use of this website constitutes acceptance of the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  </footer>
);

export default Footer;
