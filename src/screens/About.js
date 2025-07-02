import "./css/About.css";
import { useMediaQuery } from "react-responsive";

export default function About() {

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const pageStyle = isMobile
    ? {}
    : {
        //backgroundImage: 'url("/about_background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      };

  return (
    <div className="page-root" style={pageStyle}>
      <div className="about-modern">
        <main className="about-content">
          <header className="about-hero">
            <h1 className="about-title">Ink&amp;Muse</h1>
            <p className="about-tagline">the script of soul</p>
          </header>
          <section className="about-block">
            <h2>A Letter from the Creator</h2>
            <p>Ink&amp;Muse wasn’t born in a boardroom or planned on a whiteboard.It started as a feeling, the urge to build a quiet place where thoughts could live freely. Not polished essays or viral quotes, just small, real pieces of feeling. Unfinished poems. Late-night thoughts. A single honest sentence.</p>
            <p>Everywhere you look, it’s the voices of people who’ve already made it. Authors with publishers. Poets with followers. Creators with clout.</p>
            <p>But what about your voice? What if you’re just someone with something honest to say and nowhere to say it?</p>
            <p>On this internet, it often feels like nobody cares. But maybe the truth is: we just can’t reach the people who would.</p>
            <p><em>Ink&amp;Muse</em> is just a quiet corner. Not to perform. Not to impress. Just to be.</p>
            <p className="faded">And if nothing else, it’s where your words can stay, even when no one answers.</p>
          </section>

          <section className="about-block">
            <h2>What You’ll Find Here</h2>
            <ul>
              <li>Thoughts, short or strange</li>
              <li>A line you wrote and didn’t know why</li>
              <li>A quote that finally felt like you</li>
              <li>Unfinished poems, half-dreams, quiet reflections</li>
            </ul>
            <p className="faded">Everything here is allowed to be unfinished, quiet, or unimportant. Because sometimes, meaning isn’t loud.</p>
          </section>

          <section className="about-block">
            <h2>Where Things Stand</h2>
            <p>Ink&amp;Muse isn’t a company. There’s no office or team. No big plan. Just me, experimenting, learning, creating.</p>
            <p>You might get emails from my personal Gmail. And that’s okay, for now.</p>
            <p>This isn’t something big. It’s just something I needed to make.</p>
            <p className="faded">I don’t know where it will lead. But I’ll keep shaping it, quietly.</p>
          </section>

          <section className="about-block">
            <h2>One Last Thing</h2>
            <p>You don’t have to post. You can just read.</p> 
            <p>This space is here when you need it, even if that’s only once in a while.</p>
            <p>But if you ever feel like leaving something behind, a thought, a quote, a memory, you’re more than welcome to.</p>
            <p>Want to say hi? Reach me at <a href="mailto:ravikourav9516@gmail.com">ravikourav9516@gmail.com</a>.</p>
          </section>
          <p className="faded">Thanks for being here. That’s all.</p>
          <p className="signature">- Ravi Kourav</p>
        </main>
    </div>
    </div>
  );
}
