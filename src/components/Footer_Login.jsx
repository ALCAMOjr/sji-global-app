import React, { useState, useEffect, useContext } from 'react';
import { Footer, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import logo2 from "../assets/logoGde.png";


function FooterPageLogin() {
  
    return (
 <Footer container className="fixed bottom-0 w-full z-50 bg-white">
          <div className="w-full text-center">
            <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
              <a  className="flex items-center">
                <img src={logo2} className="h-16 w-32 me-3" alt="Sji Global Logo" />
           
              </a>
              <FooterLinkGroup>
                <FooterLink href="#">Acerca de</FooterLink>
                <FooterLink href="#">Política de privacidad</FooterLink>
                <FooterLink href="#">Licencia</FooterLink>
                <FooterLink href="#">Contacto</FooterLink>
              </FooterLinkGroup>
            </div>
            <FooterDivider />
            <FooterCopyright href="#" by="SjiGlobal" year={2024} />
          </div>
        </Footer>
      )
    
}

export default FooterPageLogin;
