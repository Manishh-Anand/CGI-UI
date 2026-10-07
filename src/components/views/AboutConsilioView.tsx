import React from 'react';
import { ArrowUpRight, CalendarDays, ExternalLink, Layers3, Sparkles, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CONSILIO_LEADERSHIP, CONSILIO_TIMELINE } from '../../data/mockData';

export const AboutConsilioView: React.FC = () => {
  const { navigateTo, openAiSearch } = useApp();

  return (
    <div className="about-page space-y-8">
      <section className="hero-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="relative z-10 max-w-4xl">
          <div className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> CONSILIO GATEWAY OF INTELLIGENCE</div>
          <h1 className="display-heading mt-5 max-w-4xl">A clearer view of the company behind the <em>signal.</em></h1>
          <p className="hero-copy mt-5 max-w-2xl">Explore Consilio’s evolution from litigation forensics to a global legal technology and enterprise services platform.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="button-primary" onClick={() => navigateTo('overview')}><span>Enter the intelligence workspace</span><ArrowUpRight className="h-4 w-4" /></button>
            <button className="button-ghost" onClick={() => openAiSearch('Tell me the most important facts about Consilio')}>Ask the Gateway</button>
          </div>
        </div>
        <div className="hero-stat-cluster" aria-label="Company snapshot">
          <div><strong>2000</strong><span>Founded</span></div>
          <div><strong>25+</strong><span>Years of evolution</span></div>
          <div><strong>08</strong><span>Milestones mapped</span></div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['One connected view', 'Company history, capability evolution, and strategic signal in one place.', Layers3],
          ['Evidence first', 'Every public fact carries a source and retrieval date for confident decisions.', CalendarDays],
          ['Built to move', 'Go from context to the live intelligence workspace in one click.', ArrowUpRight]
        ].map(([title, copy, Icon]) => {
          const FeatureIcon = Icon as React.ElementType;
          return <article className="premium-card p-5" key={title as string}><div className="icon-badge"><FeatureIcon className="h-4 w-4" /></div><h2 className="mt-5 text-base font-semibold text-ink">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted">{copy as string}</p></article>;
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="premium-card p-6 sm:p-8">
          <div className="section-kicker">The Consilio story</div>
          <div className="mt-2 flex items-end justify-between gap-4"><div><h2 className="section-title">A timeline of <em>expansion.</em></h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">Key moments that shaped today’s technology, services, and global footprint.</p></div><span className="data-pill">Public source map</span></div>
          <div className="timeline mt-8">
            {CONSILIO_TIMELINE.map((item, index) => <article className="timeline-item" key={item.year}>
              <div className="timeline-marker">{String(index + 1).padStart(2, '0')}</div>
              <div className="timeline-content"><div className="flex flex-wrap items-center gap-2"><span className="timeline-year">{item.year}</span><span className="tag tag-blue">{item.capability}</span></div><h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3><p className="mt-1 text-sm leading-6 text-muted">{item.summary}</p><a className="source-link mt-3" href={item.evidence.sourceUrl} target="_blank" rel="noreferrer">{item.evidence.sourceName}<ExternalLink className="h-3 w-3" /></a></div>
            </article>)}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="leader-card premium-card p-6 sm:p-8">
            <div className="section-kicker">Leadership</div>
            <div className="mt-5 flex items-start gap-4"><div className="leader-avatar"><UserRound className="h-8 w-8" /></div><div><h2 className="text-xl font-semibold text-ink">{CONSILIO_LEADERSHIP.name}</h2><p className="mt-1 text-sm font-medium text-blue">{CONSILIO_LEADERSHIP.title}</p></div></div>
            <p className="mt-6 text-sm leading-7 text-muted">{CONSILIO_LEADERSHIP.biography}</p>
            <div className="mt-6 space-y-2">{CONSILIO_LEADERSHIP.highlights.map(highlight => <div className="tag-row" key={highlight}><span className="dot dot-blue" />{highlight}</div>)}</div>
            <a className="source-link mt-6" href={CONSILIO_LEADERSHIP.evidence.sourceUrl} target="_blank" rel="noreferrer">Verified on Consilio <ExternalLink className="h-3 w-3" /></a>
          </div>
          <div className="midnight-panel p-6 sm:p-8"><div className="section-kicker section-kicker-light">Make the next move</div><h2 className="mt-3 text-2xl font-semibold text-white">Context is useful. <em>Signal is actionable.</em></h2><p className="mt-3 text-sm leading-6 text-white/65">Open the workspace to turn company context into client, market, workflow, and technology decisions.</p><button className="button-light mt-6" onClick={() => navigateTo('overview')}>Open overview <ArrowUpRight className="h-4 w-4" /></button></div>
        </aside>
      </section>
    </div>
  );
};
