import "./css/About.css";
import Card from "../components/Card";
import { useMediaQuery } from 'react-responsive';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function About() {

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="page-root">
      <div className="about-modern">
        <header className="about-hero">
          <h1 className="about-title">About Us</h1>
        </header>
        <div className="about-main-card">
          <Card
            margin={true}
            content="Dreams aren’t always about doing something big or leaving a name behind. sometimes, they’re just about being quiet and being happy."
            textColor="#ffffff"
            authorColor="#ffffff"
            background='about_card0.jpg'
            sampleSize={isMobile ? 'small' :'large'}
          />
        </div>

        <div className="about-block-container">
          <section className="about-text-block">
            <h2>A Letter from the Creator</h2>
            <p>Ink&amp;Muse wasn’t born in a boardroom or planned on a whiteboard. It started as a feeling, the urge to build a quiet place where thoughts could live freely.</p>
            <p className="faded">Not just viral quotes, but real pieces of feeling.</p>
          </section>

        <div className="about-block">
          <Card
            margin={true}
            content="On this internet, it often feels like nobody cares. But maybe the truth is we just can’t reach the people who would."
            textColor="#ffffff"
            authorColor="#ffffff"
            background='about_card1.jpg'
            sampleSize='small'
          />
          </div>
        </div>

        <div className="about-block-container">
          <div className="about-block">
            <Card
              margin={true}
              content="I don’t know where it will lead. But I’ll keep shaping it, quietly."
              textColor="#ffffff"
              authorColor="#ffffff"
              background='about_card2.jpg'
              sampleSize='small'
            />
          </div>
          <section className="about-text-block">
            <h2>Where Things Stand</h2>
            <p>This isn’t a company. There’s no office or team. No big plan. Just me, experimenting, learning, creating.</p>
            <p className="faded">This isn’t something big. It’s just something I needed to make.</p>
          </section>
        </div>

        <div className="about-block-container">
          <section className="about-text-block">
            <h2>One Last Thing</h2>
            <p>This space is here when you need it,</p>
            <p>even if that’s only once in a while.</p>
            <p className="faded" >But if you ever feel like leaving something behind, a thought, a quote, a memory, you’re more than welcome to.</p>
          </section>
          <div className="about-block">
            <Card
              margin={true}
              content="And if nothing else, it’s where your words can stay, even when no one answers."
              textColor="#ffffff"
              authorColor="#ffffff"
              background='about_card3.jpg'
              sampleSize='small'
            />
          </div>
        </div>
        
        <p className="faded">Thanks for being here. That’s all.</p>
        <p className="signature">- Ravi Kourav</p>

      </div>
      <footer className="footer-minimal">
        <p>©{new Date().getFullYear()} Ink & Muse · All rights reserved. Reach me</p> <a href="mailto:ravikourav9516@gmail.com" className="contact-link">ravikourav9516@gmail.com</a>
        <a href="https://twitter.com/ravikourav" className="contact-link" target="_blank" rel="noopener noreferrer"><FaTwitter />Twitter</a>
        <a href="https://linkedin.com/in/ravikourav" className="contact-link" target="_blank" rel="noopener noreferrer"><FaLinkedin/>LinkedIn</a>
      </footer>
    </div>
  );
}
