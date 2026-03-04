import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="siteFooter">
            <div className="container siteFooterInner">
                <div className="footerCol" id="footer-contact">
                    <div className="footerTitle">Contact</div>
                    <a className="footerLink" href="mailto:crea.lalie.art@gmail.com">
                        crea.lalie.art@gmail.com
                    </a>
                    <a className="footerLink" href="tel:+33673883144">
                        +33 6 73 88 31 44
                    </a>
                </div>

                <div className="footerCol">
                    <div className="footerTitle">Réseaux</div>

                    <div className="socialRow">
                        <a
                            className="socialIcon"
                            href="https://www.instagram.com/CreaLalieArt"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <Instagram size={18} />
                        </a>

                        <a
                            className="socialIcon"
                            href="https://www.facebook.com/CreaLalieArt"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <Facebook size={18} />
                        </a>
                    </div>
                </div>

                <div className="footerCol">
                    <div className="footerTitle">Lalie Art</div>
                    <div className="footerText">
                        Collages originaux, pièces uniques. <br />
                        Musique, icônes, visages, histoires.
                    </div>
                </div>

                <div className="footerBottom">
                    <span>© {new Date().getFullYear()} Crea Lalie Art</span>
                    <a className="footerSmallLink" href="/admin/login">
                        Admin
                    </a>
                </div>
            </div>
        </footer>
    );
}