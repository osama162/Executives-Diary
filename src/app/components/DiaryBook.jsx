'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

/* ----------------------------- small UI ----------------------------- */

function LeftTabs({ tabs, active, onChange, disabledKeys = [] }) {
  return (
    <div className="flex gap-6 mb-6">
      {tabs.map((t, i) => {
        const isDisabled = disabledKeys.includes(t.key);
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => !isDisabled && onChange?.(i)}
            disabled={isDisabled}
            className={[
              'text-[12px] px-[7px] py-[11px] text-center font-cinzel shadow-[1px_1px_7px_1px_#adadad] h-full flex items-center justify-center w-[33%] border',
              i === active ? 'bg-white text-black font-semibold border-transparent' : 'bg-white text-black border-gray-200',
              isDisabled ? 'cursor-not-allowed' : 'hover:bg-[#29d7a2] hover:text-white cursor-pointer'
            ].join(' ')}
          >
            {t.label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function TabsBar({ tabs, active, onChange, disabledKeys = [] }) {
  return (
    <div className="px-10 pt-16">
      <div className="flex gap-6 mb-6">
        {tabs.map((t, i) => {
          const isDisabled = disabledKeys.includes(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => !isDisabled && onChange?.(i)}
              disabled={isDisabled}
              className={[
                'text-[12px] px-[7px] py-[11px] text-center font-cinzel shadow-[1px_1px_7px_1px_#adadad] h-full flex items-center justify-center w-[33%] border',
                i === active ? 'bg-white text-black font-semibold border-transparent' : 'bg-white text-black ',
                isDisabled ? ' cursor-not-allowed' : 'hover:bg-[#29d7a2] hover:text-white cursor-pointer'
              ].join(' ')}
            >
              {t.label.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeading({ heading, sub }) {
  return (
    <>
      <h3 className="font-semibold text-[#212529] border-b-4 border-double pb-2 font-base">{heading}</h3>
      {sub ? <h2 className="text-xl font-bold text-[#212529] mt-8 leading-6 capitalize font-base">{sub}</h2> : null}
    </>
  );
}

/* --------------------------- page components ------------------------ */

function IdentityCard({ activeTab, onTabClick, tabs, name, title, company, industry, location, image, executive, }) {
  const pic = image || '/images/demoBookFlip.jpg';
  const [open, setOpen] = useState(false);

  const socials = [
    { key: 'website', label: 'Website', url: executive?.website, icon: '🌐' },
    { key: 'linkedin', label: 'LinkedIn', url: executive?.linkedin },
    { key: 'twitter', label: 'Twitter/X', url: executive?.twitter },
    { key: 'facebook', label: 'Facebook', url: executive?.facebook },
    { key: 'instagram', label: 'Instagram', url: executive?.instagram },
    { key: 'youtube', label: 'YouTube', url: executive?.youtube },
  ].filter(Boolean).filter(s => s.url);

  const BrandIcon = ({ name }) => {
    switch (name) {
      case 'linkedin':
        return <svg viewBox="0 0 24 24" width="28" height="28" fill="#0a66c2"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8 8.5h3.8v2h.05c.53-1 1.83-2.05 3.77-2.05C19.6 8.45 22 10.3 22 14.13V23h-4v-7.4c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.82 1.91-2.82 3.89V23H8V8.5z" /></svg>;
      case 'twitter':
        return <svg viewBox="0 0 24 24" width="28" height="28" fill="#1da1f2"><path d="M22.46 6c-.77.34-1.6.57-2.46.68a4.27 4.27 0 0 0 1.88-2.36 8.5 8.5 0 0 1-2.7 1.03A4.25 4.25 0 0 0 12 8.24c0 .33.04.66.11.97A12.06 12.06 0 0 1 3.15 5.2a4.25 4.25 0 0 0 1.32 5.67 4.21 4.21 0 0 1-1.92-.53v.05c0 2.07 1.48 3.8 3.45 4.2-.36.1-.74.15-1.13.15-.28 0-.54-.03-.8-.08.54 1.7 2.12 2.94 3.98 2.97A8.53 8.53 0 0 1 2 20.29 12 12 0 0 0 8.29 22c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.34 8.34 0 0 0 22.46 6z" /></svg>;
      case 'facebook':
        return <svg viewBox="0 0 24 24" width="28" height="28" fill="#1877f2"><path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326V22.67c0 .73.595 1.326 1.326 1.326h11.49v-9.86H9.69V10.41h3.126V8.073c0-3.1 1.894-4.79 4.66-4.79 1.325 0 2.46.098 2.79.142v3.24h-1.916c-1.503 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.726h-3.12V24h6.116C23.405 24 24 23.405 24 22.673V1.326C24 .594 23.405 0 22.675 0z" /></svg>;
      case 'instagram':
        return <svg viewBox="0 0 24 24" width="28" height="28" fill="#E1306C"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM18 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" /></svg>;
      case 'youtube':
        return <svg viewBox="0 0 24 24" width="28" height="28" fill="#FF0000"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.3.6 9.3.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-white">
      <div className="px-10 pt-16">
        <LeftTabs tabs={tabs} active={activeTab} onChange={onTabClick} disabledKeys={['about', 'recs']} />
      </div>

      <div className="px-10 pb-6 bg-white overflow-y-auto custom-sidebar">
        <div className="bg-[#3673e1] p-3 mb-8">
          <div className="flex justify-between">
            <div>
              <h2 className="text-white font-sans text-[2rem] font-normal relative right-3 shadow-[1px_1px_3px_1px_#18181c] px-2 bg-[#466ad0] mt-8 capitalize">{name}</h2>
              <div className="text-white/90 leading-relaxed mt-6">
                {title && <p className="mb-1 text-[15px]">{title}</p>}
                {company && <p className="mb-6 text-[15px]">{company}</p>}
                <div className="space-y-2 text-xs mt-12">
                  {industry && (<p ><span className="font-semibold text-xs">Industry:</span> {industry}</p>)}
                  {location && (<p><span className="font-semibold text-xs">Location:</span> {location}</p>)}
                </div>
              </div>
            </div>
            <div>
              <div className="w-30 h-30 relative overflow-hidden shadow-md">
                <Image src={pic} alt={name} fill className="object-cover" />
              </div>
              <div className="w-24 h-24 relative mt-8 left-6 bottom-0">
                {/* <Image src="/images/verified-logo.png" alt="verified" fill className="object-contain" /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-white">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="bg-[#28d7a2] hover:opacity-95 text-white font-medium  py-3 text-center cursor-pointer"
          >
            Social Links
          </button>
        </div>

        <div className="mt-4 bg-white relative z-10">
          <div className={[
            'transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden rounded border border-[#e7e0d0] bg-white shadow-sm',
            open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          ].join(' ')}>
            <div className="p-6 bg-white">
              {socials.length === 0 ? (
                <p className="text-gray-500">No social links added.</p>
              ) : (
                <div className="flex flex-wrap items-center gap-6">
                  {socials.map(s => (
                    <a
                      key={s.key}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      title={s.label}
                    >
                      {s.icon ? s.icon : <BrandIcon name={s.key} />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightAbout({ about, name }) {
  return (
    <div className="p-10 h-full bg-white overflow-y-auto custom-sidebar">
      <SectionHeading heading="About" sub={`About ${name}`} />
      <p className="whitespace-pre-line mt-4 font-sans text-base leading-6 font-normal text-[#21253A]">{about || '—'}</p>
    </div>
  );
}

function ChaptersList({ tabs, activeTab, onTabClick, chapters = [], selectedId, onSelect }) {
  return (
    <div className="h-full bg-white">
      <TabsBar tabs={tabs} active={activeTab} onChange={onTabClick} disabledKeys={['about', 'recs']} />

      <div className="p-6 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chapters</h1>
          <p className="text-sm text-gray-500">
            {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'} available
          </p>
        </div>

        {!chapters.length ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No chapters yet</h3>
            <p className="text-gray-500">Start creating your story by adding the first chapter.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <ol className="max-h-[420px] overflow-auto divide-y divide-gray-100">
              {chapters
                .slice()
                .sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
                .map((ch, idx) => {
                  const num = ch.order ?? idx + 1;
                  const active = selectedId === ch.id;
                  return (
                    <li key={ch.id} className="group">
                      <button
                        type="button"
                        onClick={() => onSelect?.(ch.id)}
                        className={[
                          'w-full px-6 py-4 text-left cursor-pointer flex items-center gap-4 transition-all duration-200 relative',
                          active
                            ? 'bg-gradient-to-r from-[#171744]-50 to-[#171744]-50 text-gray-900 shadow-sm'
                            : 'hover:bg-white hover:shadow-sm group-hover:translate-x-1'
                        ].join(' ')}
                      >
                        <div className={[
                          'inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 transition-all duration-200',
                          active
                            ? 'bg-[#171744] text-white shadow-md transform scale-110'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700 text-white group-hover:from-slate-500 group-hover:to-slate-600'
                        ].join(' ')}>
                          {num}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={[
                              'font-semibold text-base leading-tight truncate transition-colors duration-200',
                              active ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                            ].join(' ')}>
                              {ch.title}
                            </h3>
                            {active && (
                              <div className="ml-2 w-2 h-2 bg-[#171744] rounded-full animate-pulse"></div>
                            )}
                          </div>

                          {ch.subtitle && (
                            <p className="text-sm text-gray-500 mt-1 truncate">
                              {ch.subtitle}
                            </p>
                          )}
                          {ch.wordCount && (
                            <p className="text-xs text-gray-400 mt-1">
                              {ch.wordCount.toLocaleString()} words
                            </p>
                          )}
                        </div>

                        <div className={[
                          'transition-all duration-200 opacity-0 transform translate-x-2',
                          active ? 'opacity-100 translate-x-0' : 'group-hover:opacity-50 group-hover:translate-x-0'
                        ].join(' ')}>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </li>
                  );
                })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function ChapterDetail({ chapter }) {
  if (!chapter) {
    return (
      <div className="p-10 h-full bg-white">
        <p className="text-gray-600">Select a chapter from the list.</p>
      </div>
    );
  }
  const number = typeof chapter.order === 'number' ? chapter.order : 1;

  return (
    <div className="p-10 h-full bg-white">
      <h2 className="text-2xl font-bold text-[#2b2b2b] mb-2">
        Chapter {number}: {chapter.title || 'Untitled'}
      </h2>
      <hr className="border-gray-300 mb-6" />

      {chapter.content ? (
        <p className="text-gray-700 leading-7 whitespace-pre-line">{chapter.content}</p>
      ) : (
        <p className="text-gray-600">No content.</p>
      )}

      {chapter.images?.length ? (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {chapter.images.map((img) => (
            <figure key={img.id} className="rounded overflow-hidden border bg-white">
              <img
                src={img.image}
                alt={img.caption || 'chapter image'}
                className="w-full h-36 object-cover"
              />
              {img.caption ? (
                <figcaption className="px-2 py-1 text-xs text-gray-600">{img.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RightRecommendations({ recs = [], name }) {
  return (
    <div className="p-10 h-full bg-white overflow-y-auto custom-scrollbar">
      <SectionHeading heading="Recommendations" sub={`${name}'s Recommendations`} />
      {!recs.length ? (
        <p className="text-gray-600">No recommendations yet.</p>
      ) : (
        recs.map(r => (
          <div key={r.id} className="bg-[#f1e8d6] p-5 max-w-3xl mb-6 mt-6 shadow-[1px_1px_9px_1px_#afafaf]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                {r.image ? (
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.9 0-8 2-8 5v1h16v-1c0-3-4.1-5-8-5z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black leading-tight capitalize text-base">
                  {r.name} Recommended {name}
                </p>
                <p className="text-[#21253A] text-sm leading-7 whitespace-pre-line my-4 font-normal">{r.content}</p>
                {r.skill ? <p className="text-sm text-gray-600">{r.skill}</p> : null}
                {r.linkedin_url ? (
                  <a
                    href={r.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white font-medium px-4 py-2 rounded cursor-pointer"
                    style={{ backgroundColor: '#171744' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8 8.5h3.8v2h.05c.53-1 1.83-2.05 3.77-2.05C19.6 8.45 22 10.3 22 14.13V23h-4v-7.4c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.82 1.91-2.82 3.89V23H8V8.5z" /></svg>
                    Visit LinkedIn Profile
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function SocialList({
  tabs,
  activeTab,
  onTabClick,
  posts = [],
  selectedId,
  onSelect,
  name = '',
}) {
  const groups = posts.reduce((acc, p) => {
    const k = (p.platform || 'Other').toLowerCase();
    (acc[k] ||= []).push(p);
    return acc;
  }, {});
  const order = ['facebook', 'linkedin', 'instagram', 'twitter', 'youtube', 'other'];

  return (
    <div className="h-full bg-white">
      <TabsBar tabs={tabs} active={activeTab} onChange={onTabClick} disabledKeys={['about', 'recs']} />

      <div className="p-6 pt-0">
        <div className="text-center mb-8">
          <h2 className="font-cinzel font-bold leading-tight tracking-wide text-2xl sm:text-3xl">
            <span className="inline-block px-3">
              From the social diaries of
            </span>
            <br />
            <span className="inline-block px-3 uppercase">
              {name}
            </span>
          </h2>
        </div>

        {!posts.length ? (
          <p className="text-gray-600 text-center">No posts yet.</p>
        ) : (
          order
            .filter(k => groups[k]?.length)
            .map(k => (
              <section key={k} className="mb-10">
                <h3 className="text-center font-times font-bold text-lg sm:text-2xl tracking-wide uppercase text-[#1b1b1b] mb-5">
                  {k}
                </h3>
                <ol className="list-decimal pl-6 max-w-3xl mx-auto space-y-6 text-[17px] leading-7 text-[#222]">
                  {groups[k].map(p => {
                    const active = selectedId === p.id;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => onSelect?.(p.id)}
                          className={[
                            'text-left w-full cursor-pointer transition-colors',
                            active ? 'text-[#171744]' : 'hover:text-blue-600'
                          ].join(' ')}
                          title={p.caption}
                        >
                          {p.caption || p.url}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))
        )}
      </div>
    </div>
  );
}

function SocialDetail({ post }) {
  if (!post) {
    return (
      <div className="p-10 h-full bg-white">
        <SectionHeading heading="Social Diary" />
        <p className="text-gray-600">Select a post from the right.</p>
      </div>
    );
  }
  const lower = (post.platform || '').toLowerCase();
  const isYT = lower === 'youtube' || /youtu\.be|youtube\.com/.test(post.url || '');
  const ytId = (() => {
    if (!isYT) return null;
    try {
      const u = new URL(post.url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      return u.searchParams.get('v');
    } catch { return null; }
  })();

  return (
    <div className="p-10 h-full bg-white">
      <SectionHeading heading={post.platform || 'Post'} sub={post.caption} />
      {isYT && ytId ? (
        <div className="aspect-video w-full max-w-3xl">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${ytId}`}
            title={post.caption || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <>
          <p className="text-gray-700 leading-7 whitespace-pre-line mb-4">{post.caption}</p>
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white font-medium px-4 py-2 rounded cursor-pointer"
            style={{ backgroundColor: '#3270dd' }}
          >
            Open post
          </a>
        </>
      )}
    </div>
  );
}

/* ------------------------------- main -------------------------------- */

export default function DiaryBook({ executive, chapters, socialPosts, recommendations }) {
  const bookRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const tabs = useMemo(
    () => [
      { key: 'about', label: 'About' },
      { key: 'recs', label: 'Recommendations' },
      { key: 'story', label: 'Biography' },
      { key: 'social', label: 'Social' },
    ],
    []
  );

  // 0=About, 1=Recs, 2=Chapters, 3=Social
  const [activeTab, setActiveTab] = useState(0);

  const name =
    executive.diary_title ||
    `${executive.user_first_name || ''} ${executive.user_last_name || ''}`.trim() ||
    'Executive';

  // figure out :id for URL routing
  const diaryId = String(executive?.id ?? executive?.user_id ?? '');
  const basePath = `/Diaries/Diary/${diaryId}`;
  const socialPath = `${basePath}/Social`;
  const chapterPath = `${basePath}/Chapters`;

  const socialIndex = tabs.findIndex(t => t.key === 'social'); // 3
  const chapterIndex = tabs.findIndex(t => t.key === 'story');  // 2

  // selections
  const firstChapter = useMemo(
    () => (chapters || []).slice().sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))[0],
    [chapters]
  );
  const [selectedChapterId, setSelectedChapterId] = useState(firstChapter?.id || null);
  useEffect(() => { setSelectedChapterId(firstChapter?.id || null); }, [firstChapter?.id]);

  const [selectedPostId, setSelectedPostId] = useState(socialPosts?.[0]?.id || null);
  useEffect(() => { setSelectedPostId(socialPosts?.[0]?.id || null); }, [socialPosts]);

  const spreads = useMemo(() => {
    const aboutLeft = (
      <IdentityCard
        key="about-left-card"
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(idx) => flipToTab(idx)}
        name={name}
        executive={executive}
        title={executive.job_title}
        company={executive.company}
        industry={executive.industry}
        location={[executive.city, executive.state, executive.country].filter(Boolean).join(', ')}
        image={executive.picture}
      />
    );
    const aboutRight = <RightAbout key="about-right" about={executive.about} name={name} />;

    const chaptersLeft = (
      <ChaptersList
        key="chapters-left-list"
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(idx) => flipToTab(idx)}
        chapters={chapters}
        selectedId={selectedChapterId}
        onSelect={setSelectedChapterId}
      />
    );
    const chaptersRight = (
      <ChapterDetail
        key="chapters-right-detail"
        chapter={(chapters || []).find(c => c.id === selectedChapterId) || firstChapter}
      />
    );

    const recsLeft = aboutLeft;
    const recsRight = <RightRecommendations key="recs-right" recs={recommendations} name={name} />;

    const socialLeft = (
      <SocialList
        key="social-left-list"
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(idx) => flipToTab(idx)}
        posts={socialPosts}
        selectedId={selectedPostId}
        onSelect={setSelectedPostId}
        name={name}
      />
    );
    const socialRight = (
      <SocialDetail
        key="social-right-detail"
        post={socialPosts?.find(p => p.id === selectedPostId) || socialPosts?.[0]}
      />
    );

    return [
      { key: 'about', left: aboutLeft, right: aboutRight },
      { key: 'recs', left: recsLeft, right: recsRight },
      { key: 'story', left: chaptersLeft, right: chaptersRight },
      { key: 'social', left: socialLeft, right: socialRight },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    executive, chapters, recommendations, socialPosts,
    activeTab, name, selectedChapterId, selectedPostId, firstChapter
  ]);

  const pages = useMemo(() => {
    const all = [];
    spreads.forEach(s => {
      all.push(<div key={`${s.key}-L`} className="h-full bg-white">{s.left}</div>);
      all.push(<div key={`${s.key}-R`} className="h-full bg-white">{s.right}</div>);
    });
    return all;
  }, [spreads]);

  // Flip helpers — only allow About(0) and Recs(1)
  const getApi = () => bookRef.current?.pageFlip?.();
  const tabToLeftPage = (tabIndex) => tabIndex * 2;

  function flipToTab(tabIndex) {
    // If it's Chapters or Social, navigate to route and DO NOT flip
    if (tabIndex === chapterIndex) {
      router.push(chapterPath);
      return;
    }
    if (tabIndex === socialIndex) {
      router.push(socialPath);
      return;
    }

    // Only About/Recs flip inside the book
    const api = getApi();
    if (!api) return;
    try { api.stopFlip?.(); } catch { }
    api.turnToPage?.(tabToLeftPage(tabIndex));
    setActiveTab(tabIndex);

    // Normalize URL back to base when inside the book
    if (pathname !== basePath) router.replace(basePath);
  }

  function handleFlip(e) {
    const leftPageIndex = e.data;
    const tabIndex = Math.floor(leftPageIndex / 2);

    // If somehow a flip tries to go past Recs, clamp to Recs
    if (tabIndex >= 2) {
      if (tabIndex === chapterIndex) router.push(chapterPath);
      if (tabIndex === socialIndex) router.push(socialPath);
      return;
    }

    if (tabIndex !== activeTab) setActiveTab(tabIndex);
    if (pathname !== basePath) router.replace(basePath);
  }

  // Start on About page (inside the book)
  useEffect(() => {
    setTimeout(() => flipToTab(0), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arrows: only move between About (0) and Recs (1)
  const goPrev = () => {
    if (activeTab <= 0) return;
    flipToTab(activeTab - 1);
  };
  const goNext = () => {
    if (activeTab >= 1) return; // don't go into Chapters/Social
    flipToTab(activeTab + 1);
  };

  return (
    <div className="mx-14">
      <div className="border-[#1e1c4d] border-[19px] border-x-[30px] rounded-[10px] m-10 relative overflow-visible">
        <div className="bg-white rounded-md overflow-visible relative">
          <div className="relative book-shadow overflow-visible">
            <div className="mx-auto overflow-hidden pb-10">
              <HTMLFlipBook
                width={720}
                height={550}
                size="stretch"
                minWidth={480}
                maxWidth={900}
                minHeight={420}
                maxHeight={550}
                maxShadowOpacity={0.2}
                showCover={false}
                usePortrait={true}
                drawShadow={true}
                ref={bookRef}
                className="!overflow-visible"
                onFlip={handleFlip}
                showPageCorners={false}
                disableFlipByClick={true}
                useMouseEvents={false}
              >
                {pages}
              </HTMLFlipBook>
            </div>
            <div className="absolute right-7 z-10">
              <Image src="/images/SHAPE.png" alt="ribbon" height={110} width={100} priority />
            </div>
          </div>
        </div>
      </div>

      {/* Arrows — only for About/Recs */}
      <div className="flex justify-center gap-2 mb-10">
        <button
          type="button"
          // onClick={goPrev}
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          className="w-12 h-12 hover:bg-[#28d7a2]  bg-[#1b1b4a] text-white grid place-items-center cursor-pointer disabled:opacity-50"
          aria-label="Previous"
        >
          <IoMdArrowDropleft color="white" className="relative" size={30} />
        </button>
        <button
          type="button"
          // onClick={goNext}
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}

          className="w-12 h-12 hover:bg-[#28d7a2] bg-[#1b1b4a] text-white grid place-items-center cursor-pointer disabled:opacity-50"
          disabled={activeTab >= 1}
          aria-label="Next"
        >
          <IoMdArrowDropright color="white" size={30} />
        </button>
      </div>

      <audio id="flip-audio" src="/flip.mp3" preload="auto" />
    </div>
  );
}
