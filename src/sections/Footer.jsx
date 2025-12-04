import { socialImgs } from "../constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <p>Terms & Conditions</p>
        </div>
        <div className="contact-info">
  <p>Phone / WhatsApp: <a href="tel:+251911406293">+251 911 406 293</a></p>
  <p>Email: <a href="mailto:tewodrosfikadu499@gmail.com">tewodrosfikadu499@gmail.com</a></p>
  <p>WhatsApp direct: <a href="https://wa.me/251911406293" target="_blank">Chat now</a></p>
</div>
        <div className="socials">
          {socialImgs.map((socialImg, index) => (
            <div key={index} className="icon">
              <img src={socialImg.imgPath} alt="social icon" />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Tewodiros Fikadu , All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;